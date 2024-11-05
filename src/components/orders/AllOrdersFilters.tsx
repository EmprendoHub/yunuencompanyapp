"use client";
import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import "./orderstyle.scss";

interface AllOrdersFiltersProps {
  branchData: string;
  onGenerateReport: (searchParams: any) => void;
}

const AllOrdersFilters: React.FC<AllOrdersFiltersProps> = ({
  branchData,
  onGenerateReport,
}) => {
  const REPORT_TYPE = ["Ventas", "Gastos"];
  const branches = JSON.parse(branchData);
  const allBranches: any = { _id: 0, name: "Todas" };
  branches.unshift(allBranches);
  const fullyPaid = ["Todos", "EFECTIVO", "TERMINAL", "TRANSFERENCIA"];
  const [store, setStore] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Todos");
  const [reportType, setReportType] = useState<string>("Ventas");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Set initial start date to the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);

    // Set initial end date to the end of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    setEndDate(endOfDay);
  }, []);

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setStartDate(startOfDay);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setEndDate(endOfDay);
    } else {
      setEndDate(null);
    }
  };

  const handleClick = () => {
    const searchParams: any = {};

    if (store != "0" && store !== "Todas") {
      searchParams.branch = store;
    }

    if (paymentMethod !== "" && paymentMethod !== "Todos") {
      searchParams.paid = paymentMethod;
    }

    if (reportType !== "") {
      searchParams.type = reportType;
    }

    if (startDate) {
      searchParams["createdAt[gte]"] = startDate.toISOString();
    }

    if (endDate) {
      searchParams["createdAt[lte]"] = endDate.toISOString();
    }

    onGenerateReport(searchParams);
  };

  useEffect(() => {
    if (reportType === "Gastos") {
      setPaymentMethod("Todos");
    }
  }, [reportType]);
  return (
    <div className="w-full print:hidden">
      <div className="mb-2 w-full text-start h-full px-4 py-2 inline-block text-2xl text-gray-800 shadow-sm border border-gray-200 rounded-md ">
        Generar Reporte
      </div>
      <div className="min-w-full flex gap-3 items-start justify-start h-full bg-primary  p-5">
        <div className="flex flex-col w-full items-start justify-start shadow-sm">
          <div className="w-full flex items-start gap-x-2 text-foreground">
            <div className="mb-4 flex flex-col gap-2 items-center">
              <DatePicker
                className="appearance-none rounded-md"
                onChange={handleStartDateChange}
                selected={startDate}
              />
              <DatePicker
                className="appearance-none rounded-md"
                onChange={handleEndDateChange}
                selected={endDate}
              />
            </div>
            {/* Type Filter */}
            <div className="p-5  w-full mb-2 sm:p-1 border border-gray-200 bg-background rounded shadow-sm">
              <h3 className="text-xs mb-2 text-gray-700">Tipo</h3>
              <div className="relative w-full">
                <select
                  className="relative appearance-none border border-gray-300 bg-accent rounded-md py-2 px-3 focus:outline-none cursor-pointer focus:border-gray-400 w-full text-xs"
                  name="reportType"
                  onChange={(e) => setReportType(e.target.value)}
                  value={reportType}
                >
                  {REPORT_TYPE.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          {/* Payment Method Filter */}
          {reportType === "Ventas" ? (
            <div className="p-5 pt-4 w-full mb-2 sm:p-1 border border-gray-200 bg-background rounded shadow-sm">
              <h3 className="text-xs mb-2 text-gray-700">Método de Pago</h3>
              <div className="relative w-full">
                <select
                  className="relative appearance-none border border-gray-300 bg-accent rounded-md py-2 px-3 focus:outline-none cursor-pointer focus:border-gray-400 w-full text-xs"
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
          ) : (
            ""
          )}

          {/* Store Filter */}
          <div className="p-5 pt-4 w-full sm:p-1 border border-gray-200 bg-background rounded shadow-sm">
            <h3 className="text-xs mb-2 text-gray-700">Tienda</h3>
            <div className="relative w-full">
              <select
                className="relative appearance-none border border-gray-300 bg-accent rounded-md py-2 px-3  focus:outline-none cursor-pointer focus:border-gray-400 w-full text-xs"
                name="store"
                onChange={(e) => setStore(e.target.value)}
                value={store}
              >
                {branches.map((opt: any) => (
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
    </div>
  );
};

export default AllOrdersFilters;
