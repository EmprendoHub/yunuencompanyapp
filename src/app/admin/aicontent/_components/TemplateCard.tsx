import React from "react";
import { TEMPLATE } from "./TemplateListSection";
import Image from "next/image";
import Link from "next/link";

const TemplateCard = (item: TEMPLATE) => {
  return (
    <Link href={`/admin/aicontent/content/${item?.slug}`}>
      <div className="p-5 shadow-md rounded-[10px] border bg-card flex flex-col gap-3 cursor-pointer hover:scale-105 transition-all">
        <Image alt={"icon"} src={item.icon} width={50} height={50} />
        <h2 className=" font-medium text-sm">{item.name}</h2>
        <p className="text-xs text-gray-500 line-clamp-3">{item.desc}</p>
      </div>
    </Link>
  );
};

export default TemplateCard;
