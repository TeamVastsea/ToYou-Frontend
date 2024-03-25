'use client'

import NextLink from "next/link";
import {Link} from "@nextui-org/link";
import {button as buttonStyles} from "@nextui-org/theme";
import {siteConfig} from "@/config/site";
import {subtitle, title} from "@/components/primitives";
import {Card, CardFooter, CardHeader, Image} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {HiOutlineNewspaper} from "react-icons/hi";
import {FaLocationArrow} from "react-icons/fa6";
import {BsLightbulb} from "react-icons/bs";
import {IsLoggedIn} from "@/interface/hooks";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title()}>图邮&nbsp;</h1>
                <h1 className={title({color: "violet"})}>ToYou</h1>
                <br/>
                <h1 className={title()}>
                    轻松分享您的图片
                </h1>
                <h2 className={subtitle({class: "mt-4"})}>
                    免费, 快捷的图片共享平台
                </h2>
            </div>

            <div className="flex gap-3">
                <ClientOnly>
                    <Link
                        as={NextLink}
                        href={IsLoggedIn ? "/dashboard" : "/authenticate"}
                        className={buttonStyles({color: "primary", variant: "shadow"})}
                        prefetch
                    >
                        <FaLocationArrow size={20}/>
                        开始使用
                    </Link>
                    <Link
                        as={NextLink}
                        className={buttonStyles({variant: "bordered"})}
                        href={siteConfig.navItems[2].href}
                        prefetch
                    >
                        <HiOutlineNewspaper size={20}/>
                        日志
                    </Link>
                </ClientOnly>
            </div>

            <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 md:py-10">
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">乙方 | Party B</p>
                        <h4 className="text-white font-medium text-large">轻松同甲方预览效果</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-4.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">学生 | Students</p>
                        <h4 className="text-white font-medium text-large">简单向同伴分享快乐时光</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-3.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">专业摄影师 | Photographer</p>
                        <h4 className="text-white font-medium text-large">随时随地分享精美景色</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-2.jpeg"
                    />
                </Card>
                <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Clients Download</p>
                        <h4 className="text-black font-medium text-2xl">客户端下载</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card example background"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src="https://nextui.org/images/card-example-6.jpeg"
                    />
                    <CardFooter
                        className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                        <div>
                            <p className="text-black text-tiny">方便 快捷</p>
                            <p className="text-black text-tiny">在任何地方使用</p>
                        </div>
                        <Button className="text-tiny" color="primary" radius="full" size="sm">
                            点击下载
                        </Button>
                    </CardFooter>
                </Card>
                <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Contact Us</p>
                        <h4 className="text-white/90 font-medium text-xl">联系方式</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Relaxing app background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-5.jpeg"
                    />
                    <CardFooter
                        className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                        <div className="flex flex-grow gap-2 items-center">
                            <BsLightbulb color="white"/>
                            <div className="flex flex-col">
                                <p className="text-tiny text-white/60">有疑问，还是好点子？</p>
                                <p className="text-tiny text-white/60">快来和我们分享一下吧！</p>
                            </div>
                        </div>
                        <Button radius="full" size="sm">联系我们</Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
