"use client";
import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const MobileNavLink = ({ title, href }: { title: string; href: string }) => {
  return (
    <AnimatePresence>
      <motion.div className="text-2xl uppercase font-poppins">
        <Link href={href}>{title}</Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileNavLink;
