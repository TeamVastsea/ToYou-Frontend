'use client'

import React from "react";
import { Card, CardBody, CardFooter, Chip, Divider, Image, Link, Spacer } from "@nextui-org/react";
import { FaGithub } from "react-icons/fa6";
import { members } from "@/config/members";

export const PersonalCard = () => (
    <div>
        {members.map((member, index) => (
            <>
                <Card key={index} className="max-w-[400px]">
                    <CardBody>
                        <div className="flex space-x-5">
                            <Image
                                alt="Card background"
                                className="object-cover items-center"
                                style={{ width: 128, height: 128, minWidth: 32, minHeight: 32 }}
                                src={member.avatarSrc}
                            />
                            <div className="items-center">
                                <p className="text-white/60 font-bold text-left" style={{ fontSize: 23 }}>
                                    {member.name}
                                </p>
                                <a className="grid grid-cols-2 grid-flow-dense">
                                    {member.jobs.map((job, jobIndex) => (
                                        <Chip
                                            key={jobIndex}
                                            style={{ margin: 10 }}
                                            classNames={{
                                                base: `bg-gradient-to-br from-blue-500 to-blue-500 border-small border-white/50 shadow-blue-500/30`,
                                                content: "drop-shadow shadow-black text-white",
                                            }}
                                        >
                                            {job}
                                        </Chip>
                                    ))}
                                </a>
                            </div>
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <div className="flex space-x-2 items-center" style={{ marginLeft: "auto", marginRight: "auto" }}>
                            <FaGithub />
                            <Link isExternal showAnchorIcon href={member.githubLink}>
                                GitHub
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
                <Spacer y={4} />
            </>
        ))}
    </div>
);
