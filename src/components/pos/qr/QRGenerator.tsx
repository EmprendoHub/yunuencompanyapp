"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import qrcode from "qrcode";
import { useDispatch, useSelector } from "react-redux";
import { resetQRToPrint } from "@/redux/shoppingSlice";
import ReactToPrint from "react-to-print";
import { FaPrint } from "react-icons/fa6";
import FormattedPrice from "@/backend/helpers/FormattedPrice";

interface QRImage {
  id: string; // Adjust the type if `id` is not a string
  qr: string;
  title: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  amount: string;
}

const QRGenerator = ({ products }: { products: any }) => {
  const ref = useRef<any>(null);
  const [imageQR, setImageQR] = useState<QRImage[]>([]);
  const { qrListData } = useSelector((state: any) => state.compras);
  const dispatch = useDispatch();
  useEffect(() => {
    let qrArray;
    if (qrListData.length > 0) {
      qrArray = products.filter((product: any) =>
        qrListData.some((obj: any) => obj.id === product._id)
      );
    } else {
      qrArray = products;
    }

    qrArray.forEach(async (product: any) => {
      product.variations.forEach(async (variation: any) => {
        const id = variation._id;
        const formattedAmount = variation.price?.toLocaleString("en-US", {
          style: "currency",
          currency: "MXN",
          maximumFractionDigits: 2,
        });

        // Remove 'MX' from the formatted amount
        const price = formattedAmount?.replace("MX", "").trim();
        const text = id + "-" + product.title + "-" + price.toString();
        const image = await qrcode.toDataURL(text);
        if (variation.stock > 0) {
          for (let i = 0; i < variation.stock; i++) {
            setImageQR((prevImageQrs) => {
              const newQr = {
                id: id,
                qr: image,
                title: product.title,
                size: variation.size,
                color: variation.color,
                stock: variation.stock,
                price: variation.price,
                amount: `${i + 1}/${variation.stock}`,
              };
              return [...prevImageQrs, newQr];
            });
          }
        }
      });
    });
  }, []);

  return (
    <div
      ref={ref}
      className="container flex flex-col h-screen items-center justify-start mt-10 print:mt-0 print:mx-0 mx-auto"
    >
      <div className=" flex flex-row w-full items-center justify-between print:hidden">
        <h2 className=" text-slate-700 text-center w-full uppercase font-semibold tracking-wide text-2xl font-EB_Garamond">
          Generador de códigos QR
        </h2>
        <div onClick={() => dispatch(resetQRToPrint())}>
          <ReactToPrint
            bodyClass="print-qrs"
            pageStyle="@page { size: 2in 1in }"
            documentTitle={`QR codes`}
            content={() => ref.current}
            trigger={() => (
              <div className="flex flex-row items-center justify-center gap-2 print-btn text-sm w-[200px] bg-black text-white p-4 rounded-sm cursor-pointer">
                <FaPrint />
                <p>Imprimir QR&apos;s</p>
              </div>
            )}
          />
        </div>
      </div>

      <div className=" text-center mt-8 print:mt-0 w-full">
        <div className="card w-full">
          <hr className="border border-slate-300 my-3 print:hidden" />
          <div className="card-body w-full relative flex flex-wrap text-sm ">
            {imageQR.length > 0 &&
              imageQR.map((item: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    src={item.qr}
                    alt="qr code"
                    width={75}
                    height={75}
                    className="mx-auto text-center h-auto p-0"
                  />
                  <p className="text-xs ">
                    <FormattedPrice amount={item?.price} />
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
