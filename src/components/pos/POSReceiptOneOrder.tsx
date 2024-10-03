"use client";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { Key, useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa6";
import ReactToPrint from "react-to-print";
import "./PosStyles.css";
import { formatSpanishDate } from "@/backend/helpers";
import { Button } from "../ui/button";

// Define types for order and deliveryAddress if not already defined
interface OrderItem {
  quantity: string | number;
  name: string;
  price: number;
}

interface Order {
  orderId: string;
  orderItems: OrderItem[];
  paymentInfo: {
    amountPaid: number;
  };
  ship_cost: number;
  createdAt: string;
}

interface POSReceiptOneOrderProps {
  order: Order;
  id: string;
  deliveryAddress: any;
}

const POSReceiptOneOrder = ({
  order,
  id,
  deliveryAddress,
}: POSReceiptOneOrderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const printTriggerRef = useRef<HTMLButtonElement>(null); // Referencing the print trigger button

  useEffect(() => {
    setTimeout(() => {
      // Assume component is ready to print
      setLoaded(true);
      if (printTriggerRef.current) {
        printTriggerRef.current.click(); // Automatically trigger print
      }
    }, 1000); // Adjust the delay as needed or immediately trigger if data is already present
  }, []);

  function getQuantities(orderItems: OrderItem[]): number {
    // Use reduce to sum up the 'quantity' fields
    const totalQuantity = orderItems?.reduce(
      (sum, obj) =>
        sum +
        (typeof obj.quantity === "number"
          ? obj.quantity
          : parseFloat(obj.quantity)),
      0
    );
    return totalQuantity;
  }

  function getTotal(orderItems: OrderItem[]): number {
    // Use reduce to sum up the 'total' field
    const totalAmount = orderItems?.reduce(
      (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
      0
    );
    return totalAmount;
  }

  function subtotal(): number {
    let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
    return sub;
  }

  return (
    <div
      ref={ref}
      className="main-receipt w-[300px] maxmd:w-full min-h-full mx-auto relative bg-background px-2"
    >
      <div className="flex flex-col justify-between items-center">
        <div className="relative flex flex-col items-center justify-center max-w-fit">
          <h1 className="main-receipt-header flex font-black font-EB_Garamond text-[1.5rem] maxmd:text-[1rem] leading-none">
            Yunuen Company
          </h1>
        </div>

        <div className="flex flex-col items-end justify-end gap-x-1 overflow-hidden">
          <h2 className="text-md font-bold text-foreground items-center">
            {order?.orderId}
          </h2>
        </div>
      </div>

      <div className="relative overflow-x-hidden border-b-2 border-slate-300">
        <table className="w-full text-left">
          <thead className="text-[12px] text-foreground uppercase">
            <tr className="flex flex-row items-center justify-between">
              <th scope="col" className="px-2 maxsm:px-0 py-0.5">
                #
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-0.5">
                Producto
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-0.5">
                Precio
              </th>
            </tr>
          </thead>
          <tbody className="text-xs overscroll-x-none overflow-hidden">
            {order?.orderItems?.map(
              (item: OrderItem, index: Key | null | undefined) => (
                <tr
                  key={index}
                  className="main-receipt-item flex flex-row items-center justify-between"
                >
                  <td className="px-2 maxsm:px-0 pb-0.5">{item.quantity}</td>
                  <td className="px-2 maxsm:px-0 pb-0.5 text-clip">
                    {item.name.substring(0, 10)}
                  </td>
                  <td className="px-2 maxsm:px-0 pb-0.5">
                    <FormattedPrice amount={item.price || 0} />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="relative flex flex-row maxmd:flex-col items-center justify-start overflow-x-hidden gap-2 ">
        <div className="w-full">
          <div className="container mx-auto flex flex-col p-2">
            <ul className="mb-2 ">
              <li className=" flex justify-between gap-x-5 text-gray-950">
                <span className="main-receipt-desglose text-xs">
                  Sub-Total:
                </span>
                <span className="main-receipt-desglose text-xs">
                  <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
                </span>
              </li>
              <li className=" flex justify-between gap-x-5 text-gray-950">
                <span className="main-receipt-desglose text-xs">
                  Total de Artículos:
                </span>
                <span className="main-receipt-desglose text-foreground text-xs">
                  {getQuantities(order?.orderItems)} (Artículos)
                </span>
              </li>
              <li className=" flex justify-between gap-x-5 text-gray-950">
                <span className="text-xs main-receipt-desglose">IVA:</span>
                <span className="text-xs main-receipt-desglose">
                  <FormattedPrice amount={order?.ship_cost || 0} />
                </span>
              </li>
              <li className="main-receipt-totals text-base font-semibold border-t-1 border-slate-300 flex justify-between gap-x-1 pt-1">
                <span>Total:</span>
                <span>
                  <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
                </span>
              </li>
              <li className="main-receipt-totals text-base font-bold border-t-1 border-slate-300 flex justify-between gap-x-1 pt-1">
                <span>Pago:</span>
                <span>
                  <span>
                    -<FormattedPrice amount={subtotal() || 0} />
                  </span>
                </span>
              </li>
              {/* <li className="text-lg font-bold border-t-1 border-slate-300 flex justify-between gap-x-1 pt-1">
                <span>Pendiente:</span>
                <span>
                  <FormattedPrice
                    amount={
                      getTotal(order?.orderItems) -
                        order?.paymentInfo?.amountPaid || 0
                    }
                  />
                </span>
              </li> */}
            </ul>
            <div className="text-[10px] text-foreground tracking-wide text-center border-t-2 border-slate-300 ">
              <p className="text-[10px] my-0.5 w-full text-center">
                {formatSpanishDate(order?.createdAt)}
              </p>
              <p>Gracias por tu compra</p>
              <p>
                Para descuentos y especiales síguenos en redes @yunuencompany
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReactToPrint
        bodyClass="print-agreement"
        pageStyle="@page { size: 2.5in auto }"
        documentTitle={`#${order?.orderId}`}
        content={() => ref.current as HTMLDivElement} // Ensure ref.current is properly cast
        trigger={() => (
          <Button ref={printTriggerRef} style={{ display: "none" }}>
            Print
          </Button>
        )}
      />
      <Button
        className="print-btn bg-black text-white w-full py-2"
        onClick={() => {
          if (printTriggerRef.current) {
            printTriggerRef.current.click();
          }
        }}
      >
        <FaPrint />
        Imprimir Recibo
      </Button>
    </div>
  );
};

export default POSReceiptOneOrder;
