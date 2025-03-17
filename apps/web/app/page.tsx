"use client"

import { useState } from "react";
// import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    }}>
      <input type="text" placeholder="Enter room id" style={{ padding: 10 }} value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={() => router.push(`/room/${roomId}`)} style={{ padding: 10 }}>Join Room</button>
    </div>
  )
}
