import { getVideoMessages } from "@/app/_actions";
import React from "react";
import LivePicker from "../_components/LivePicker";

const winnerPickerPage = async ({ params }: { params: any }) => {
  const data = await getVideoMessages(params.id);

  return <LivePicker data={data.messages} />;
};

export default winnerPickerPage;
