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

const POSCheckOutForm = () => {
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
  } else if (getPathname.includes("socials")) {
    pathname = "/socials";
  }
  const shipAmount = 0;
  const layawayAmount = Number(amountTotal) * 0.3;
  const handleCheckout = async (payType: React.SetStateAction<string>) => {
    setPayType(payType);
    setShowModal(true);
  };
  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  return (
    <section className="max-w-full p-2 maxsm:py-7 bg-gray-100">
      <POSModal
        showModal={showModal}
        setShowModal={setShowModal}
        payType={payType}
      />
      <div className=" mx-auto bg-background flex flex-col justify-between p-2">
        <h2>Totales</h2>
        <ul className="mb-5">
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Total de Artículos:</span>
            <span className="text-blue-500">
              {productsPOS?.reduce(
                (acc: any, cartItem: any) => acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Envió:</span>
            <span>
              <FormattedPrice amount={shipAmount} />
            </span>
          </li>
          <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        {isLoggedIn && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-5 w-full">
              <button
                onClick={() => handleCheckout("total")}
                className="bg-black w-full text-slate-100 mt-4 py-5 uppercase text-4xl px-12 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer  rounded-md"
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
