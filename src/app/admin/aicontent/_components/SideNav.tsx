"use client";
import {
  FileClock,
  Home,
  Settings,
  WalletCards,
  LucideIcon,
  Calendar,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import UsageTrack from "./UsageTrack";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const DashSideNav: React.FC = () => {
  const MenuList: MenuItem[] = [
    {
      name: "Inicio",
      icon: Home,
      path: "/aicontent",
    },
    {
      name: "Historial",
      icon: FileClock,
      path: "/aicontent/historial",
    },
    {
      name: "Planes",
      icon: WalletCards,
      path: "/aicontent/planes",
    },
    {
      name: "Calendario",
      icon: Calendar,
      path: "/aicontent/calendario",
    },
    {
      name: "Amazon",
      icon: Search,
      path: "/aicontent/amazon",
    },
    {
      name: "MercadoLibre",
      icon: Search,
      path: "/aicontent/mercadolibre",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path, "path");
  }, []);

  return (
    <div className="h-screen relative shadow-sm border p-5 bg-background">
      <div className="flex justify-start mb-4">
        <Image alt="logo" src="/icons/logo.svg" width={100} height={100} />
      </div>
      <hr className="my-6 border" />
      <div className="mt-2">
        {MenuList.map((menu, index) => {
          const IconComponent = menu.icon;
          return (
            <Link
              href={menu.path}
              key={index}
              className={`flex items-center gap-2 mb-2 space-x-2 hover:bg-primary hover:text-white rounded-[10px] cursor-pointer p-2 duration-300 ease-in-out ${
                path === menu.path && "bg-primary text-white"
              }`}
            >
              <IconComponent size={20} />
              <h2 className="text-sm">{menu.name}</h2>
            </Link>
          );
        })}
      </div>
      <div className="absolute bottom-10 left-0 w-full">
        <UsageTrack />
      </div>
    </div>
  );
};

export default DashSideNav;
