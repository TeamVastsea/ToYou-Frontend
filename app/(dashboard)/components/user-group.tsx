import { showPayModal } from '@/app/store';
import {Button} from '@nextui-org/button';
import { useAtom } from 'jotai';
export default function UserGroup(){
  const [isShow, setShow] = useAtom(showPayModal);
  return (
    <Button onPress={()=>setShow(true)}>
      升级用户组
    </Button>
  )
}