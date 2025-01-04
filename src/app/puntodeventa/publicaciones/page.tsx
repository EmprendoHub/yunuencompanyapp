import { getFBPosts, subscribeToFbApp } from "@/app/_actions";
import React from "react";
import LiveVideoPicker from "./_components/LiveVideoPicker";

const liveLiveVideoPicker = async () => {
  const subcribe = await subscribeToFbApp("173875102485412");

  const data = await getFBPosts();

  return <LiveVideoPicker data={data.posts} />;
};

export default liveLiveVideoPicker;
