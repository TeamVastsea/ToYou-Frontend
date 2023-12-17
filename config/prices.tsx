import {PriceInfo} from '@/components/price';
import {PiFireDuotone} from "react-icons/pi";

export const priceFree: PriceInfo = {
    name: "免费",
    plainName: "免费",
    singleFile: "50 MB",
    allSpace: "2 GB",
    price: 0,
    disabled: ["compressed", "original", "none"]
}

export const priceStarted: PriceInfo = {
    name: "入门",
    plainName: "入门",
    singleFile: "50 MB",
    allSpace: "10 GB",
    price: 30, // 0.9 320
    disabled: ["original", "none"]
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
    disabled: ["original", "none"]
}

export const priceProfessional: PriceInfo = {
    name: "专业",
    plainName: "专业",
    singleFile: "不限",
    allSpace: "200 GB",
    price: 150, // 0.7 1250
    disabled: ["none"]
}

export function getGroupPrice(name: string): PriceInfo {
    let lower = name.toLowerCase();
    switch (lower) {
        case "default":
        case "free": return priceFree; // 白色/灰色
        case "started": return priceStarted; // 蓝色
        case "advanced": return priceAdvanced; // 紫色
        case "professional": return priceProfessional;  // 金色
        default: return priceFree;
    }
}

export const getPriceColor = (
    price: 'free' | 'started' | 'advanced' | 'professional'
) => {
    switch (price.toLowerCase()){
        case 'free':
            return ''
        case 'started':
            return 'from-sky-500 to-indigo-500'
        case 'advanced':
            return 'from-[#213cc4] to-[#9c13cd]'
        case 'professional':
            return 'from-[#d6ac22] to-[#d87b24]'
        default:
            return 'default'
    }
}