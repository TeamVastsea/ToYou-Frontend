import React from "react";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Spinner} from "@nextui-org/react";
import {useSharedLinks} from "@/app/setting/hooks/use-shared-links";
import {Link} from "@nextui-org/link";
import {Button, ButtonGroup} from "@nextui-org/button";
import {FaLock, FaLockOpen} from "react-icons/fa6";
import {FiClipboard, FiEdit3, FiTrash2} from "react-icons/fi";

export default function ShareTable({loading, list, page, current, setCurrent}: ReturnType<typeof useSharedLinks>) {
    return (
        <p className="text-left">
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>链接</TableColumn>
                    <TableColumn>密码</TableColumn>
                    <TableColumn>有效期</TableColumn>
                    <TableColumn>下载次数</TableColumn>
                    <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody loadingContent={<Spinner/>} emptyContent={"这里没有数据哦"} loadingState={loading}
                           items={list}>
                    {(item) => (
                        <TableRow>
                            <TableCell><Link>{item.fileName}</Link></TableCell>
                            <TableCell>{item.password ? <FaLock/> : <FaLockOpen/>}</TableCell>
                            <TableCell>{new Date(item.expiry).toLocaleString()}</TableCell>
                            <TableCell>{item.downloads}</TableCell>
                            <TableCell>
                                <ButtonGroup>
                                    <Button size={"sm"} isIconOnly><FiEdit3/></Button>
                                    <Button size={"sm"} isIconOnly><FiClipboard/></Button>
                                    <Button size={"sm"} isIconOnly color={"danger"}><FiTrash2/></Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </p>
    )
}
