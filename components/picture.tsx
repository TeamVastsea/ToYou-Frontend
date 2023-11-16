import React, {useState} from "react";
import {Button, Card, CardFooter, Dropdown, DropdownItem, Image, useDisclosure} from "@nextui-org/react";
import copy from "copy-to-clipboard";
import {CheckLinearIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";
import {Message} from "@/components/message";
import {FiClipboard, FiShare} from "react-icons/fi";
import {Input} from "@nextui-org/input";
import cookie from "react-cookies";

export default function Picture(props: PictureProps) {
    let [isChecked, setIsChecked] = useState(false);
    let [isModelChecked, setIsModelChecked] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const descriptionOpen = useDisclosure();
    let [name, setName] = useState(props.name);
    let [shareMode, setShareMode] = useState(props.pubicMode == null ? "none" : props.pubicMode!);
    let timeout: NodeJS.Timeout | null = null;
    let modelTimeout: NodeJS.Timeout | null = null;
    let [link, setShareLink] = useState("");

    function generateShareLink() {
        setShareLink("https://ituyou.cc/pinture/share/089DD440-C94C-DD70-8DAB-B1FC4A5BE095");
        Message.success("已生成链接")
    }

    console.log(cookie.load("token"));

    // @ts-ignore
    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center"
                isPressable
                onPress={() => {
                    descriptionOpen.onOpen();
                }}
                style={{width: 450}}
            >
                <Image
                    alt={props.name}
                    className="object-cover"
                    width={450}
                    height={200}
                    src={props.url}
                    isZoomed
                />
                <CardFooter
                    className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-auto shadow-small ml-1 z-10 space-x-2">
                    <p className="text-tiny font-mono ">{props.name}</p>&nbsp;
                    <Button isIconOnly className="text-white bg-black/20 justify-center" variant="light" size="sm"
                            onClick={() => {
                                copy(props.url);

                                if (props.pubicMode == undefined || props.pubicMode == "private") {
                                    onOpen();
                                }

                                setIsChecked(true);

                                if (timeout != null) {
                                    clearTimeout(timeout);
                                    timeout = null;
                                }

                                timeout = setTimeout(() => {
                                    setIsChecked(false);
                                    timeout = null;
                                }, 1000);
                            }}>
                        {isChecked ? <CheckLinearIcon/> : <FiShare/>}
                    </Button>
                </CardFooter>
            </Card>

            <Modal isOpen={descriptionOpen.isOpen} onOpenChange={descriptionOpen.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">图片详情</ModalHeader>
                            <ModalBody>
                                <p>
                                    <Image
                                        alt={props.name}
                                        className="object-cover"
                                        width={450}
                                        height={200}
                                        src={props.url}
                                    />
                                </p>
                                <p>
                                    <Input placeholder={"图片名称"} value={name} onValueChange={setName}/>
                                </p>
                                <p className="flex items-center justify-center space-x-3">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                variant="bordered"
                                                className="capitalize"
                                            >
                                                {shareMode == "watermark" ? "水印" : shareMode == "compressed" ? "压缩" : shareMode == "none" ? "不公开" : "原图"}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={[shareMode!]}
                                            disabledKeys={["original"]}
                                            onAction={(key) => {
                                                setShareMode(key.toString());
                                                console.log(key);
                                                let description = key == "watermark" ? "水印" : key == "compressed" ? "压缩" : key == "none" ? "不公开" : "原图";
                                                Message.success("已经设置公开等级为：" + description);
                                            }}
                                        >
                                            <DropdownItem key="none">不公开</DropdownItem>
                                            <DropdownItem key="watermark">公开水印版本</DropdownItem>
                                            <DropdownItem key="compressed">公开压缩版本</DropdownItem>
                                            <DropdownItem key="original"
                                                          description="需要高级用户">公开原图</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <div>
                                        {link == "" ?
                                            <Button disabled={shareMode == "none"} color={shareMode == "none" ? "default" : "primary"} onClick={generateShareLink}>生成分享链接</Button> :
                                            <Input value={link} style={{width: 260}} variant={"underlined"} endContent={
                                                <Button isIconOnly style={{position: "relative", left: 7}} size="sm"
                                                        onClick={() => {
                                                            copy(link);

                                                            setIsModelChecked(true);

                                                            if (modelTimeout != null) {
                                                                clearTimeout(modelTimeout);
                                                                modelTimeout = null;
                                                            }

                                                            modelTimeout = setTimeout(() => {
                                                                setIsModelChecked(false);
                                                                timeout = null;
                                                            }, 1000);
                                                        }}>
                                                    {isModelChecked ? <CheckLinearIcon/> : <FiClipboard/>}
                                                </Button>}>
                                            </Input>}
                                    </div>
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    取消
                                </Button>
                                <Button color="primary" onPress={() => {
                                    Message.success("已保存");
                                    onClose();
                                }}>
                                    保存
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton={true}
                   backdrop={"blur"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">设置公开等级</ModalHeader>
                            <ModalBody>
                                <p>
                                    链接已复制，但是您还没有未图片设置过公开等级，这意味着即使获取了链接，也无法访问图片。
                                    请注意，链接每36h会过期，但是公开等级不会自动重置。<br/>
                                    设置等级后本对话框不会再次弹出，您可以在图片详情页面更改公开等级。
                                </p>
                                <p>
                                    是否现在设置公开等级？
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant={"light"} onPress={onClose}>
                                    取消
                                </Button>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button color="danger">
                                            设置
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="public" disabledKeys={["original"]} onAction={(key) => {
                                        setShareMode(key.toString());
                                        let description = key == "watermark" ? "水印" : key == "compressed" ? "压缩" : "原图";
                                        Message.success("已经设置公开等级为：" + description);
                                        onClose();
                                    }}>
                                        <DropdownItem key="watermark">公开水印版本</DropdownItem>
                                        <DropdownItem key="compressed">公开压缩版本</DropdownItem>
                                        <DropdownItem key="original" description="需要高级用户">公开原图</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export type PictureProps = {
    url: string,
    name: string,
    pubicMode?: string,
}
