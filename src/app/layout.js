import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getContent } from "@/lib/data";
import { assetPath } from "@/lib/utils";

export const metadata = {
  metadataBase: new URL("https://agentsamad.github.io"),
  title: "Abdus Samad - Senior Game Developer",
  description:
    "Unity and C# engineer with 8 years of commercial game development across PC and mobile. Gameplay systems, editor tooling, and multiplayer architecture.",
  openGraph: {
    type: "website",
    title: "Abdus Samad - Senior Game Developer",
    description:
      "Unity and C# engineer with 8 years of commercial game development across PC and mobile. Gameplay systems, editor tooling, and multiplayer architecture.",
    images: [
      {
        url: assetPath("./assets/images/my-profile.jpg"),
        alt: "Abdus Samad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdus Samad - Senior Game Developer",
    description:
      "Unity and C# engineer with 8 years of commercial game development across PC and mobile. Gameplay systems, editor tooling, and multiplayer architecture.",
    images: [assetPath("./assets/images/my-profile.jpg")],
  },
  icons: {
    icon: [
      { url: assetPath("./favicon-as.svg"), type: "image/svg+xml" },
      { url: assetPath("./favicon-as.png"), type: "image/png", sizes: "64x64" },
    ],
    apple: assetPath("./apple-touch-icon-as.png"),
  },
};

export default function RootLayout({ children }) {
  const content = getContent();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
          integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 antialiased font-body min-h-screen">
        <TopNav />
        <div className="site-shell">
            <main className="site-main">
              <ScrollReveal>
                {children}
              </ScrollReveal>
            </main>
        </div>
        <footer className="site-footer site-width"><Link href="/">{content.sidebar.name}<span> · Senior Game Developer</span></Link><div><Link href="/projects">Projects</Link><Link href="/resume">Resume</Link><Link href="/blog">Blog</Link><Link href="/contact">Contact</Link></div><span className="footer-note">Built with care. Made for play.</span></footer>
      </body>
    </html>
  );
}
