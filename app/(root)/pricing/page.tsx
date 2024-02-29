'use client'

import {title} from "@/components/primitives";
import {Price} from "@/components/price";
import {priceAdvanced, priceFree, priceProfessional, priceStarted} from "@/config/prices";
import {Tab, Tabs} from "@nextui-org/react";
import {PiFireDuotone} from "react-icons/pi";

export default function PricingPage() {
    return (
        <div className="max-w-7xl space-y-10">
            <h1 className={title()}>定价</h1>

            <div>
                <Tabs aria-label="Options" variant={"bordered"}>
                    <Tab key="free" title="免费">
                        <Price price={priceFree}/>
                    </Tab>
                    <Tab key="started" title="入门">
                        <Price price={priceStarted}/>
                    </Tab>
                    <Tab key="advanced" title={<div className="flex space-x-0.5 items-center">
                        <span>进阶</span>
                        <PiFireDuotone style={{color: "red"}} size={17}/>
                    </div>}>
                        <Price price={priceAdvanced}/>
                    </Tab>
                    <Tab key="professional" title="专业">
                        <Price price={priceProfessional}/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
