'use client';

import { profile, profile as ProfileAtom, showPayModal } from "@/app/store";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import {Dropdown,DropdownTrigger,DropdownItem, DropdownMenu} from '@nextui-org/dropdown';
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react"
import { PriceInfo } from "./price";
import { getNumberId, idTable, maxId, priceAdvanced, priceFree, priceProfessional, prices, priceStarted } from "@/config/prices";
import { title } from "./primitives";
import { Message } from "./message";
import IOC from "@/providers";
import { camelCase } from "@/hooks/useCamelCase";
import { FaAngleDown } from "react-icons/fa";
import { useDate } from "@/hooks/useDate";
import {QRCodeCanvas} from 'qrcode.react';

interface PriceListProps {
  onSelect?: (
    price: PriceInfo | null,
    period: string
  )=>void,
  pricesList: PriceInfo[]
}
const PriceList = (props: PriceListProps) => {
  const profile = useAtomValue(ProfileAtom);
  const {pricesList, onSelect} = props;
  const [periods, setPeriods] = useState(new Set(["1"]));
  const [activePrice, setActivePrice] = useState<PriceInfo|null>(null)
  const period = useMemo(() => Array.from(periods).join(''), [periods]);
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
    if (profileId >= priceId){
      Message.error('您不能降级购买用户组');
      return;
    }
    setActivePrice(price);
    // onSelect?.(price)
    setId(priceId);
  }
  useEffect(()=>{
    setId(
      Math.min(idTable[profile?.level.level.toUpperCase() ?? 'FREE'] + 1, maxId)
    )
  }, [profile]);
  useEffect(()=>{
    onSelect?.(activePrice, period)
  }, [activePrice, period]);
  useEffect(()=>{
    const price = pricesList[Math.min(selectedId, maxId)]
    selectLevel(price);
    setActivePrice(price)
  }, []);
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
              group h-fit
            "
          >
            <h2 className={`${title({size: 'xs'})} group-aria-disabled:text-default-foreground/50`}>{price.plainName}</h2>
            {
              selectedId === idTable[price.id] ? (
                <div>
                    <Dropdown>
                    <DropdownTrigger>
                      <Button onPress={close} size="sm" color="primary" >
                        {period}月 <FaAngleDown className="w-5 h-5" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                      aria-label="时长"
                      disallowEmptySelection
                      onSelectionChange={(val) => {
                        setPeriods(
                          new Set(Array.from(val as Set<string>)) 
                        )
                      }}
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
                </div>
                ) : null
              }
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
  const period = useMemo(() => Number.isNaN(parseInt(rawPeriod)) ? 1 : parseInt(rawPeriod), [rawPeriod]);
  const [qrUrl, setQRUrl] = useState('');
  const date = useDate();
  const [money, setMoney] = useState(
    prices.filter((p) => p.id.toLowerCase() === level.toLowerCase())[0].price * period
  )
  const [,setProfile] = useAtom(profile)
  const updateUserInfo = () => {
    IOC.user.getExtendedInformation()
    .then((res) => res.data)
    .then((res)=>{
      console.log(res);
      return res;
    })
    .then((data) => setProfile(data))
  }
  useEffect(()=>{
    setMoney(
      prices.filter((p) => p.id.toLowerCase() === level.toLowerCase())[0].price * period
    )
    const {year, month, day} = date.getDateObject()
    IOC.pay.wechat({
      level,
      period,
      start_date: date.toString('-', `${year}`, `${month}`, `${day}`)
    })
    .then((res) => {
      setQRUrl(res.data)
    })
  },[level, period])
  return (
    <div className="w-full">
      <div className="w-fit flex flex-col gap-2 justify-center items-center mx-auto">
        <QRCodeCanvas value={qrUrl} size={128} className="rounded-md" />
        <div className="text-base">
          <span>总计: {money}元</span>
        </div>
        <Button onClick={updateUserInfo}>
          我已支付
        </Button>
        <div className="text-tiny">
          <div>
            <span className="text-center">
              支付后则表示您知晓且同意
            </span>
          </div>
          <div className="w-fit mx-auto">
            <a href="#" className="text-primary">ToYou 虚拟产品购买协议</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PayModal(){
  const [isOpen, setOpen] = useAtom(showPayModal);
  const profile = useAtomValue(ProfileAtom);
  const [level, setLevel] = useState(profile?.level.level ?? 'Free');
  const [qrVisibility, setQRVisibility] = useState(false);
  const [period, setPeriods] = useState('1');
  useEffect(()=>{
    console.log(period);
  },[period])
  useEffect(()=>{
    setQRVisibility(
      getNumberId(profile?.level.level ?? 'Free') < getNumberId(level)
    )
  }, [level, profile?.level.level]);
  const onSelectLevel = (price: PriceInfo | null, period: string) => {
    if (!price){
      return;
    }
    setLevel(
      camelCase(price.id, true)
    )
    setPeriods(period)
  };
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
      </ModalContent>
    </Modal>
  )
}