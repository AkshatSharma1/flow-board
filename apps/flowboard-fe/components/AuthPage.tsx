"use client"

export function AuthPage({isSignIn}:{
    isSignIn: boolean
}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-2 m-2 bg-white rounded">
            <input type="text" placeholder="Email"/>
            <input type="text" placeholder="Password"/>
            <button onClick={()=>{}}>{isSignIn?"Sign In":"Sign Up"}</button>
        </div>
    </div>
}