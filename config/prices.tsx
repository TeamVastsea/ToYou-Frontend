import {PriceInfo} from '@/components/price';
import {PiFireDuotone} from "react-icons/pi";

export const priceFree: PriceInfo = {
    name: "免费",
    singleFile: "5 MB",
    allSpace: "2 GB",
    storageTime: "30 天",
    price: 0,
}

export const priceProfessional: PriceInfo = {
    name: <div className="flex space-x-2 items-center">
        <span>专业</span>
        <PiFireDuotone style={{color: "red"}}/>
    </div>,
    singleFile: "200 MB",
    allSpace: "50 GB",
    storageTime: "120 天",
    price: 3000,
}

export const priceUltimate: PriceInfo = {
    name: "终极",
    singleFile: "无限",
    allSpace: "200 GB",
    storageTime: "无限",
    price: 9999,
}