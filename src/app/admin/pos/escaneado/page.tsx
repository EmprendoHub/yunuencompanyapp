import { options } from "@/app/api/auth/[...nextauth]/options";
import POSIdResults from "@/components/pos/POSIdResults";
import { getServerSession } from "next-auth";
import React from "react";

const POSCartPage = async () => {
  const session = await getServerSession(options);
  const userId = session.user._id;
  return (
    <>
      <POSIdResults userId={userId} />
    </>
  );
};

export default POSCartPage;
