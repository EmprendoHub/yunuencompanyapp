import POSCart from "@/components/pos/POSCart";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../../../api/auth/[...nextauth]/options";

const POSCartPage = async () => {
  const session = await getServerSession(options);
  const userId = session.user._id;

  return (
    <>
      <POSCart userId={userId} />
    </>
  );
};

export default POSCartPage;
