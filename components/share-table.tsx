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

                </TableBody>
            </Table>
        </p>
    )
}