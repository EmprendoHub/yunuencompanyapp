import { getFBPosts, subscribeToFbApp } from "@/app/_actions";
import React from "react";
import LiveVideoList from "./_components/LiveVideoList";

const liveLiveVideoPicker = async () => {
  const subcribe = await subscribeToFbApp("173875102485412");

  const data = await getFBPosts();

  return <LiveVideoList data={data.posts} />;
};

export default liveLiveVideoPicker;
