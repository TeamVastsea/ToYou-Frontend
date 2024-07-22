'use client'
import React from "react";
import {AnimatePresence, motion} from 'framer-motion';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function AuthenticateLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        variants={variants}
                        transition={{ type: "linear" }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
