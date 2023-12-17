import React, {useEffect, useState} from "react";
import {Table, TableBody, TableColumn, TableHeader} from "@nextui-org/table";
import {Share} from "@/interface/model/share";
import IOC from "@/providers";
import {Spinner} from "@nextui-org/react";
import {LoadingState} from "@react-types/shared";

export default function ShareTable() {
    const rowsPerPage = 10;
    let [pages, setPages] = useState(0);
    let [loading, setLoading] = useState<LoadingState>("loading");
    let [contents, setContents] = useState<Share[]>([]);
    let [current, setCurrent] = useState(1);
    let shareCache: Share[][] = [[]];

    useEffect(() => {
        IOC.picture.getAllSharedPicture(10, 1).then((r) => {
            setPages(r.pages);
            setContents(r.records);
            setLoading("idle");
            shareCache[1] = r.records;
        });
    })

    function changePage(page: number) {
        if (shareCache[page].length != 0) {
            setContents(shareCache[page]);
            return;
        }
        setLoading("loading");
        IOC.picture.getAllSharedPicture(10, 1).then((r) => {
            setPages(r.pages);
            setContents(r.records);
            setLoading("idle");
            shareCache[page] = r.records;
        });
    }


    return(
        <p className="text-left">
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>链接</TableColumn>
                    <TableColumn>密码</TableColumn>
                    <TableColumn>有效期</TableColumn>
                    <TableColumn>下载次数</TableColumn>
                    <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody loadingContent={<Spinner />} loadingState={loading}>

                    {/*<TableRow key="1">*/}
                    {/*    <TableCell><Link>c4fa6efb-187d-4067-84cb-5861f13a715b</Link></TableCell>*/}
                    {/*    <TableCell>无</TableCell>*/}
                    {/*    <TableCell>2023年12月30日</TableCell>*/}
                    {/*    <TableCell>3</TableCell>*/}
                    {/*    <TableCell>*/}
                    {/*        <ButtonGroup>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                修改密码*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                复制*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"} color={"danger"}>*/}
                    {/*                删除*/}
                    {/*            </Button>*/}
                    {/*        </ButtonGroup>*/}
                    {/*    </TableCell>*/}
                    {/*</TableRow>*/}
                    {/*<TableRow key="2">*/}
                    {/*    <TableCell><Link>c4fa6efb-187d-4067-84cb-5861f13a715b</Link></TableCell>*/}
                    {/*    <TableCell>已设置</TableCell>*/}
                    {/*    <TableCell>2024年3月30日</TableCell>*/}
                    {/*    <TableCell>2</TableCell>*/}
                    {/*    <TableCell>*/}
                    {/*        <ButtonGroup>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                修改密码*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                复制*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"} color={"danger"}>*/}
                    {/*                删除*/}
                    {/*            </Button>*/}
                    {/*        </ButtonGroup>*/}
                    {/*    </TableCell>*/}
                    {/*</TableRow>*/}
                    {/*<TableRow key="3">*/}
                    {/*    <TableCell><Link>c4fa6efb-187d-4067-84cb-5861f13a715b</Link></TableCell>*/}
                    {/*    <TableCell>无</TableCell>*/}
                    {/*    <TableCell>2024年1月5日</TableCell>*/}
                    {/*    <TableCell>4</TableCell>*/}
                    {/*    <TableCell>*/}
                    {/*        <ButtonGroup>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                修改密码*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                复制*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"} color={"danger"}>*/}
                    {/*                删除*/}
                    {/*            </Button>*/}
                    {/*        </ButtonGroup>*/}
                    {/*    </TableCell>*/}
                    {/*</TableRow>*/}
                    {/*<TableRow key="4">*/}
                    {/*    <TableCell><Link>c4fa6efb-187d-4067-84cb-5861f13a715b</Link></TableCell>*/}
                    {/*    <TableCell>已设置</TableCell>*/}
                    {/*    <TableCell>2024年1月3日</TableCell>*/}
                    {/*    <TableCell>3</TableCell>*/}
                    {/*    <TableCell>*/}
                    {/*        <ButtonGroup>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                修改密码*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"}>*/}
                    {/*                复制*/}
                    {/*            </Button>*/}
                    {/*            <Button size={"sm"} color={"danger"}>*/}
                    {/*                删除*/}
                    {/*            </Button>*/}
                    {/*        </ButtonGroup>*/}
                    {/*    </TableCell>*/}
                    {/*</TableRow>*/}
                </TableBody>
            </Table>
        </p>
    )
}