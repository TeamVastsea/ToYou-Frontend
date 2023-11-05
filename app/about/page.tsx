'use client'

import {title} from "@/components/primitives";
import {Spacer} from "@nextui-org/react";
import {PersonalCard} from "@/components/personal-card";

export default function AboutPage() {
    return (
        <div>
            <h1 className={title()}>关于我们</h1>
            <Spacer y={8}/>
            <PersonalCard/>
        </div>
    );
}
