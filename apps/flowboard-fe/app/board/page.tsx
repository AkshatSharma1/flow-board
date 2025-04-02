"use client"

import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKEND_URL } from "@/config";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";


export default function BoardPage() {

    const {isAuthenticated, isLoading} = useAuth();

    const router = useRouter();
    const [username, setUsername] = useState("");
    const [roomSlug, setRoomSlug] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [user, setUser] = useState<any>(null)

    //check if user already logged in
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
          router.push('/signIn')
        }
      }, [isAuthenticated, isLoading])
    
      if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
          Loading session...
        </div>
      }

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Please enter a username")
            return
        }

        if (!roomSlug.trim()) {
            setError("Please enter a room slug")
            return
        }

        setLoading(true);
        console.log(localStorage.getItem("token"))
        console.log(localStorage.getItem("user"))
        // const user = localStorage.getItem("user")

        try {
            // Store username in localStorage if not already there
            if (!user || !user.username) {
                const updatedUser = user ? { ...user, username } : { username }
                localStorage.setItem("user", JSON.stringify(updatedUser))
            }

            // First, get the roomId from the backend using the roomSlug
            const response = await fetch(`${BACKEND_URL}/room/${roomSlug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (!response.ok) {
                // If room doesn't exist, create it
                if (response.status === 404) {
                    const createResponse = await fetch(`${BACKEND_URL}/room`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ roomName: roomSlug, userId: user.id })
                    })

                    if (!createResponse.ok) {
                        throw new Error("Failed to create room")
                    }

                    const { roomId } = await createResponse.json();

                    // Navigate to the canvas with the new roomId
                    router.push(`/canvas/${roomId}`)
                    return
                } else {
                    throw new Error("Failed to find room")
                }
            }

            // Get the roomId from the response
            const { roomId } = await response.json()

            // Navigate to the canvas with the roomId
            router.push(`/canvas/${roomId}`)

        } catch (err) {
            console.error("Error joining room:", err)
            setError(err instanceof Error ? err.message : "Failed to join room")
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Join Drawing Room</CardTitle>
                    <CardDescription>
                        Enter a username and room name to start or join a collaborative canvas.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleJoinRoom}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="roomSlug"
                                placeholder="e.g., happy-tiger-123"
                                value={roomSlug}
                                onChange={(e) => setRoomSlug(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Use a memorable name that's easy to share
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Joining..." : "Join Room"}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            Share this room name with others so they can join your drawing session.
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}