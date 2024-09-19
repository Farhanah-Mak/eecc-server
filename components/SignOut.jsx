
"use client"

import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = async () => {
    const data = await signOut({
      redirect: true,
      callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "/",
    });
  };
  return (
    <button onClick={handleSignOut} className="signout_btn">
      Sign Out
    </button>
  );
}
