"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(
            isSignIn ? "Sign in button clicked" : "Sign up button clicked",
            { email, password }
        );

        //send data to http backend to sign in to account
        setError("");
        setLoading(true);

        //now if signIn is not true
        if (!isSignIn && password != confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const endpoint = isSignIn ? "/sign-in" : "/sign-up";

            const body = isSignIn
                ? { email, password }
                : { email, password, username };

            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message)
                throw new Error(data.message || "Something went wrong");
            }

            if (isSignIn) {
                // Store token in localStorage (or use a more secure method)
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect to dashboard or home
                router.push("/board");
            } else {
                // Redirect to sign in page after successful sign up
                router.push("/signIn");
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignIn ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignIn
                            ? "Enter your credentials to access your account"
                            : "Fill in your details to create a new account"}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-4">
                        {!isSignIn && (
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {isSignIn && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {!isSignIn && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full my-2" disabled={loading}>
                            {loading ? "Processing..." : (isSignIn ? "Sign In" : "Create Account")}
                        </Button>

                        <div className="flex items-center gap-2 w-full">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                OR
                            </span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="text-center text-sm mt-4">
                            {isSignIn
                                ? "Don't have an account yet?"
                                : "Already have an account?"}{" "}
                            <Link
                                href={isSignIn ? "/signUp" : "/signIn"}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                                {isSignIn ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
    </div>
    );
}
