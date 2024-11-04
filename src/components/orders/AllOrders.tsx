import { formatSpanishDate, getTotalFromItems } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import ReactToPrint from "react-to-print";

const AllOrders = ({ dataString }: { dataString: string }) => {
  const data = JSON.parse(dataString);
  const itemCount = data.orders.itemCount;
  const orders = data.orders.orders;
  const ordersTotals = data.orderTotals;
  const paymentTotals = data.paymentTotals;
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Reporte de Ventas</h2>
        <ReactToPrint
          bodyClass="print-report"
          pageStyle="@page { size: 8.3in 11.7in }"
          documentTitle={`Reporte de Ventas`}
          content={() => ref.current}
          trigger={() => (
            <div className="flex flex-row items-center justify-center gap-2 print-btn text-xs w-[200px] bg-black text-white p-4 rounded-sm cursor-pointer print:hidden">
              <FaPrint />
              <p>Imprimir Reporte</p>
            </div>
          )}
        />
      </div>
      <div>
        <table className="w-full text-sm maxmd:text-xs text-left border-b-2 border-gray-300">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 maxsm:px-1 py-3">
                No.
              </th>

              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Pago
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Tipo
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Total
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Sucursal
              </th>
              <th scope="col" className="px-2 py-3 maxsm:hidden">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any, index: number) => (
              <tr className="bg-background" key={index}>
                <td className="px-2 maxsm:px-2 py-2">{order.orderId}</td>

                <td
                  className={`px-2 maxsm:px-0 py-2 font-bold ${
                    order.orderStatus === "Apartado"
                      ? "text-amber-700"
                      : order.orderStatus === "En Camino"
                      ? "text-blue-700"
                      : order.orderStatus === "Entregado"
                      ? "text-green-700"
                      : order.orderStatus === "Pagado"
                      ? "text-green-800"
                      : "text-slate-600"
                  }`}
                >
                  {order.orderStatus}
                </td>
                <td
                  className={`px-2 maxsm:px-0 py-2 font-bold ${
                    order.affiliateId === "TERMINAL"
                      ? "text-blue-700"
                      : order.affiliateId === "TRANSFERENCIA"
                      ? "text-orange-800"
                      : order.affiliateId === "EFECTIVO"
                      ? "text-green-800"
                      : "text-slate-600"
                  }`}
                >
                  {order.affiliateId}
                </td>
                <td className="px-2 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice
                      amount={getTotalFromItems(order?.orderItems)}
                    />
                  </b>
                </td>
                <td
                  className={`px-2 maxsm:px-0 py-2 font-bold ${
                    order.branch === "Sucursal"
                      ? "text-amber-700"
                      : "text-slate-600"
                  }`}
                >
                  {order.branch.name}
                </td>
                <td className="px-2 py-2 maxsm:hidden">
                  {order?.createdAt && formatSpanishDate(order?.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-1/2 text-sm maxmd:text-xs text-left p-4 bg-background ">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-2 maxsm:px-1 py-3">
                Pedidos
              </th>
              <th scope="col" className="px-2 py-3 ">
                Pagado
              </th>
              <th scope="col" className="px-2 py-3 ">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-background">
              <td className="px-2 maxsm:px-2 py-2 text-xl">{itemCount}</td>
              <td className="px-2 py-2 text-2xl font-semibold">
                <FormattedPrice amount={paymentTotals} />
              </td>
              <td className="px-2 py-2 text-2xl font-semibold">
                <FormattedPrice amount={ordersTotals} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
