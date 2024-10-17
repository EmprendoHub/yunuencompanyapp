import {
  formatCorteDate,
  formatSimpleDate,
  formatSpanishDate,
} from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import ReactToPrint from "react-to-print";

const AllPayments = ({ data, itemCount }: { data: any; itemCount: number }) => {
  const payments = data.payments;
  const expenses = data.expenses;
  const paymentTotals = data.totalAmount;
  const ref = useRef<HTMLDivElement | null>(null);

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center justify-start">
          <h2 className="text-2xl">Corte de Caja</h2>
          <p>{formatCorteDate(today)}</p>
          <p className="px-2 text-xs maxsm:px-1 py-3 self-start">
            <b>{itemCount} </b>Transacciones
          </p>
        </div>
        <ReactToPrint
          bodyClass="print-report"
          pageStyle="@page { size: 2.5in 4in }"
          documentTitle={`Reporte de Ventas`}
          content={() => ref.current}
          trigger={() => (
            <div className="flex flex-row items-center justify-center gap-2 print-btn text-xs w-[200px] bg-black text-white p-4 rounded-sm cursor-pointer print:hidden">
              <FaPrint />
              <p>Imprimir Corte</p>
            </div>
          )}
        />
      </div>
      <div>
        <table className="w-full text-sm maxmd:text-xs text-left border-b-2 border-gray-300">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 maxsm:px-1 py-3">
                Método
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Cantidad
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Venta/Gasto
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment: any, index: number) => (
              <tr className="bg-background" key={index}>
                <td className="px-2 maxsm:px-2 py-2">{payment.method}</td>

                <td className="px-2 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={payment?.amount} />
                  </b>
                </td>
                <td className="px-2 maxsm:px-0 py-2 ">
                  <b>{payment?.orderDetails.orderId}</b>
                </td>

                <td className="px-2 maxsm:px-0 py-2 ">
                  {formatSpanishDate(payment?.pay_date)}
                </td>
              </tr>
            ))}
            {expenses?.map((expense: any, index: number) => (
              <tr className="bg-background" key={index}>
                <td className="px-2 maxsm:px-2 py-2">{expense.method}</td>

                <td className="px-2 maxsm:px-0 py-2 text-red-500">
                  <b>
                    -<FormattedPrice amount={expense?.amount} />
                  </b>
                </td>
                <td className="px-2 maxsm:px-0 py-2 ">
                  <b>{expense?._id.substring(0, 5)}...</b>
                </td>

                <td className="px-2 maxsm:px-0 py-2 ">
                  {formatSpanishDate(expense?.pay_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-full text-sm maxmd:text-xs text-left p-4 bg-background ">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 py-3 ">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-background">
              <td className="px-2 py-2 text-2xl font-semibold">
                <FormattedPrice amount={paymentTotals} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPayments;
