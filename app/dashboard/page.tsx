'use client'

import Uploader from "@/components/uploader";
import {Card, CardBody, CardFooter, Divider} from "@nextui-org/react";
import {Progress} from "@nextui-org/progress";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {Chip} from "@nextui-org/chip";
import {FiChevronsUp, FiUploadCloud} from "react-icons/fi";

export default function Page() {
    let used = 1050;
    let total = 2048;

    let timeLeft = 17;
    let timeTotal = 30;

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
                                  maxValue={timeTotal}
                                  formatOptions={{style: "percent"}} isStriped color="secondary"/>
                        {timeLeft} 天 / {timeTotal} 天
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
                            let file = e.target.files;
                            console.log(e.target.files);
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
        </div>
    )
}