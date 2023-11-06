import toast from "react-hot-toast";
import {Card, CardBody} from "@nextui-org/react";
import React from "react";

export class Message {
    static message(message: string) {
        let id = toast(<Card isPressable
                             className="bg-background dark:bg-default-100" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            {message}
        </CardBody></Card>);
    }

    static success(message: string) {
        let id = toast(<Card isPressable
                             className="bg-success dark:bg-success" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            {message}
        </CardBody></Card>);
    }

    static error(message: string) {
        let id = toast(<Card isPressable
                             className="bg-danger dark:bg-danger" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            {message}
        </CardBody></Card>);
    }

    static warning(message: string) {
        let id = toast(<Card isPressable
                             className="bg-warning dark:bg-warning" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            {message}
        </CardBody></Card>);
    }
}