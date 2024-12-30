import React from "react";
import WinnerPicker from "../_components/WinnerPicker";

const winnerPickerPage = async ({ params }: { params: any }) => {
  return <WinnerPicker postId={params.id} />;
};

export default winnerPickerPage;
