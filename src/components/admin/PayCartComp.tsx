"use client";
import React, { useState } from "react";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { resetPOSCart, savePOSOrder } from "@/redux/shoppingSlice";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ValidationError } from "./EditVariationProduct";
import { SiMercadopago } from "react-icons/si";
import { DollarSign } from "lucide-react";
import ExitIcon from "../icons/ExitIcon";
import { payPOSDrawer } from "@/app/_actions";

const PayCartComp = ({
  setShowModal,
  payType,
  isPaid,
  userId,
}: {
  setShowModal: any;
  payType: any;
  isPaid: any;
  userId: string;
}) => {
  const getPathname = usePathname();
  let pathname: any;
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  }

  const dispatch = useDispatch();
  const router = useRouter();
  const [transactionNo, setTransactionNo] = useState("EFECTIVO");
  const [phone, setPhoneNo] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  const { productsPOS } = useSelector((state: any) => state.compras);
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);
  const amountTotal = productsPOS?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const totalAmountCalc = Number(amountTotal);
  let amountPlaceHolder: any;

  amountPlaceHolder = totalAmountCalc;
  const [amountReceived, setAmountReceived] = useState(amountPlaceHolder);

  const handleAmountReceived = async (inputValue: any) => {
    const sanitizedValue = inputValue.replace(/\D/g, "");
    const integerValue = parseInt(sanitizedValue);
    setAmountReceived(isNaN(integerValue) ? "" : integerValue);
  };

  const handleMercadoPago = async () => {
    let newTransactionNo = transactionNo;

    if (transactionNo === "EFECTIVO") {
      newTransactionNo = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();
      setTransactionNo(newTransactionNo); // Still update the state, but don't rely on it immediately
    }
    // Pass the updated transactionNo directly to handleCheckout
    handleCheckout(newTransactionNo);
  };

  const handleCheckout: any = async (newTransactionNo: string) => {
    setSavingPayment(true);

    if (!amountReceived || totalAmountCalc > amountReceived) {
      setSavingPayment(false);
      toast("La cantidad que recibe es menor al total");
      return;
    }
    let finalTransactionNo;
    if (newTransactionNo !== transactionNo) {
      finalTransactionNo = newTransactionNo;
    } else {
      finalTransactionNo = transactionNo;
    }
    console.log(finalTransactionNo, "transactionNo");

    const formData = new FormData();
    const items = JSON.stringify(productsPOS);
    formData.append("items", items);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("note", note);
    formData.append("email", email);
    formData.append("transactionNo", finalTransactionNo);
    formData.append("amountReceived", amountReceived.toString());
    formData.append("payType", payType);
    formData.append("pathname", userId);

    // const result: any = await fetch(`/api/payment`, {
    //   method: "POST",
    //   body: formData,
    // });

    const result: any = await payPOSDrawer(formData);
    const newOrderJson = JSON.parse(result.newOrder);

    if (result?.error) {
      console.log(result?.error);
      setValidationError(result.error);
    } else {
      const order = JSON.parse(result.newOrder);
      setValidationError(null);
      dispatch(resetPOSCart());
      router.push(`/${pathname}/recibo/${order._id}`);
    }
  };

  return (
    <div className="flex flex-col  w-full h-full items-center justify-center">
      {!savingPayment ? (
        <div className="w-1/2 maxmd:w-5/6 bg-background pl-4 rounded-lg relative">
          <section className=" p-6 w-full">
            <div className="flex flex-col items-center gap-1 ">
              {validationError?.title && (
                <p className="text-sm text-red-400">
                  {validationError.title._errors.join(", ")}
                </p>
              )}
              <div className="mb-4 text-center">
                <label className="block mb-1"> Referencia </label>
                <input
                  type="text"
                  className="appearance-none border bg-card rounded-md py-2 px-3 border-gray-300 focus:outline-none hover:outline-none focus:border-gray-400 hover:border-gray-400 w-full text-center font-bold "
                  placeholder="8971654687687"
                  onChange={(e) => setTransactionNo(e.target.value)}
                  name="transactionNo"
                  value={transactionNo}
                />
              </div>

              <div className="mb-4 text-center">
                <input
                  type="text"
                  disabled
                  placeholder="$0.00"
                  value={amountReceived}
                  onChange={(e) => handleAmountReceived(e.target.value)}
                  className="text-5xl text-center outline-none w-full appearance-none border bg-card rounded-md py-2  border-gray-300 focus:outline-none focus:border-gray-400:outline-none focus:border-gray-400 hover:border-gray-400"
                  name="amount"
                />
                {validationError?.amount && (
                  <p className="text-sm text-red-400">
                    {validationError.amount._errors.join(", ")}
                  </p>
                )}
              </div>
              <div
                onClick={() => setShowModal(false)}
                className="my-2 px-4 py-2 text-center text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 w-[20%] flex flex-row items-center justify-center gap-1 cursor-pointer absolute top-0 right-1"
              >
                <ExitIcon />
              </div>
              {!savingPayment && (
                <div className="flex flex-row  items-center gap-3 w-full">
                  {/* Add MercadoPago button */}
                  <button
                    onClick={handleMercadoPago}
                    className="my-2 w-[35%] px-4 py-10 text-center text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 flex flex-col items-center justify-center gap-1 text-l"
                  >
                    <SiMercadopago className="text-2xl" /> MercadoPago
                  </button>

                  <button
                    onClick={() => handleCheckout("EFECTIVO")}
                    className="my-2 w-[65%] px-4 py-10 text-center text-white bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-900 flex flex-col items-center justify-center gap-1 text-2xl"
                  >
                    <DollarSign className="text-xl" /> EFECTIVO
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="loader flex self-center" />
      )}
    </div>
  );
};

export default PayCartComp;
