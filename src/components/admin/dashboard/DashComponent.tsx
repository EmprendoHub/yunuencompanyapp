"use client";
import { MdAttachMoney } from "react-icons/md";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { GiClothes } from "react-icons/gi";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { FaTags } from "react-icons/fa6";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { ChartOptions } from "chart.js/auto";
import { CiMoneyBill } from "react-icons/ci";

interface WeeklyDataItem {
  date: string; // or Date if `date` is a Date object
  // add other properties if needed
}

const DashComponent = ({ data }: { data: any }) => {
  const weeklyPaymentData = JSON.parse(data?.weeklyPaymentData);
  const weeklyExpenseData = JSON.parse(data?.weeklyExpenseData);
  const weekByWeekPaymentData = JSON.parse(data?.weekByWeekPaymentData);
  const weekByWeekExpenseData = JSON.parse(data?.weekByWeekExpenseData);
  const monthlyOrderBranchTotals = JSON.parse(data?.monthlyOrderBranchTotals);
  const weeklyOrderBranchTotals = JSON.parse(data?.weeklyOrderBranchTotals);

  const sortedPaymentData = weeklyPaymentData
    .map((item: WeeklyDataItem, index: number) => ({ index, item }))
    .sort(
      (a: any, b: any) =>
        new Date(a.item.date).getTime() - new Date(b.item.date).getTime()
    )
    .map(({ index }: { index: number }) => weeklyPaymentData[index]);

  // Ensure `weeklyPaymentData` is sorted correctly
  weeklyPaymentData.sort(
    (a: WeeklyDataItem, b: WeeklyDataItem) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare the labels and data for the Payment chart
  const paymentChartLabels = sortedPaymentData.map((data: any) => data.date);
  const paymentChartData = sortedPaymentData.map((data: any) => data.Total);

  const sortedExpenseData = weeklyExpenseData
    .map((item: WeeklyDataItem, index: number) => ({ index, item }))
    .sort(
      (a: any, b: any) =>
        new Date(a.item.date).getTime() - new Date(b.item.date).getTime()
    )
    .map(({ index }: { index: number }) => weeklyExpenseData[index]);

  // Ensure `weeklyPaymentData` is sorted correctly
  weeklyExpenseData.sort(
    (a: WeeklyDataItem, b: WeeklyDataItem) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare the labels and data for the chart
  const expenseChartLabels = sortedExpenseData.map((data: any) => data.date);
  const expenseChartData = sortedExpenseData.map((data: any) => data.Total);
  const totalProductsSoldThisMonth = data?.totalProductsSoldThisMonth;
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const productsCountPreviousMonth = data?.productsCountPreviousMonth;
  const totalPaymentsThisWeek = data?.totalPaymentsThisWeek;
  const totalExpensesThisWeek = data?.totalExpensesThisWeek;

  const dailyExpensesTotals = data?.dailyExpensesTotals;
  const dailyPaymentsTotals = data?.dailyPaymentsTotals;
  const yesterdaysPaymentsTotals = data?.yesterdaysPaymentsTotals;
  const monthlyExpensesTotals = data?.monthlyExpensesTotals;

  const monthlyPaymentsTotals = data?.monthlyPaymentsTotals;
  const monthlyOrderTotals = data?.monthlyOrderTotals;

  const yearlyPaymentsTotals = data?.yearlyPaymentsTotals;
  const yearlyExpensesTotals = data?.yearlyExpensesTotals;
  const lastWeeksPaymentsTotals = data?.lastWeeksPaymentsTotals;
  const lastMonthsPaymentsTotals = data?.lastMonthsPaymentsTotals;
  const lastYearsPaymentsTotals = data?.lastYearsPaymentsTotals;
  // Assuming `weeklyPaymentData` is your fetched dataset

  const weeklyPaymentDataWithColors = {
    labels: paymentChartLabels,
    datasets: [
      {
        label: "Ventas",
        data: paymentChartData,
        backgroundColor: [
          "rgba(131, 181, 139, 0.5)", // Example colors for 7 data points
        ],
        borderColor: [
          "rgba(131, 181, 139, 1)", // Example border colors for 7 data points
        ],
        borderWidth: 1,
      },
      {
        label: "Gastos",
        data: expenseChartData,
        backgroundColor: ["rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const weeklyByWeekPaymentDataWithColors = {
    labels: weekByWeekPaymentData.map(
      (order: { week: string }) => "Semana " + order.week
    ),
    datasets: [
      {
        label: "Ventas",
        data: weekByWeekPaymentData.map(
          (order: { total: number }) => order.total
        ),
        backgroundColor: [
          "rgba(131, 181, 139, 0.5)", // Example colors for 7 data points
        ],
        borderColor: [
          "rgba(131, 181, 139, 1)", // Example border colors for 7 data points
        ],
        borderWidth: 1,
      },
      {
        label: "Gastos",
        data: weekByWeekExpenseData.map(
          (order: { total: number }) => order.total
        ),

        backgroundColor: ["rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const monthlyStoreSalesData = {
    labels: monthlyOrderBranchTotals.map(
      (order: { branchName: string }) => order.branchName
    ),
    datasets: [
      {
        label: "Ventas Tiendas",
        data: monthlyOrderBranchTotals.map(
          (order: { totalAmountPaid: number }) => order.totalAmountPaid
        ),
        backgroundColor: [
          "rgba(134, 65, 134, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(121, 171, 101, 0.5)",
        ],
        borderColor: [
          "rgba(134, 65, 134)",
          "rgb(54, 162, 235)",
          "rgb(121, 171, 101)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const weeklyStoreSalesData = {
    labels: weeklyOrderBranchTotals.map(
      (order: { branchName: string }) => order.branchName
    ),
    datasets: [
      {
        label: "Ventas Tiendas",
        data: weeklyOrderBranchTotals.map(
          (order: { totalAmountPaid: number }) => order.totalAmountPaid
        ),
        backgroundColor: ["rgb(54, 102, 235, 0.5)", "rgb(54, 162, 235, 0.5)"],
        borderColor: ["rgb(54, 102, 235)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Correct the type to match expected values
      },
      title: {
        display: true,
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Correct the type to match expected values
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <div className="p-1 md:mx-auto  text-card-foreground">
      {/* Ventas y Gastos*/}
      <div className="flex-row maxsm:flex-col flex gap-4 justify-start w-full">
        <div className="maxmd:w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start w-3/4">
          {/* Ventas */}

          <div className="flex flex-col bg-card shadow-lg w-full rounded-md p-2">
            <div className="flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between border-b-2 border-slate-400 pb-2">
                <h3 className="text-card-foreground text-xl uppercase flex items-center gap-2">
                  <MdAttachMoney className="bg-black text-white rounded-full text-3xl p-1 shadow-lg" />
                  Ventas
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-card-foreground text-xs text-teal-600">
                    Neto
                  </div>
                  <MdAttachMoney className="bg-teal-600 text-white rounded-full text-3xl p-1 shadow-lg" />
                </div>
              </div>
              {/* sales totals */}
              {/* daily */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">del Dia: </p>{" "}
                  <FormattedPrice amount={dailyPaymentsTotals || 0} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 flex items-center">
                    <CiMoneyBill />
                    <FormattedPrice amount={yesterdaysPaymentsTotals || 0} />
                  </span>
                  <span className="text-green-700 flex items-center">
                    %
                    {(
                      (yesterdaysPaymentsTotals / dailyPaymentsTotals) * 100 ||
                      0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* weekly */}
              <div className="flex justify-between items-center gap-2  text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">Semanal: </p>{" "}
                  <FormattedPrice amount={totalPaymentsThisWeek || 0} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 flex items-center">
                    <CiMoneyBill />
                    <FormattedPrice amount={lastWeeksPaymentsTotals || 0} />
                  </span>
                  <span className="text-green-700 flex items-center">
                    %
                    {(
                      (lastWeeksPaymentsTotals / totalPaymentsThisWeek) * 100 ||
                      0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* monthly */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">Mensual: </p>{" "}
                  <FormattedPrice amount={monthlyOrderTotals || 0} />
                </div>
                <span className="text-emerald-700 flex items-center">
                  <CiMoneyBill />
                  <FormattedPrice amount={lastMonthsPaymentsTotals || 0} />
                </span>
                <span className="text-green-700 flex items-center">
                  %
                  {(
                    (lastMonthsPaymentsTotals / monthlyOrderTotals) * 100 || 0
                  ).toFixed(2)}
                </span>
              </div>
              {/* yearly */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">del Año: </p>{" "}
                  <FormattedPrice amount={yearlyPaymentsTotals || 0} />
                </div>
                <span className="text-emerald-700 flex items-center">
                  <CiMoneyBill />
                  <FormattedPrice amount={lastYearsPaymentsTotals || 0} />
                </span>
                <span className="text-green-700 flex items-center">
                  %
                  {(
                    (lastYearsPaymentsTotals / yearlyPaymentsTotals) * 100 || 0
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* Gastos */}
          <div className="flex flex-col bg-card shadow-lg w-full rounded-md p-2">
            <div className="flex flex-col justify-between  gap-2">
              <div className="flex items-center justify-between border-b-2 border-slate-400 pb-2 ">
                <h3 className="text-red-400 text-xl uppercase flex items-center gap-2 ">
                  <MdAttachMoney className="bg-red-400 text-white rounded-full text-3xl p-1 shadow-lg" />
                  Gastos
                </h3>
                <div className="flex items-center gap-2">
                  <MdAttachMoney className="bg-red-400 text-white rounded-full text-3xl p-1 shadow-lg" />
                </div>
              </div>
              {/* expense totals */}
              {/* daily */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">del Dia: </p>{" "}
                  <FormattedPrice amount={dailyExpensesTotals || 0} />
                </div>
              </div>
              {/* weekly */}
              <div className="flex justify-between items-center gap-2  text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">Semanal: </p>{" "}
                  <FormattedPrice amount={totalExpensesThisWeek || 0} />
                </div>
              </div>
              {/* monthly */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">Mensual: </p>{" "}
                  <FormattedPrice amount={monthlyExpensesTotals || 0} />
                </div>
              </div>
              {/* yearly */}
              <div className="flex justify-between items-center gap-2 text-sm">
                <div className="text-xl  text-card-foreground flex items-center">
                  <p className="text-xs">del Año: </p>{" "}
                  <FormattedPrice amount={yearlyExpensesTotals || 0} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* totales productos y ventas */}
        <div className="flex-col flex gap-4 justify-start w-1/4 maxmd:w-full">
          <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
            <div className="flex flex-col p-1 dark:bg-card gap-4 w-full rounded-md shadow-lg bg-card">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-card-foreground text-sm uppercase">
                    Ventas Totales
                  </h3>
                  <p className="text-2xl text-foreground">{totalOrderCount}</p>
                </div>
                <FaTags className="bg-teal-600  text-white rounded-full text-3xl p-1 shadow-lg" />
              </div>
              <div className="flex  gap-2 text-sm">
                <span className={`flex items-center`}>
                  {totalOrderCount > orderCountPreviousMonth ? (
                    <HiArrowNarrowUp className="text-emerald-700" />
                  ) : (
                    <HiArrowNarrowDown className="text-red-700" />
                  )}

                  {orderCountPreviousMonth}
                </span>

                <div className="text-card-foreground">Mes Anterior</div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
            <div className="flex flex-col p-1 dark:bg-card gap-4 w-full rounded-md shadow-lg bg-card">
              <div className="flex justify-between">
                <div className="">
                  <h3 className="text-card-foreground text-sm uppercase">
                    Total de Productos
                  </h3>
                  <p className="text-2xl  text-foreground">
                    {totalProductsSoldThisMonth}
                  </p>
                </div>
                <GiClothes className="bg-indigo-600  text-white rounded-full text-3xl p-1 shadow-lg" />
              </div>
              <div className="flex  gap-2 text-sm">
                <span className="text-green-700 flex items-center">
                  <HiArrowNarrowUp />
                  {productsCountPreviousMonth}
                </span>
                <div className="text-card-foreground">Mes Anterior</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Charts */}
      <div className="w-full min-h-[300px] bg-card p-5  mt-4 flex flex-col">
        {/* Chart to display daily totals for the last 7 days */}
        <h2>Ventas y Gastos Semanales</h2>

        <div className="chart-container h-[300px] maxsm:h-[200px] flex items-center justify-between">
          <Bar
            data={weeklyPaymentDataWithColors}
            options={options}
            className="w-full"
          />
          <Pie
            data={weeklyStoreSalesData}
            options={pieOptions}
            className="max-w-[400px] max-h-[400px]"
          />
        </div>
      </div>
      {/* Monthly Charts */}
      <div className="w-full min-h-[300px] bg-card p-5  mt-4 relative">
        {/* Chart to display daily totals for the last 7 days */}
        <h2>Ventas y Gastos Mensuales</h2>

        <div className="chart-container h-[300px] maxsm:h-[200px] flex items-center justify-between">
          <Pie
            data={monthlyStoreSalesData}
            options={pieOptions}
            className="max-w-[400px] max-h-[400px]"
          />
          <Bar
            data={weeklyByWeekPaymentDataWithColors}
            options={options}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DashComponent;
