'use client'
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react"
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
                <section className="flex-auto h-full overflow-auto">
                    <div className="relative">
                        <div className="w-full h-full flex flex-col relative">
                            <div className="w-full py-7 h-fit basis-auto grow-0 shrink-0 flex items-center">
                                <Breadcrumbs className="w-full h-full px-4">
                                    <BreadcrumbItem>
                                        Images
                                    </BreadcrumbItem>
                                </Breadcrumbs>
                            </div>
                            {children}
                        </div>
                    </div>
                </section>
            </section>
        </section>
    )
}