"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AllPayments from "./AllPayments";

const FilterPaymentComponent = ({
  data,
  itemCount,
}: {
  data: any;
  itemCount: number;
}) => {
  const [isActive, SetIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isActive) SetIsActive(false);
  }, [pathname]);

  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className={` overflow-y-auto px-5 py-5`}>
      <AllPayments data={data} itemCount={itemCount} />
    </div>
  );
};

export default FilterPaymentComponent;
