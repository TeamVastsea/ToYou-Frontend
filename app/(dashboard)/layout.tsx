
import { SideBar, SideBarItem } from "./components/side-bar"
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
}){

    return (
        <section className="
            flex min-w-0 h-full w-full max-w-full
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            xl:max-w-6xl xl:h-[calc(100vh_-_40px)]
        ">
            <section className="w-full flex bg-default-50 overflow-hidden xl:rounded-3xl">
                <SideBar />
                <section className="flex-auto h-full">
                    {children}
                </section>
            </section>
        </section>
    )
}