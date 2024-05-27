'use client';

import { profile as ProfileAtom, showPayModal } from "@/app/store";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import {Dropdown,DropdownTrigger,DropdownItem, DropdownMenu} from '@nextui-org/dropdown';
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { PriceInfo } from "./price";
import { getNumberId, idTable, maxId, priceAdvanced, priceFree, priceProfessional, priceStarted } from "@/config/prices";
import { title } from "./primitives";
import { Message } from "./message";
import IOC from "@/providers";
interface PriceListProps {
  onSelect?: (
    level: string,
  )=>void,
  pricesList: PriceInfo[]
}
const PriceList = (props: PriceListProps) => {
  const profile = useAtomValue(ProfileAtom);
  const {pricesList, onSelect} = props;
  const [selectedId, setId] = useState(
    Math.min(idTable[profile?.level.level.toUpperCase() ?? 'FREE']+1, maxId)
  );
  const [qrVisibility, setVisibility] = useState(false);
  const onWheel = (ev: React.WheelEvent<HTMLElement>) => {
    ev.stopPropagation();
    ev.currentTarget.scrollTo({
      left: ev.currentTarget.scrollLeft + (70*(ev.deltaY / 100)),
      behavior: "smooth"
    })
  }
  const selectLevel = (price: PriceInfo) => {
    const {id} = price;
    const priceId = idTable[id];
    const profileId = idTable[profile?.level.level.toUpperCase() ?? 'FREE'];
    onSelect?.(price.id)
    if (profileId >= priceId){
      Message.error('您不能降级购买用户组');
      return;
    }
    setId(priceId);
  }
  useEffect(()=>{
    setId(
      Math.min(idTable[profile?.level.level.toUpperCase() ?? 'FREE'] + 1, maxId)
    )
  }, [profile]);
  return (
    <div className="w-full flex gap-4 whitespace-nowrap py-1 overflow-x-auto no-scrollbar" onWheel={onWheel}>
      {
        pricesList.map((price) => (
          <div key={price.id}
            aria-disabled={idTable[price.id] <= idTable[profile?.level.level.toUpperCase() ?? 'FREE']}
            aria-selected={selectedId === idTable[price.id]}
            onClick={()=>selectLevel(price)}
            className="
              p-4 rounded-md flex flex-col items-center gap-2 bg-default/80 aria-disabled:bg-default/50
              aria-selected:bg-primary aria-[disabled=false]:cursor-pointer
              group
            "
          >
            <h2 className={`${title({size: 'xs'})} group-aria-disabled:text-default-foreground/50`}>{price.plainName}</h2>
            <p className="group-aria-disabled:text-default-foreground/50">
              { price.price === 0 ? '免费' : `${price.price}元/月` }
            </p>
          </div>
        ))
      }
    </div>
  )
}

type PayQrProps = {
  period: string;
  level: string;
}

const PayQr = (props:PayQrProps) => {
  const {period:rawPeriod, level} = props;
  const period = Number.isNaN(parseInt(rawPeriod)) ? 1 : parseInt(rawPeriod);
  const date = new Date().toString();
  const [qrUrl, setQRUrl] = useState('');
  useEffect(()=>{
    IOC.pay.wechat({
      level,
      period,
      start_date: date.toString()
    })
    .then((res) => {console.log(res)})
  },[])
  return (<></>)
}

export function PayModal(){
  const [isOpen, setOpen] = useAtom(showPayModal);
  const profile = useAtomValue(ProfileAtom);
  const [level, setLevel] = useState(profile?.level.level ?? 'FREE');
  const [qrVisibility, setQRVisibility] = useState(false);
  const [periods, setPeriods] = React.useState(new Set(["1"]));
  const period = useMemo(() => Array.from(periods)[0], [periods]);
  useEffect(()=>{
    setQRVisibility(
      getNumberId(profile?.level.level ?? 'FREE') < getNumberId(level)
    )
  }, [level, profile?.level.level]);
  const close = () => {
    setOpen(false)
  }
  const onSelectLevel = (id: string) => setLevel(id);
  const prices = [priceFree, priceStarted, priceAdvanced, priceProfessional]
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          定价
        </ModalHeader>
        <ModalBody>
          <PriceList pricesList={prices} onSelect={onSelectLevel} />
          {
            qrVisibility ? <PayQr period={period} level={level} /> : null
          }
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={close}>
            再想想
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button color="primary" onPress={close}>
                购买
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="时长"
              onAction={setPeriods as any}
              selectedKeys={periods}
              selectionMode="single"
            >
              <DropdownItem key="1">
                1月
              </DropdownItem>
              <DropdownItem key="3">
                3月
              </DropdownItem>
              <DropdownItem key="6">
                6月
              </DropdownItem>
              <DropdownItem key="12">
                12月
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}