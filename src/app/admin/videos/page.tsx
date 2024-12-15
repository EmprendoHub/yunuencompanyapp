import { getFBLiveVideos } from "@/app/_actions";
import React from "react";
import LiveVideoPicker from "./_components/LiveVideoPicker";

const liveLiveVideoPicker = async () => {
  const data = await getFBLiveVideos();
  return <LiveVideoPicker data={data.videos} />;
};

export default liveLiveVideoPicker;
