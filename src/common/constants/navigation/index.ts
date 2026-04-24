import { Send } from "lucide-react";
import { MdCollections } from "react-icons/md";
import { IoHome } from "react-icons/io5";

export const NAV_ITEMS = [
    {   name: "Home",
        link: "/" ,
        icon: IoHome,
        mobile_background_color_active: "bg-cyan-500",
        mobile_border_color_active: "border-cyan-500",
        mobile_hover_background_color: "hover:bg-cyan-500",
        mobile_hover_border_color: "hover:border-cyan-500"
    },
    {   name: "Portfolio",
        link: "/about" ,
        icon: MdCollections,
        mobile_background_color_active: "bg-lime-500",
        mobile_border_color_active: "border-lime-500",
        mobile_hover_background_color: "hover:bg-lime-500",
        mobile_hover_border_color: "hover:border-lime-500"
    },
    {   name: "Contact",
        link: "/contact" ,
        icon: Send,
        mobile_background_color_active: "bg-amber-500",
        mobile_border_color_active: "border-amber-500",
        mobile_hover_background_color: "hover:bg-amber-500",
        mobile_hover_border_color: "hover:border-amber-500"
    },
];