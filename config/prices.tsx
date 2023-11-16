import {PriceInfo} from '@/components/price';
import {PiFireDuotone} from "react-icons/pi";

export const priceFree: PriceInfo = {
    name: "免费",
    plainName: "免费",
    singleFile: "50 MB",
    allSpace: "2 GB",
    price: 0,
}

export const priceStarted: PriceInfo = {
    name: "入门",
    plainName: "入门",
    singleFile: "50 MB",
    allSpace: "10 GB",
    price: 30, // 0.9 320
}

export const priceAdvanced: PriceInfo = {
    name: <div className="flex space-x-2 items-center">
        <span>进阶</span>
        <PiFireDuotone style={{color: "red"}}/>
    </div>,
    plainName: "进阶",
    singleFile: "100 MB",
    allSpace: "50 GB",
    price: 50, // 0.8 480
}

export const priceProfessional: PriceInfo = {
    name: "专业",
    plainName: "专业",
    singleFile: "不限",
    allSpace: "200 GB",
    price: 150, // 0.7 1250
}

export function getGroupPrice(name: string): PriceInfo {
    let lower = name.toLowerCase();
    switch (lower) {
        case "default":
        case "free": return priceFree;
        case "started": return priceStarted;
        case "advanced": return priceAdvanced;
        case "professional": return priceProfessional;
        default: return priceFree;
    }
}
