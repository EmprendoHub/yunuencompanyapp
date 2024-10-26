"use client";
import Image from "next/image";
import Link from "next/link";
import React, { createContext, useContext, useState } from "react";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UrlObject } from "url";

const SidebarContext = createContext<{ expandSidebar: boolean } | undefined>(
  undefined
);

const BranchSidebar = ({ children }: { children: any }) => {
  const [expandSidebar, setExpandSidebar] = useState(true);
  let user: any;
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  if (isLoggedIn) {
    user = session?.user;
  }
  return (
    <aside className="h-screen print:hidden ">
      <nav className="h-full flex flex-col bg-background border-r border-r-slate-300 shadow-sm">
        <div className="p-4 maxmd:p-2 pb-2 flex justify-between maxmd:justify-center items-center">
          <Image
            alt="image"
            src={"/logos/yunuen_logo_Horixontal.webp"}
            width={500}
            height={500}
            className={`overflow-hidden transition-all ease-in-out ${
              expandSidebar ? "w-36 h-auto  maxmd:w-36 maxmd:ml-1" : "w-0 h-0"
            }`}
          />
          <button
            onClick={() => setExpandSidebar((currentState) => !currentState)}
            className="p-1.5 rounded-lg bg-card"
          >
            {expandSidebar ? (
              <BsChevronBarLeft size={20} />
            ) : (
              <BsChevronBarRight size={20} />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expandSidebar }}>
          <ul className="flex-1 ">{children}</ul>
        </SidebarContext.Provider>
        {/* user avatar */}
        <div className="border-t flex p-1 ">
          <Image
            alt={user?.name ? user?.name : "avatar"}
            src={user?.image ? user?.image : "/images/avatar_placeholder.jpg"}
            width={500}
            height={500}
            className="w-10 h-10 rounded-full"
          />

          <div
            className={`flex items-center overflow-hidden transition-all ease-in-out  ${
              expandSidebar ? "w-full ml-3 maxmd:ml-1" : "w-0"
            }`}
          >
            <div className="leading-4 w-full">
              <div className="flex items-center">
                <h4 className="font-semibold text-xs leading-4 text-wrap w-2/3 ">
                  {" "}
                  {user?.name}
                </h4>
                <div
                  className=" text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
                  onClick={() => signOut()}
                >
                  <div
                    className={`${
                      expandSidebar ? "group absolute w-32" : "w-0"
                    }`}
                  >
                    <FiLogOut />
                    <span className="absolute -top-10 scale-0 transition-all rounded bg-black p-2 text-xs text-white group-hover:scale-100 z-50">
                      Cerrar Session!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default BranchSidebar;

export function SideBarItem({
  icon,
  text,
  active,
  alert,
  url,
  dropdownItems,
}: {
  icon: any;
  text: string;
  active: any;
  alert?: any;
  url: string;
  dropdownItems?: any;
}) {
  const { expandSidebar }: any = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleDropdownToggle = () => {
    if (dropdownItems) {
      setDropdownOpen(!dropdownOpen);
    } else {
      // If no dropdown items, navigate to the URL directly
      router.push(url);
    }
  };

  return (
    <li
      className={`relative flex flex-col items-center justify-center py-8 px-3 maxmd:pr-1 my-2 font-medium rounded-md cursor-pointer gap-x-1 transition-colors group ${
        active ? "bg-card text-primary" : "hover:bg-card text-gray-500"
      }`}
      onClick={handleDropdownToggle}
    >
      <div className="flex items-center justify-center text-2xl">
        {icon}
        <span
          className={`flex justify-between items-center overflow-hidden transition-all ease-in-out   ${
            expandSidebar ? " w-30 ml-2  maxmd:w-30 maxmd:ml-1" : "w-0"
          }`}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 bg-indigo-400 rounded-full ${
              expandSidebar ? "" : "top-2"
            }`}
          />
        )}
      </div>

      {/* Render dropdown items if dropdown is open */}
      {dropdownOpen && dropdownItems && (
        <motion.ul
          variants={{
            animate: { opacity: 1, scale: 1 },
            initial: { opacity: 0, scale: 0.5 },
          }}
          transition={{ duration: 0.5 }}
          initial="initial"
          animate="animate"
          className="relative flex flex-col mt-1 w-full bg-background"
        >
          {dropdownItems.map(
            (
              item: {
                url: string | UrlObject;
                active: any;
                icon: any;
                text: string;
              },
              index: React.Key | null | undefined
            ) => (
              <Link href={item.url} key={index}>
                <li
                  className={`py-2 px-3 cursor-pointer flex items-center rounded-md ${
                    item.active
                      ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-primary"
                      : "hover:bg-indigo-50 text-gray-600 bg-opacity-0"
                  }`}
                >
                  {item.icon && item.icon}
                  <span
                    className={`flex justify-between items-center overflow-hidden transition-all ease-in-out  ${
                      expandSidebar
                        ? " w-36 ml-2  maxmd:w-36 maxmd:ml-1"
                        : "w-0"
                    }`}
                  >
                    {item.text}
                  </span>
                  {!expandSidebar && (
                    <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-primary text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                      {item.text}
                    </div>
                  )}
                </li>
              </Link>
            )
          )}
        </motion.ul>
      )}

      {!expandSidebar && (
        <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-primary text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  );
}
