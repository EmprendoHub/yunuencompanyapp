"use client";
import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineLogin,
} from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import MiniMenuComponent from "./MiniMenuComponent";
import DarkModeLogo from "../logos/WhiteLogoNoLink";

const navLinks = [
  { title: "Inicio", url: "/" },
  { title: "Blog", url: "/blog" },
  { title: "Nosotros", url: "/acerca" },
  { title: "Contacto", url: "/contacto" },
  { title: "Tienda", url: "/tienda" },
];

const MobileMenuComponent = () => {
  const [open, setOpen] = useState(false);
  const toggleMobileMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const menuVariants = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: [0.12, 1, 0.39, 1],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVariants = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  return (
    <>
      <nav className="flex flex-row items-center justify-center gap-x-2">
        <MiniMenuComponent />
        {/*Mobile Navigation*/}
        <div
          onClick={toggleMobileMenu}
          className="relative flex flex-row  items-center justify-end right-4 gap-x-2 text-white cursor-pointer text-sm"
        >
          <div className="p-2 bg-background drop-shadow-md text-foreground rounded-full hover:rotate-180 ease-linear duration-300">
            <AiOutlineMenu className="text-sm " />
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className=" fixed left-0 top-0 w-full min-h-screen bg-black text-white px-10 pt-2  origin-top"
          >
            <div className="flex h-full flex-col">
              <div className="flex relative  min-h-full justify-between items-center pb-5">
                <DarkModeLogo className={"ml-5 mt-4 w-[200px] sm:w-[120px]"} />
                <p
                  onClick={toggleMobileMenu}
                  className="cursor-pointer text-md text-white"
                >
                  <AiOutlineClose />
                </p>
              </div>
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="open"
                exit="initial"
                className="flex flex-col h-[50vh] justify-between font-poppins tracking-wider items-center gap-4"
              >
                {navLinks?.map((link, index) => {
                  return (
                    <div key={index} className="overflow-hidden ">
                      <MobileNavLink
                        title={link.title}
                        href={link.url}
                        toggleMobileMenu={toggleMobileMenu}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
            {/** Logout Button */}
            {isLoggedIn ? (
              <div
                onClick={() => signOut()}
                className="pt-10 cursor-pointer flex justify-center items-center gap-x-1 "
              >
                Cerrar Session
                <AiOutlineLogout className="text-2xl flex" />
                {/* <p className='text-sm font-semibold'>Logout</p> */}
              </div>
            ) : (
              ""
            )}
            {/* Contact Links */}
            <div className="flex fle-row items-center justify-center gap-x-4 pt-10">
              <Link
                href={"tel:3535323421"}
                className="maxmd:hidden flex flex-row justify-between items-center gap-x-2 cursor-pointer"
              >
                <span className="text-base">353-532-3421</span>
              </Link>
              <div className="flex items-center gap-x-4">
                <motion.a
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.instagram.com/ofertazosmx/"
                  target="_blank"
                >
                  <span className="socialLink">
                    <BsInstagram className="text-2xl sm:text-base" />
                  </span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.facebook.com/ofertazosmx/"
                  target="_blank"
                >
                  <span className="socialLink">
                    <BsFacebook className="text-2xl sm:text-base" />
                  </span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenuComponent;

const mobileNavLinksVariants = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0.35, 0.45, 1],
    },
  },
};

const MobileNavLink = ({
  title,
  href,
  toggleMobileMenu,
}: {
  title: string;
  href: string;
  toggleMobileMenu: any;
}) => {
  return (
    <motion.div
      variants={mobileNavLinksVariants}
      className="text-4xl uppercase font-bold "
    >
      <Link
        href={href}
        onClick={toggleMobileMenu}
        className="p-6 hover:text-primary duration-300 ease-in-out"
      >
        {title}
      </Link>
    </motion.div>
  );
};
