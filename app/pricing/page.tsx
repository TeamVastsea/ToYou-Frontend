'use client'

import {title} from "@/components/primitives";
import {Price} from "@/components/price";
import {priceFree, priceProfessional, priceUltimate} from "@/config/prices";
import {Tab, Tabs} from "@nextui-org/react";

export default function PricingPage() {
    return (
        <div className="max-w-7xl space-y-10">
            <h1 className={title()}>定价</h1>

            <div>
                <Tabs aria-label="Options" variant={"bordered"}>
                    <Tab key="free" title="免费">
                        <Price price={priceFree}/>
                    </Tab>
                    <Tab key="professional" title="专业">
                        <div className="flex items-center space-x-2">
                            <Price price={priceProfessional}/>
                        </div>
                    </Tab>
                    <Tab key="ultimate" title="终极">
                        <Price price={priceUltimate}/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
