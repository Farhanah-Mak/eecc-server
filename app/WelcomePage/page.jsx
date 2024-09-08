import "../globals.css"
import Link from "next/link";

export default function WelcomePage() {
    return (
      <>
        <div className="homepage_section">
          <h1 className="homepage_title">
            Welcome to the EECC File Management App
          </h1>
          <p className="homepage_text">
            Please sign in to view and manage files.
          </p>
          <Link href="/auth/signin" className="homepage_signin_btn btn" passHref legacyBehavior>
            <button className="homepage_signin_btn btn">Sign In</button>
          </Link>
        </div>
      </>
    );
}
