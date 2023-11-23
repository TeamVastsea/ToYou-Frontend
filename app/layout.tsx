import "@/styles/globals.css";
import {Metadata} from "next";
import {siteConfig} from "@/config/site";
import {fontSans} from "@/config/fonts";
import {AuthProvider, Providers} from "./providers";
import {Navbar} from "@/components/navbar";
import {Link} from "@nextui-org/link";
import clsx from "clsx";
import React from "react";
import {rgba} from "color2k";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "white"},
        {media: "(prefers-color-scheme: dark)", color: "black"},
    ],
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="cn" suppressHydrationWarning>
        <head>
            <title>图邮 - ToYou</title>
            <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
            className={clsx(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
            )}
        >
            <Providers themeProps={{attribute: "class", defaultTheme: "dark"}}>
                <div className="relative flex flex-col min-h-screen">
                    <Navbar/>
                    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                        <Toaster toastOptions={{
                            className: '',
                            duration: 5000,
                            style: {
                                background: rgba(0, 0, 0, 0),
                                color: rgba(0, 0, 0, 0),
                                borderStyle: 'none',
                                boxShadow: 'none'
                            },}} gutter={-15}/>
                            {children}
                    </main>
                    <footer className="w-full flex items-center justify-center py-3 flex-col sm:flex-row">
                        <Link href="https://beian.miit.gov.cn/" isExternal>
                            鄂ICP备2023011709号-7
                        </Link>
                        <p className="hidden sm:inline-block">&nbsp;|&nbsp;</p>
                        <Link
                            href="about"
                            className="flex items-center gap-1 text-current"
                        >
                            <span className="text-default-600">Powered by</span>
                            <p className="text-primary">Team Vastsea</p>
                            <span className="text-default-600">With ❤</span>
                        </Link>
                    </footer>
                </div>
            </Providers>
        </body>
        </html>
    );
}
