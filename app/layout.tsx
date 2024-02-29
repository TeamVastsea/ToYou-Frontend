import "@/styles/globals.css";
import {Metadata} from "next";
import {siteConfig} from "@/config/site";
import React from "react";
import {Providers} from "./providers";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
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
export default function Root(
    {children}: {children: React.ReactNode}
){
    return (
        <html lang="cn" suppressHydrationWarning>
        <head>
            <title>图邮 - ToYou</title>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
        </head>
        <body
            className={clsx(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
            )}
        >
            <Providers themeProps={{attribute: "class", defaultTheme: "dark"}}>
                <div className="relative min-h-screen">
                    {children}
                </div>
            </Providers>
        </body>
        </html>
    )
}