'use client'

import Uploader from "@/components/uploader";
import {Card, CardBody, CardFooter, Divider} from "@nextui-org/react";
import {Progress} from "@nextui-org/progress";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {Chip} from "@nextui-org/chip";
import {FiChevronsUp, FiUploadCloud} from "react-icons/fi";
import Picture from "@/components/picture";
import {PictureAPI} from "@/interface/pictureAPI";
import {useState} from "react";
import {UserAPI} from "@/interface/userAPI";
import {getGroupPrice} from "@/config/prices";

export default function Page() {
    let [used, setUsed] = useState(0);
    let [total, setTotal] = useState(1);

    let [timeLeft, setTimeLeft] = useState(100);
    let [timeDescription, setTimeDescription] = useState("无限时间");


    if (used == 0 && total == 1) {
        UserAPI.getExtendedInformation().then((r) => {
            if (r == undefined) {
                router.push("/authenticate");
            }
            let user = r!;
            let price = getGroupPrice(r!.extend!.userGroup);

            setUsed(Number((user.extend!.storageUsed / 1024 / 1024).toFixed(2)));
            setTotal(Number(price.allSpace.substring(0, price.allSpace.length - 3)) * 1024);
            if (user.extend!.groupStartDate != undefined || user.extend!.groupEndDate != undefined) {
                if (user.extend!.groupStartDate != 0 && user.extend!.groupEndDate != 0) {
                    let startDate = user.extend!.groupStartDate!;
                    let endDate = user.extend!.groupEndDate!;
                    let now = new Date().getTime() / 1000;
                    let validDate = new Date(endDate * 1000);

                    setTimeLeft(100 - (now - startDate) / (endDate - startDate) * 100);
                    setTimeDescription(validDate.toLocaleDateString() + " 过期");
                }
            }
        })
        PictureAPI.getPicturesList().then();
    }


    let router = useRouter();

    return (
        <div className="space-y-5">
            <Card className="max-w-4xl">
                <CardBody className="space-y-5">
                    <div>
                        <Progress style={{width: 400}} label={"空间已用"} value={used} className="max-w-md"
                                  maxValue={total}
                                  showValueLabel={true} formatOptions={{style: "percent"}}/>
                        {used} MB / {total} MB
                    </div>

                    <div>
                        <Progress style={{width: 400}} label={"方案剩余时间"} value={timeLeft} className="max-w-md"
                                  formatOptions={{style: "percent"}} isStriped color="secondary"/>
                        {timeDescription}
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter>
                    <a className="flex space-x-5">
                        <Uploader label={
                            <a className="flex space-x-2 items-center">
                                <FiUploadCloud/>
                                <span>上传文件</span>
                            </a>
                        } onChange={(e) => {
                            let files = e.target.files!;
                            let file = files[0];
                            PictureAPI.uploadFile(file).then(() => {
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
                                  classNames={{
                                      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                                      content: "drop-shadow shadow-black text-white",
                                  }}
                            >
                                高级
                            </Chip>
                        </a>
                    </a>
                </CardFooter>
            </Card>

            <Picture url="https://t7.baidu.com/it/u=2961459243,2146986594&fm=193&f=GIF" name="雪景.png"/>
        </div>
    )
}