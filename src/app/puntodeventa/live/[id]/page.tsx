import React from "react";
import LiveMessages from "../_components/LiveMessages";
import HostComment from "../_components/HostComment";
import RaffleShareList from "../_components/RaffleShareList";

const winnerPickerPage = async ({ params }: { params: any }) => {
  return (
    <div className="flex items-center gap-5">
      <LiveMessages postId={params.id} />
      {/* <HostComment /> */}

      <RaffleShareList postId={params.id} />
    </div>
  );
};

export default winnerPickerPage;
