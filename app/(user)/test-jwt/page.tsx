"use client";
import { error } from "console";
import React, { useState } from "react";

export default function TestJWT() {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(null);
  const [unAuthorized, setUnAuthorized] = useState(false);
  const handleLogin = async () => {
    const email = "sangsokea109@gmail.com";
    const password = " admin@1234";
    fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Data:", data);
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch((error) => console.log(error));
  };
  // handle update patch
  const handlePartialUpdate = async () => {
    const body = {
      name: "da da",
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/499/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })
    if (res.status===401){
      setUnAuthorized(true)
    }else{
      setUnAuthorized(false)
    }
    const data = await res.json()
    console.log(`data from partial update : `,data)
  };
  // handle refresh
  const handleRefreshToken = async () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.accessToken)
        console.log(data)
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <main className="h-screen grid place-content-center">
        <h1 className="text-6xl">Login in Myheart</h1>
        <button
          className="my-4 p-4 bg-blue-500 rounded-xl text-3xl text-gray-200 hover:bg-black"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="my-4 p-4 bg-red-500 rounded-xl text-3xl text-gray-200 hover:bg-red-800"
          onClick={handlePartialUpdate} 
        >
          Update
        </button>
        {unAuthorized && (
          <button
            className="my-4 p-4 bg-red-500 rounded-xl text-3xl text-gray-200 hover:bg-red-800"
            onClick={handleRefreshToken}
          >
            Refresh
          </button>
        )}
      </main>
    </div>
  );
}