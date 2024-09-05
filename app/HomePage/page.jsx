  
"use client"
import "../globals.css";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage(){
    const { data: session } = useSession();
    return (
        session && (
            <>
            <div className="homepage_section">
                <p className="homepage_text">
                    Hello, {session.user.name}!
                    </p>
                <p className="homepage_text">Click to View or Download files</p>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Link href="/FetchFile" passHref legacyBehavior>
                        <button className="homepage_fetchfiles_btn btn">
                            View Files
                        </button>
                    </Link>
                    <button
                        className="homepage_signout_btn btn"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            </>
    )
 )}