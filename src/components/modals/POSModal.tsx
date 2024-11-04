"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PayCartComp from "../admin/PayCartComp";

const backdropVariants = {
  animate: { opacity: 1, scale: 1 },
  initial: { opacity: 0, scale: 0.5 },
};
const POSModal = ({
  showModal,
  setShowModal,
  userId,
}: {
  showModal: any;
  setShowModal: any;
  userId: string;
}) => {
  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <motion.div
          className="backdrop fixed top-0 left-0 w-full h-full bg-primary bg-opacity-40 z-[555]"
          variants={backdropVariants}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          initial="initial"
          animate="animate"
        >
          <PayCartComp setShowModal={setShowModal} userId={userId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default POSModal;
