'use client'

import React, {useEffect} from 'react'
import {title} from "@/components/primitives";
import {Button} from "@nextui-org/button";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    return (
        <div className={"text-center space-y-10"}>
            <h1 className={title()}>错误</h1><br/>
            <div>
                <a>网站发生了错误。如需帮助，请把以下内容提供给支持人员：</a><br/><br/>
                <a>{error.name} in </a><br/>
                <a>{error.message}</a><br/>
                <a>{error.stack}</a>
            </div>
            <Button onClick={reset}>
                重置页面
            </Button>
        </div>
    )
}