import {FormData} from "next/dist/compiled/@edge-runtime/primitives";

export async function upload(file: FileList, url: string, method: string) {
    for (let i = 0; i < file.length; i++) {
        let formData = new FormData();
        let fileElement = file.item(i);

        if (fileElement == null) {
            continue;
        }
        formData.append("file", fileElement);

        fetch(url, {
            method: method,
            body: formData
        }).then((r) => {
            console.debug(r)
        })
    }
}
