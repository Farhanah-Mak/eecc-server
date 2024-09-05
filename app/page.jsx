"use client"
import "./globals.css"
import { useSession } from "next-auth/react";
import HomePage from "./HomePage/page";
import WelcomePage from "./WelcomePage/page";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="homepage_container">
      <div className="homepage_content">
        {!session ? <WelcomePage /> : <HomePage />}
      </div>
    </div>
  )
}

