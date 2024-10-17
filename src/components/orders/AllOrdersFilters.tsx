"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendar } from "react-icons/fa6";
import { DatePicker } from "@/components/ui/DatePicker";
import "./orderstyle.scss";

interface Branch {
  _id: string;
  name: string;
}

interface AllOrdersFiltersProps {
  branches: Branch[];
}

const AllOrdersFilters: React.FC<AllOrdersFiltersProps> = ({ branches }) => {
  const fullyPaid = ["Todos", "EFECTIVO", "TERMINAL"];
  const [store, setStore] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  let queryParams: URLSearchParams;

  function handleClick() {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
    }
    if (store === "" || store === "Todas") {
      queryParams.delete("branch");
    } else {
      queryParams.set("branch", store);
    }

    if (paymentMethod === "" || paymentMethod === "Todos") {
      queryParams.delete("paid");
    } else {
      queryParams.set("paid", paymentMethod);
    }

    if (startDate) {
      queryParams.set("min", startDate.toISOString());
    } else {
      queryParams.delete("min");
    }

    if (endDate) {
      queryParams.set("max", endDate.toISOString());
    } else {
      queryParams.delete("max");
    }

    const path = window.location.pathname + "?" + queryParams.toString();
    router.push(path);
  }

  return (
    <div className="w-full print:hidden">
      <div className="mb-2 w-full text-start h-full px-4 py-2 inline-block text-2xl text-gray-800 shadow-sm border border-gray-200 rounded-md font-EB_Garamond">
        Generar Reporte
      </div>
      <div className="min-w-full flex items-center justify-start h-full">
        <div className="flex flex-col w-2/3 py-4 border border-gray-200 bg-background rounded shadow-sm">
          <h3 className="mb-2 text-foreground flex items-center">
            Fechas <FaCalendar />
          </h3>
          <div className="flex items-center gap-x-2 text-foreground">
            <div className="mb-4 flex flex-row gap-2 items-center">
              <DatePicker
                className="appearance-none rounded-md"
                onChange={setStartDate}
                selected={startDate}
              />
              <DatePicker
                className="appearance-none rounded-md"
                onChange={setEndDate}
                selected={endDate}
              />
            </div>
          </div>
        </div>
        {/* Payment Method Filter */}
        <div className="p-5 pt-4 w-1/3 mb-2 sm:p-1 border border-gray-200 bg-background rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Estado</h3>
          <div className="relative w-full">
            <select
              className="relative appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none cursor-pointer focus:border-gray-400 w-full"
              name="paymentMethod"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              {fullyPaid.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Store Filter */}
        <div className="p-5 pt-4 w-1/3 sm:p-1 border border-gray-200 bg-background rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Tienda</h3>
          <div className="relative w-full">
            <select
              className="relative appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 mb-2 focus:outline-none cursor-pointer focus:border-gray-400 w-full"
              name="store"
              onChange={(e) => setStore(e.target.value)}
              value={store}
            >
              {branches.map((opt) => (
                <option key={opt._id} value={opt._id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isSending ? (
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <button
              type="button"
              className="px-4 py-2 mt-5 inline-block text-white border border-transparent rounded-md bg-black w-full"
              onClick={handleClick}
            >
              Generar
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center w-full gap-2">
            <div className="loader flex self-center" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersFilters;
