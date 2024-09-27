"use client";
import React, { useState } from "react";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import POSModal from "../modals/POSModal";
import { useSelector } from "react-redux";

const POSPaymentForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [payType, setPayType] = useState("");
  const { productsPOS }: any = useSelector((state: any) => state.compras);
  const amountTotal = productsPOS?.reduce(
    (acc: number, cartItem: { quantity: number; price: number }) =>
      acc + cartItem.quantity * cartItem.price,
    0
  );
  const layawayAmount = Number(amountTotal) * 0.3;
  const totalAmountCalc = Number(amountTotal);
  const handleCheckout = async (payType: React.SetStateAction<string>) => {
    setPayType(payType);
    setShowModal(true);
  };

  return (
    <div className="w-full p-2 bg-gray-100 pr-20">
      <POSModal
        showModal={showModal}
        setShowModal={setShowModal}
        payType={payType}
      />
      <div className=" bg-background flex flex-col p-2">
        <h2 className="text-5xl font-EB_Garamond mb-4">Totales</h2>

        <ul className="mb-5">
          <li className="flex justify-between text-gray-600  mb-2 text-2xl">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-2 text-xl">
            <span>Total de Artículos:</span>
            <span className="text-orange-600">
              {productsPOS?.reduce(
                (acc: any, cartItem: { quantity: any }) =>
                  acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>
          <li>
            <div className="border-b-[1px] border-b-slate-300 py-2">
              <div className="flex items-center justify-between">
                <p className=" font-medium  font-EB_Garamond">IVA</p>
                <p>
                  <FormattedPrice amount={0} />
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="border-b-[1px] border-b-slate-300 py-2">
              <div className="flex items-center justify-between">
                <p className=" font-medium  font-EB_Garamond">
                  Apártalo por solo
                </p>
                <p>
                  <FormattedPrice amount={layawayAmount} />
                </p>
              </div>
            </div>
          </li>
          <li className=" font-bold border-t flex justify-between mt-3 pt-3  text-4xl">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        <div className="flex flex-row flex-wrap items-center gap-3">
          {/* <button
            onClick={() => handleCheckout("layaway")}
            className="text-4xl text-slate-100 bg-violet-950 mt-4 py-5 px-6 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer w-full uppercase rounded-md"
          >
            Apartar
          </button> */}
          <button
            onClick={() => handleCheckout("total")}
            className="bg-black w-full text-slate-100 mt-4 py-5 uppercase text-4xl px-12 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer  rounded-md"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSPaymentForm;
