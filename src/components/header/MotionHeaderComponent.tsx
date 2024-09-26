"use client";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import MobileMenuComponent from "./MobileMenuComponent";
import WhiteLogoComponent from "../logos/WhiteLogoComponent";
import { useSession } from "next-auth/react";

const MotionHeaderComponent = () => {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous: any = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  return (
    <motion.div
      variants={{ hidden: { y: 0 }, visible: { y: "-110%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`${
        !isLoggedIn ? "" : "hidden"
      } print:hidden flex flex-row justify-between header-class from bg-background text-foreground text-xl sticky top-0 z-[50]  w-full mx-auto py-1  border-b shadow-lg `}
    >
      <WhiteLogoComponent className={"ml-5 mt-4 w-28 "} />
      <MobileMenuComponent />
    </motion.div>
  );
};

export default MotionHeaderComponent;
