import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import SidebarProfile from "@/components/layout/SidebarProfile";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getContent } from "@/lib/data";

export const metadata = {
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
        url: "/assets/images/my-profile.jpg",
        alt: "Abdus Samad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdus Samad - Senior Game Developer",
    description:
      "Unity and C# engineer with 8 years of commercial game development across PC and mobile. Gameplay systems, editor tooling, and multiplayer architecture.",
    images: ["/assets/images/my-profile.jpg"],
  },
  icons: {
    icon: "/assets/images/logo.png",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
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
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 pt-28 pb-20 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
            <SidebarProfile sidebar={content.sidebar} />
            <main className="flex-1 min-w-0">
              <ScrollReveal>
                {children}
              </ScrollReveal>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
