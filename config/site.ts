export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "ImageSnapshot",
    description: "Make beautiful websites regardless of your design experience.",
    navItems: [
        {
            label: "首页",
            href: "/",
        },
        {
            label: "文档",
            href: "/docs",
        },
        {
            label: "价格",
            href: "/pricing",
        },
        {
            label: "日志",
            href: "/blog",
        },
        {
            label: "关于",
            href: "/about",
        }
    ],
    navMenuItems: [
        {
            label: "Profile",
            href: "/profile",
        },
        {
            label: "Dashboard",
            href: "/dashboard",
        },
        {
            label: "Projects",
            href: "/projects",
        },
        {
            label: "Team",
            href: "/team",
        },
        {
            label: "Calendar",
            href: "/calendar",
        },
        {
            label: "Settings",
            href: "/settings",
        },
        {
            label: "Help & Feedback",
            href: "/help-feedback",
        },
        {
            label: "Logout",
            href: "/logout",
        },
    ],
    links: {
        github: "https://github.com/nextui-org/nextui",
        twitter: "https://twitter.com/getnextui",
        docs: "https://nextui.org",
        discord: "https://discord.gg/9b6yyZKmH4",
        sponsor: "https://patreon.com/jrgarciadev"
    },
};
