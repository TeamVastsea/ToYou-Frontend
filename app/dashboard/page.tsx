import {Input} from "@nextui-org/input";

export default function Page() {
    return(
        <>
            <Input key={"password"} type="file" label="密码" placeholder="Password" style={{width: 300}}/>
        </>
    )
}