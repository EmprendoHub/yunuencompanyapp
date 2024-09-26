"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDENAV_ITEMS } from "@/backend/data/constants";
import { motion, useCycle } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const HeaderMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <div className="absolute -left-6 -top-4 z-50 font-EB_Garamond">
      <MenuToggle toggle={toggleOpen} />
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        className={`relative inset-0 z-30 w-full  ${
          isOpen ? "" : "pointer-events-none"
        }`}
        ref={containerRef}
      >
        <motion.div
          className="absolute inset-0 left-0 w-full bg-background"
          variants={sidebar}
        />
        <motion.ul
          variants={variants}
          className={`${
            isOpen ? "bg-background w-full relative" : "absolute"
          }  grid w-full gap-3 px-10 py-16`}
        >
          {SIDENAV_ITEMS.map((item, idx) => {
            const isLastItem = idx === SIDENAV_ITEMS.length - 1; // Check if it's the last item

            return (
              <div key={idx}>
                {item.submenu ? (
                  <MenuItemWithSubMenu
                    item={item}
                    toggleOpen={toggleOpen}
                    isOpen={isOpen}
                  />
                ) : (
                  <MenuItem className={""}>
                    <Link
                      href={item.path}
                      onClick={() => toggleOpen()}
                      className={`flex w-full text-2xl ${
                        item.path === pathname ? "font-bold" : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  </MenuItem>
                )}

                {!isLastItem && (
                  <MenuItem className="my-3 h-px w-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </motion.ul>
      </motion.nav>
    </div>
  );
};

export default HeaderMobile;

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button onClick={toggle} className="pointer-events-auto relative  z-50">
    <svg width="30" height="30" viewBox="0 0 24 17">
      <Path
        d="M 2 3.423 L 20 3.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        d="M 2 15.423 L 20 15.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className: any;
  children?: any;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemWithSubMenu = ({
  item,
  toggleOpen,
  isOpen,
}: {
  item: any;
  toggleOpen: any;
  isOpen: any;
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem className={""}>
        <button
          className="flex w-full text-2xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div
            className={`flex gap-2 flex-row justify-between w-full items-center`}
          >
            <span
              className={`text-2xl ${
                pathname.includes(item.path) ? "font-bold " : ""
              }`}
            >
              {item.title}
            </span>
            <div
              className={`${
                subMenuOpen && "rotate-180"
              } duration-500 ease-in-out`}
            >
              <FaChevronDown className="text-base" />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2">
        {subMenuOpen && (
          <>
            {item.subMenuItems?.map((subItem: any, subIdx: any) => {
              return (
                <MenuItem key={subIdx} className={""}>
                  <Link
                    href={subItem.path}
                    onClick={() => toggleOpen()}
                    className={`text-xl ${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    {subItem.title}
                  </Link>
                </MenuItem>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};
