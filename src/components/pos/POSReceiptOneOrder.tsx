"use client";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { Key, useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa6";
import ReactToPrint from "react-to-print";
import "./PosStyles.css";
import { formatSpanishDate } from "@/backend/helpers";
import { Button } from "../ui/button";

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
  const printTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
      if (printTriggerRef.current) {
        printTriggerRef.current.click(); // Automatically trigger print
      }
    }, 1000);
  }, []);

  function getQuantities(orderItems: OrderItem[]): number {
    return orderItems?.reduce(
      (sum, obj) =>
        sum +
        (typeof obj.quantity === "number"
          ? obj.quantity
          : parseFloat(obj.quantity)),
      0
    );
  }

  function getTotal(orderItems: OrderItem[]): number {
    return orderItems?.reduce(
      (acc, cartItem: any) => acc + cartItem.quantity * cartItem.price,
      0
    );
  }

  function subtotal(): number {
    return order?.paymentInfo?.amountPaid - order?.ship_cost;
  }

  return (
    <div
      ref={ref}
      className="main-receipt w-[300px] maxmd:w-full min-h-full mx-auto relative bg-white px-2"
    >
      <div className="flex flex-col justify-between items-center">
        <h1 className="main-receipt-header flex font-black font-EB_Garamond text-[1.5rem] maxmd:text-[1rem] leading-none">
          Yunuen Company
        </h1>
        <h2 className="text-md font-bold text-foreground items-center">
          {order?.orderId}
        </h2>
      </div>

      <div className="border-b-2 border-slate-300">
        <table className="w-full text-left">
          <thead className="text-[12px] text-foreground uppercase">
            <tr className="flex flex-row items-center justify-between">
              <th>#</th>
              <th>Producto</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {order?.orderItems?.map((item: OrderItem, index: Key) => (
              <tr
                key={index}
                className="main-receipt-item flex flex-row items-center justify-between"
              >
                <td>{item.quantity}</td>
                <td>{item.name.substring(0, 10)}</td>
                <td>
                  <FormattedPrice amount={item.price || 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col p-2">
        <ul>
          <li className="flex justify-between">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
            </span>
          </li>
          <li className="flex justify-between">
            <span>Total de Artículos:</span>
            <span>{getQuantities(order?.orderItems)} (Artículos)</span>
          </li>
          <li className="flex justify-between">
            <span>IVA:</span>
            <span>
              <FormattedPrice amount={order?.ship_cost || 0} />
            </span>
          </li>
          <li className="main-receipt-totals flex justify-between pt-1">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={getTotal(order?.orderItems) || 0} />
            </span>
          </li>
          <li className="main-receipt-totals flex justify-between pt-1">
            <span>Pago:</span>
            <span>
              -<FormattedPrice amount={subtotal() || 0} />
            </span>
          </li>
        </ul>
        <div className="text-center border-t-2">
          <p>{formatSpanishDate(order?.createdAt)}</p>
          <p>Gracias por tu compra</p>
          <p>Para descuentos y especiales síguenos en redes @yunuencompany</p>
        </div>
      </div>

      <ReactToPrint
        content={() => ref.current as HTMLDivElement}
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
