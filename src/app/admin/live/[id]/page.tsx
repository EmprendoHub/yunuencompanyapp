import React from "react";
import LivePicker from "../_components/LivePicker";
import HostComment from "../_components/HostComment";
import WinnerPicker from "../../rifa/_components/WinnerPicker";

const winnerPickerPage = async ({ params }: { params: any }) => {
  return (
    <div className="flex items-center gap-5">
      <LivePicker postId={params.id} />
      {/* <HostComment /> */}

      <WinnerPicker postId={params.id} />
    </div>
  );
};

export default winnerPickerPage;
