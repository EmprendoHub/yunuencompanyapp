"use client";
import Link from "next/link";
import { FaPrint } from "react-icons/fa";
import { formatSpanishDate } from "@/backend/helpers";
import { getTotalFromItems } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import AdminOrderSearch from "@/components/layout/AdminOrderSearch";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { TbDeselect } from "react-icons/tb";
import ModalCancelExpense from "./ModalCancelExpense";

const POSExpenses = ({
  expenses,
  filteredExpensesCount,
}: {
  expenses: any;
  filteredExpensesCount: any;
}) => {
  const getPathname = usePathname();
  let pathname: any = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  } else if (getPathname.includes("socials")) {
    pathname = "socials";
  }
  const [showModal, setShowModal] = useState(false);
  const [usedExpenseId, setUsedExpenseId] = useState("");
  const [pendingTotal, setPendingTotal] = useState(0);

  const updateExpenseStatus = async (expense: any) => {
    const calcPending =
      getTotalFromItems(expense.expenseItems) -
      expense?.paymentInfo?.amountPaid;
    setPendingTotal(calcPending);
    setUsedExpenseId(expense._id);
    setShowModal(true);
  };
  return (
    <>
      <ModalCancelExpense
        showModal={showModal}
        setShowModal={setShowModal}
        expenseId={usedExpenseId}
        pathname={pathname}
        pendingTotal={pendingTotal}
        isPaid={false}
      />
      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          <h1 className="text-3xl w-full maxsm:text-xl my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond">
            {`${filteredExpensesCount} Ventas `}
          </h1>
          <AdminOrderSearch />
        </div>
        <table className="w-full text-sm maxsm:xs text-left">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3">
                No.
              </th>
              <th scope="col" className="px-2 py-3 maxmd:hidden">
                Cantidad
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Tipo
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 maxsm:hidden">
                Fecha
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense: any, index: number) => (
              <tr
                className={`bg-background ${
                  expense?.expenseStatus === "cancelada" && "text-muted"
                }`}
                key={index}
              >
                <td className="px-6 maxsm:px-2 py-2">
                  <Link key={index} href={`/${pathname}/pedido/${expense._id}`}>
                    {expense._id}
                  </Link>
                </td>
                <td className="px-2 py-2 maxmd:hidden">
                  <b>
                    <FormattedPrice amount={expense?.amount} />
                  </b>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">{expense?.type}</td>
                <td className="px-2 py-2 maxsm:hidden text-xs">
                  {expense?.expenseIntent}
                </td>
                <td className="px-2 py-2 maxsm:hidden text-xs">
                  {expense?.pay_date && formatSpanishDate(expense?.pay_date)}
                </td>
                <td className="px-1 py-2">
                  <div className="flex items-center ">
                    <Link
                      href={`/${pathname}/pedido/${expense._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaEye className="" />
                    </Link>
                    {expense?.expenseStatus !== "cancelada" ? (
                      <Link
                        href={`/${pathname}/recibo/${expense._id}`}
                        className="px-2 py-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                      >
                        <FaPrint className="" />
                      </Link>
                    ) : (
                      ""
                    )}

                    {expense?.expenseStatus !== "cancelada" ? (
                      <button
                        onClick={() => updateExpenseStatus(expense)}
                        className={`px-2 py-2 inline-block text-foreground hover:text-foreground bg-red-700
                       shadow-sm border border-gray-200 rounded-md hover:scale-110 cursor-pointer mr-2 duration-200 ease-in-out`}
                      >
                        <TbDeselect className="text-white" />
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default POSExpenses;
