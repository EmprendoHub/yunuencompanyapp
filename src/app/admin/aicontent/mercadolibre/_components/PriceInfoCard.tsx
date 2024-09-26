import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  iconSrc: string;
  value: string;
  borderColor: string;
}

const PriceInfoCard = ({ title, iconSrc, value, borderColor }: Props) => {
  return (
    <div
      className={`price-info-card border-${borderColor} border p-2 rounded-[10px]`}
    >
      <p className="text-sm">{title}</p>
      <div className="flex gap-1">
        <Image src={iconSrc} alt="icon" width={20} height={20} />
        <p className="text2xl font-bold text-secondary">{value}</p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
