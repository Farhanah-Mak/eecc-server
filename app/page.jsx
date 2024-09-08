import "./globals.css"
import HomePage from "./HomePage/page";
import WelcomePage from "./WelcomePage/page";
import { getServerSession, authOptions } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="homepage_container">
      <div className="homepage_content">
        {!session ? <WelcomePage /> : <HomePage />}
      </div>
    </div>
  )
}

