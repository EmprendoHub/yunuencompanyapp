import { getPostDBComments, getVideoMessages } from "@/app/_actions";
import React from "react";
import LivePicker from "../_components/LivePicker";

const winnerPickerPage = async ({ params }: { params: any }) => {
  const data: any = await getPostDBComments(params.id);
  console.log(data);

  return <LivePicker data={data.commentsData} />;
};

export default winnerPickerPage;
