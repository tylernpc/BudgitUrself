import type {ReactNode} from "react";
import {Navbar} from "@/components/Navbar";

export default function AppLayout({children,}: {
    children: ReactNode;
}) {
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
}
