import "@/styles/globals.css";
import {Metadata} from "next";
import {siteConfig} from "@/config/site";
import {fontSans} from "@/config/fonts";
import {AuthProvider, Providers, ToastProvider} from "../providers";
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
        <main className="w-full h-full">
            <Navbar/>
            <section className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                <ToastProvider>
                    <Toaster toastOptions={{
                        className: '',
                        duration: 5000,
                        style: {
                            background: rgba(0, 0, 0, 0),
                            color: rgba(0, 0, 0, 0),
                            borderStyle: 'none',
                            boxShadow: 'none'
                        }
                    }
                    } gutter={-15}/>
                    <AuthProvider whiteList={['/', '/authenticate', '/pricing', '/authenticate/login', '/authenticate/register']}>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </section>
            <footer className="max-w-[900px] mx-auto px-6 py-3 w-full flex flex-col gap-2 text-sm">
                <ul className="w-fit flex gap-2 mx-auto">
                    <li>
                        <Link href="#" size="sm">
                            使用条款
                        </Link>
                    </li>
                    <li>|</li>
                    <li>
                        <Link href="#" size="sm">
                            用户协议
                        </Link>
                    </li>
                    <li>|</li>
                    <li>
                        <Link href="/about" size="sm">
                            关于我们
                        </Link>
                    </li>
                </ul>
                <div className="text-center">
                    <Link href="https://beian.miit.gov.cn/" isExternal size="sm">
                        鄂ICP备2023011709号-7
                    </Link>
                    <div className="mx-auto text-default-600 text-center">
                            <span>
                                Copyright &copy;2023 Vastsea, All rights reserved - ToYou Project
                            </span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
