import { getPostDBComments } from "@/app/_actions";
import React from "react";
import LivePicker from "../_components/LivePicker";

const winnerPickerPage = async ({ params }: { params: any }) => {
  const data: any = await getPostDBComments(params.id);

  return <LivePicker initialData={data.commentsData} />;
};

export default winnerPickerPage;
