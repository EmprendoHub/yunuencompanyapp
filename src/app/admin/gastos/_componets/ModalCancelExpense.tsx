"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import CancelExpenseComp from "./CancelExpenseComp";

// Define variants without the duration property directly
const backdropVariants = {
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 }, // Add duration here
  },
  initial: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 }, // Add duration here
  },
};

const ModalCancelExpense = ({
  pathname,
  showModal,
  setShowModal,
  expenseId,
  isPaid,
}: {
  pathname: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  expenseId: string;
  isPaid: boolean;
}) => {
  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <motion.div
          className="backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[555]"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
        >
          <CancelExpenseComp
            setShowModal={setShowModal}
            expenseId={expenseId}
            isPaid={isPaid}
            pathname={pathname}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalCancelExpense;
