import UpdateAddress from "@/components/user/profile/UpdateAddress";
import React from "react";

const UserAddressPage = async ({ params }: { params: any }) => {
  return <UpdateAddress id={params.id} />;
};

export default UserAddressPage;
