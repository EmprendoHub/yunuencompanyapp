import { getSorteoParams } from "@/app/_actions";
import React from "react";
import WinnerPicker from "./_components/WinnerPicker";

const winnerPickerPage = async () => {
  const data = await getSorteoParams();
  const lotteryCount = data.ticketCount;
  const customers = data.customers;

  return <WinnerPicker lotteryCount={lotteryCount} customersData={customers} />;
};

export default winnerPickerPage;
