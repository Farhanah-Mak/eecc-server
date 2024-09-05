

"use client"
import "../globals.css"
import { signIn } from "next-auth/react";
import Link from "next/link";
import SignIn from "../auth/signin/page";
import { useState, useEffect } from "react";

export default function WelcomePage() {
const [users, setUsers] = useState([])
    return (
      <>
        <div className="homepage_section">
          <h1 className="homepage_title">
            Welcome to the EECC File Management App
          </h1>
          <p className="homepage_text">
            Please sign in to view and manage files.
          </p>
          <Link href="/auth/signin" passHref legacyBehavior>
            <button className="homepage_signin_btn btn">Sign In</button>
          </Link>
        </div>
      </>
    );
}
