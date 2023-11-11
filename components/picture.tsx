import React, {useState} from "react";
import {Button, Card, CardFooter, Image, useDisclosure} from "@nextui-org/react";
import copy from "copy-to-clipboard";
import {CheckLinearIcon, CopyLinearIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";

export default function Picture(props: PictureProps) {
    let [isChecked, setIsChecked] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    let timeout: NodeJS.Timeout | null = null;

    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center"
                isPressable
            >
                <Image
                    alt="Woman listing to music"
                    className="object-cover"
                    height={200}
                    src={props.url}
                />
                <CardFooter
                    className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-auto shadow-small ml-1 z-10">
                    <p className="text-tiny font-mono text-white/80">https://api.cyrilstudio.top/bing/image.php</p>&nbsp;
                    <Button isIconOnly className="text-white bg-black/20 justify-center" variant="light" size="sm"
                            onClick={() => {
                                copy(props.url);

                                if (props.isPubic == undefined || !props.isPubic) {
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
                        {isChecked ? <CheckLinearIcon/> : <CopyLinearIcon/>}
                    </Button>
                </CardFooter>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton={true}
                   backdrop={"blur"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">图片未公开</ModalHeader>
                            <ModalBody>
                                <p>
                                    虽然链接已复制到剪贴板，但是该图片未设置为公开。
                                    这意味着任何未登录到您账号的设备和环境都无法通过该链接访问您的图片。
                                    图片公开后，任何人均可访问您的图片。
                                </p>
                                <p>
                                    是否将图片设为公开？
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    公开
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    不公开
                                </Button>
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
    isPubic?: boolean,
}
