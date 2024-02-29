import React from "react";

export default function BlogLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <section className="w-full flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="w-full inline-block max-w-lg text-center justify-center">
                {children}
            </div>
        </section>
    );
}
