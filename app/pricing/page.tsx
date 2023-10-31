import {title} from "@/components/primitives";
import {Price} from "@/components/price";
import {priceFree, priceProfessional, priceUltimate} from "@/config/prices";

export default function PricingPage() {
    return (
        <div className="max-w-7xl">
            <h1 className={title()}>定价</h1>
            <div className="flex gap-3" style={{position: "relative", top: 40}}>
                <Price price={priceFree}/>
                <Price price={priceProfessional}/>
                <Price price={priceUltimate}/>
            </div>
        </div>
    );
}
