"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { usePathname } from "next/navigation";
import POSModal from "../modals/POSModal";

const POSCheckOutForm = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const { productsPOS } = useSelector((state: any) => state.compras);
  const amountTotal = productsPOS?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const getPathname = usePathname();
  let pathname;
  const [showModal, setShowModal] = useState(false);
  const [payType, setPayType] = useState("");

  if (getPathname.includes("admin")) {
    pathname = "/admin/pos";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "/puntodeventa";
  }
  const shipAmount = 0;
  const handleCheckout = async (payType: React.SetStateAction<string>) => {
    setPayType(payType);
    setShowModal(true);
  };
  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  return (
    <section className="max-w-full p-2 bg-gray-100">
      <POSModal
        showModal={showModal}
        setShowModal={setShowModal}
        payType={payType}
        userId={userId}
      />
      <div className=" mx-auto bg-background flex flex-col justify-between p-2">
        <h2 className="font-bold maxsm:hidden">Totales</h2>
        <ul className="mb-5 maxsm:mb-1">
          <li className="flex justify-between text-gray-600  mb-1 maxsm:hidden">
            <span className="text-sm maxsm:text-[12px]">Sub-Total:</span>
            <span className="text-sm maxsm:text-[12px]">
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="text-sm flex justify-between text-gray-600 mb-1 maxsm:mb-0">
            <span className="text-base maxsm:text-[12px]">
              Total de Artículos:
            </span>
            <span className="text-blue-500 text-base maxsm:text-[12px]">
              {productsPOS?.reduce(
                (acc: any, cartItem: any) => acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>
          <li className="text-lg font-bold border-t flex justify-between mt-3 maxsm:mt-1 ">
            <span className="text-base maxsm:text-[14px]">Total:</span>
            <span className="text-base maxsm:text-[14px]">
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        {isLoggedIn && productsPOS?.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-5 w-full">
              <button
                onClick={() => handleCheckout("EFECTIVO")}
                className="bg-emerald-700 w-full text-slate-100 py-6 maxsm:py-1.5 uppercase text-xl maxsm:text-xs px-12 hover:bg-black hover:text-white duration-300 ease-in-out cursor-pointer  rounded-md"
              >
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default POSCheckOutForm;
