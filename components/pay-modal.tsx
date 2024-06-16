'use client';

import { profile, profile as ProfileAtom, showPayModal } from "@/app/store";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import {Dropdown,DropdownTrigger,DropdownItem, DropdownMenu} from '@nextui-org/dropdown';
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react"
import { PriceInfo } from "./price";
import { getNumberId, idTable, maxId, priceAdvanced, priceFree, priceProfessional, prices, priceStarted } from "@/config/prices";
import { bg, title } from "./primitives";
import { Message } from "./message";
import IOC from "@/providers";
import { camelCase } from "@/hooks/useCamelCase";
import { FaAngleDown } from "react-icons/fa";
import { useDate } from "@/hooks/useDate";
import {QRCodeCanvas} from 'qrcode.react';

interface PriceListProps {
  onSelect?: (
    price: PriceInfo | null,
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
    onSelect?.(activePrice)
  }, [activePrice, period]);
  useEffect(()=>{
    const price = pricesList[Math.min(selectedId, maxId)]
    selectLevel(price);
    setActivePrice(price)
  }, []);
  return (
    <div className="w-full flex justify-evenly gap-4 whitespace-nowrap py-1 overflow-x-auto no-scrollbar" onWheel={onWheel}>
      {
        pricesList.map((price) => (
          <div key={price.id}
            aria-disabled={idTable[price.id] <= idTable[profile?.level.level.toUpperCase() ?? 'FREE']}
            aria-selected={selectedId === idTable[price.id]}
            onClick={()=>selectLevel(price)}
            className={
              `
              border p-4 rounded-md flex flex-col items-center gap-2 border-default bg-default-100 aria-disabled:border-default/50
              aria-[disabled=false]:cursor-pointer aria-selected:bg-primary aria-selected:border-primary-100
              group h-fit aria-selected:text-white
              `
            }
          >
            <h3 className={`group-aria-disabled:text-default-foreground/50`}>{price.plainName}</h3>
            <h2 className="text-lg group-aria-disabled:text-default-foreground/50">￥{price.price}元/月</h2>
          </div>
        ))
      }
    </div>
  )
}

type PayQrProps = {
  level: string;
  onClickPayDone?: () => void
}

const PayQr = (props:PayQrProps) => {
  const {level} = props;
  const [period, setPeriods] = useState<1|4|12>(1);
  const periodString = {
    [1]: '月',
    [4]: '季',
    [12]: '年'
  }
  const [qrUrl, setQRUrl] = useState('');
  const date = useDate();
  const money = useMemo(()=>{
    return prices.filter((p) => p.id.toLowerCase() === level.toLowerCase())[0].price * period;
  }, [period, level]);
  const moneyPerMonth = useMemo(()=>{
    return prices.filter((p) => p.id.toLowerCase() === level.toLowerCase())[0].price;
  }, [level]);
  const [profileData,setProfile] = useAtom(profile)
  const updateUserInfo = () => {
    IOC.user.getExtendedInformation()
    .then((res) => res.data)
    .then((res)=>{
      console.log(res);
      return res;
    })
    .then((data) => {
      if (data.level.level.toLowerCase() === profileData?.level.level.toLowerCase()){
        Message.error('支付失败')
      }
      setProfile(data)
      props.onClickPayDone?.();
    })
  }
  useEffect(()=>{
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
      <div className="w-fit grid grid-flow-col gap-2 items-center mx-auto pb-4 h-fit">
        <div className="flex flex-col h-full justify-evenly gap-4">
          <div className={`text-base ${title({color: 'blue'})}`}>
            <span className='text-4xl'>￥{moneyPerMonth}</span><span>/月</span>
          </div>
          <ButtonGroup>
            <Button color={period === 1 ? 'primary' : 'default'} onClick={()=>setPeriods(1)}>
              月付
            </Button>
            <Button color={period === 4 ? 'primary' : 'default'} onClick={()=>setPeriods(4)}>
              季付
            </Button>
            <Button color={period === 12 ? 'primary' : 'default'} onClick={()=>setPeriods(12)}>
              年付
            </Button>
          </ButtonGroup>
          <div>
            <span>合计￥{money}/{periodString[period]}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center p-4 rounded-md">
          <QRCodeCanvas value={qrUrl} size={128} className="rounded-md w-fit" />
          <span className="text-sm text-success">请示用微信扫码支付</span>
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
    setQRVisibility(
      getNumberId(profile?.level.level ?? 'Free') < getNumberId(level)
    )
  }, [level, profile?.level.level]);
  const onSelectLevel = (price: PriceInfo | null) => {
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
            qrVisibility ? <PayQr level={level} onClickPayDone={()=>setOpen(false)} /> : null
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}