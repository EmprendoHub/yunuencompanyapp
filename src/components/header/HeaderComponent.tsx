"use client";
import React, { useState } from "react";
import MotionHeaderComponent from "./MotionHeaderComponent";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { addAffiliate } from "@/redux/shoppingSlice";
import ModalSubscribe from "../modals/ModalSubscribe";
import { useSession } from "next-auth/react";

const HeaderComponent = ({ cookie }: { cookie: string }) => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const params = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const referralSuccess = params.get("alink");
  if (referralSuccess) {
    dispatch(addAffiliate(referralSuccess));
  }

  const handleSubscribe = async () => {
    setShowModal(true);
  };

  return <MotionHeaderComponent />;
};

export default HeaderComponent;
