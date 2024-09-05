import AuthProvider from "./context/AuthProvider";
import "./globals.css"
import Image from "next/image";

export const metadata = {
  title: "EECC Server",
  description: "File Management System",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link
        rel="icon"
        type="image/png"
        href="/eecc_logo.png"
        sizes="50x50"
      />
      <body>
        <AuthProvider>
          <section className="background">
            <Image
              src="/logo.png"
              alt=""
              class="homepage_image_logo img_left"
              width={100}
              height={44}
            />
            {children}
            <Image
              src="/logo.png"
              alt=""
              class="homepage_image_logo img_right"
              width={100}
              height={44}
            />
          </section>
        </AuthProvider>
      </body>
    </html>
  );
}


