"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AllOrdersFilters from "./AllOrdersFilters";
import { useEffect, useState } from "react";
import AllOrders from "./AllOrders";

const FilterOrdersComponent = ({
  data,
  itemCount,
  branches,
}: {
  data: any;
  itemCount: any;
  branches: any;
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
      <AllOrdersFilters branches={branches} />
      <AllOrders data={data} itemCount={itemCount} />
    </div>
  );
};

export default FilterOrdersComponent;
