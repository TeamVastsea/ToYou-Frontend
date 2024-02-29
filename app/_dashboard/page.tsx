'use client'

import Uploader from "@/components/uploader";
import {Card, CardBody, CardFooter, Divider} from "@nextui-org/react";
import {Progress} from "@nextui-org/progress";
import {Button} from "@nextui-org/button";
import {redirect, useRouter} from "next/navigation";
import {Chip} from "@nextui-org/chip";
import {FiChevronsUp, FiUploadCloud} from "react-icons/fi";
import Picture from "@/components/picture";
import {PictureAPI} from "@/interface/pictureAPI";
import {useEffect, useState} from "react";
import {UserAPI} from "@/interface/userAPI";
import {getGroupPrice} from "@/config/prices";
import {PictureList} from "@/interface/model/picture";
import {SERVER_URL} from "@/interface/api";
import cookie from "react-cookies";
import {PriceInfo} from "@/components/price";
import {IsLoggedIn} from "@/interface/hooks";
import {RedirectType} from "next/dist/client/components/redirect";
import Cert from "./component/cert";
import IOC from "@/providers";
import {useAtom} from "jotai";
import {verify} from "../store";

const getPriceColor = (price: string) => {
    switch (price.toLowerCase()) {
        case 'free':
            return {
                base: 'bg-gradient-to-br default',
                content: "drop-shadow shadow-black text-black dark:text-white",
            }
        case 'started':
            return {
                base: 'bg-gradient-to-br from-sky-500 to-indigo-500',
                content: "drop-shadow shadow-black text-white",
            }
        case 'advanced':
            return {
                base: 'bg-gradient-to-br from-[#213cc4] to-[#9c13cd]',
                content: "drop-shadow shadow-black text-white",
            }
        case 'professional':
            return {
                base: 'bg-gradient-to-br from-[#d6ac22] to-[#d87b24]',
                content: "drop-shadow shadow-black text-white",
            }
        default:
            return {
                base: 'bg-gradient-to-br default text-white',
                content: "drop-shadow shadow-black text-black dark:text-white",
            }
    }
}


export default function Page() {
    if (!IsLoggedIn) {
        redirect('/authenticate', RedirectType.replace);
    }
    let [used, setUsed] = useState(0);
    let [total, setTotal] = useState(1);
    const [certify, setCertify] = useAtom(verify);
    let [timeLeft, setTimeLeft] = useState(100);
    let [timeDescription, setTimeDescription] = useState("无限时间");
    let [pictures, setPictures] = useState<PictureList>();
    let [group, setGroup] = useState<PriceInfo>()

    const [groupColor, setGroupColor] = useState({});
    const [drag, setDrag] = useState(false);
    const router = useRouter();

    function updateInfo() {
        UserAPI.getExtendedInformation().then((r) => {
            if (!r) {
                router.push("/authenticate");
                return;
            }
            let user = r;
            let price = getGroupPrice(r!.level!.level);
            setUsed(Number((user.used_space / 1024 / 1024).toFixed(2)));
            setTotal(Number(price.allSpace.substring(0, price.allSpace.length - 3)) * 1024);
            setGroup(price);
            setGroupColor(getPriceColor(r!.level.level as "free" | "started" | "advanced" | "professional"))
            const {start, end} = user.level;
            const [startDate, endDate] = [new Date(start).getTime(), new Date(end).getTime()]
            if (start || end){
                const now = new Date().getTime() / 1000;
                const valideDate = new Date(endDate * 1000);
                setTimeLeft(100 - (now - startDate) / (endDate - startDate) * 100);
                setTimeDescription(valideDate.toLocaleDateString() + "过期");
            }
        })
        PictureAPI.getPicturesList().then((r) => {
            setPictures(r);
        });
    }

    useEffect(() => {
        IOC.certify.getCertifyState()
            .then((e) => {
                if (e.data == false) {
                    setCertify(false)
                }
            })
            .catch(() => {
                setCertify(false)
            })
        if (used == 0 && total == 1) {
            updateInfo();
        }
    }, [])


    const deletePicture = (pid: string) => {
        const records = pictures?.records?.filter((record) => record.id !== Number(pid));
        console.log(records, pid);
        if (pictures && records) {
            setPictures({...pictures, records});
        }
    }
    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const {files} = event.dataTransfer;
        let totalSize = 0;
        const stack = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                totalSize += file.size;
                stack.push(PictureAPI.uploadFile(file))
            }
        }
        Promise.all(stack).finally(() => {
            updateInfo();
            setDrag(false)
        });
    }
    const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDrag(true)
    }
    const onDragLeave = () => {
        setDrag(false);
    }
    return (
        <div className="space-y-5 max-w-[450px] mx-auto">
            <Card className='max-w-4xl relative'>
                <CardBody className="static">
                    <div draggable
                         onDragEnter={(e) => onDragEnter(e)}
                         onDragLeave={onDragLeave}
                         onDrop={(ev) => onDrop(ev)}
                         onDragOver={e => e.preventDefault()}
                         className={
                             `absolute top-0 left-0 w-full h-full ${drag && 'bg-black bg-opacity-40'} ${drag && 'block z-20'}`
                         }>
                        {
                            drag && <span
                                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">松手上传</span>
                        }
                    </div>
                    <div className="space-y-5">
                        <div>
                            <Progress label={"空间已用"} value={used} className="max-w-md w-full pointer-events-none"
                                      maxValue={total}
                                      showValueLabel={true} formatOptions={{style: "percent"}}/>
                            {used} MB / {total} MB
                        </div>

                        <div>
                            <Progress label={"方案剩余时间"} value={timeLeft}
                                      className="max-w-md w-full pointer-events-none z-20"
                                      formatOptions={{style: "percent"}} isStriped color="secondary"/>
                            {timeDescription}
                        </div>
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter className={`${drag && 'z-10'}`}>
                    <a className="flex flex-wrap justify-center gap-5">
                        <Uploader label={
                            <a className="flex space-x-2 items-center">
                                <FiUploadCloud/>
                                <span>上传文件</span>
                            </a>
                        } onChange={(e) => {
                            let files = e.target.files!;
                            let file = files[0];
                            PictureAPI.uploadFile(file).then(() => {
                                updateInfo();
                            });
                        }}></Uploader>

                        <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white" onClick={() => {
                            router.push("/pricing")
                        }}>
                            <a className="flex space-x-1 items-center">
                                <FiChevronsUp style={{fontSize: 20}}/>
                                <span>升级方案</span>
                            </a>
                        </Button>

                        <a className="flex space-x-1 items-center">
                            <span>当前方案:</span>
                            <Chip style={{position: "relative", left: 5}}
                                  variant="shadow"
                                  classNames={groupColor}
                            >
                                {group?.name}
                            </Chip>
                        </a>
                    </a>
                </CardFooter>
            </Card>
            {/* eslint-disable-next-line react/jsx-key */}
            {pictures?.records == null ? <a>请上传</a> : pictures!.records.map(picture => <Picture
                url={SERVER_URL + "/picture/preview?shareMode=2&id=" + picture.id.toString() + "&token=" + cookie.load("token")}
                name={picture.fileName} pid={picture.id.toString()} group={group} onDelete={deletePicture}/>)}
            {/* <Picture url="https://t7.baidu.com/it/u=2961459243,2146986594&fm=193&f=GIF" name="雪景.png" pid="" onPress={onOpen} /> */}
            {!certify && <Cert/>}
        </div>
    )
}