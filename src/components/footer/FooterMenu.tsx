"use client";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import {
  FaCcVisa,
  FaCcStripe,
  FaCcPaypal,
  FaCcMastercard,
  FaCcDiscover,
} from "react-icons/fa";
import WhiteLogoComponent from "../logos/WhiteLogoComponent";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ModeToggle } from "../toggles/ModeToggle";

const FooterMenu = () => {
  return (
    <div className="relative w-full text-foreground  bg-background px-20 maxmd:px-5 py-24">
      <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-10">
        <div className=" gap-y-4">
          <WhiteLogoComponent className={"ml-5 mt-4 w-[200px] sm:w-[120px]"} />
          <p className="text-xs mt-2">{"Colima 61"}</p>
          <p className="text-xs">{"Sahuayo de Morelos,"}</p>
          <p className="text-xs mb-10">{"Michoacan 59053"}</p>
          <div className="flex items-center gap-x-4">
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.tiktok.com/ofertazosmx"
              target="_blank"
            >
              <span className="socialLink">
                <BsTiktok className="text-xs" />
              </span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.instagram.com/ofertazosmx"
              target="_blank"
            >
              <span className="socialLink">
                <BsInstagram className="text-xs" />
              </span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.facebook.com/ofertazosmx"
              target="_blank"
            >
              <span className="socialLink">
                <BsFacebook className="text-xs" />
              </span>
            </motion.a>
          </div>
        </div>
        <div>
          <p className="text-sm">Explora por Categoría</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/tienda?keyword=accesorios`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Accesorios"}
              </motion.li>
            </Link>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/tienda?keyword=bolsas`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"Bolsos"}
              </a>
            </motion.li>
            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/tienda?keyword=calzado`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"Calzado"}
              </a>
            </motion.li>

            <motion.li
              whileHover={{ y: -4 }}
              whileTap={{ y: 1 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <a
                href={`/tienda?keyword=prenda`}
                className="text-slate hover:text-primary cursor-pointer duration-200"
              >
                {"Prendas"}
              </a>
            </motion.li>
          </ul>
        </div>
        <div>
          <p className="text-sm">{"Mapa del Sitio"}</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/acerca`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Acerca de Nosotros"}
              </motion.li>
            </Link>
            <Link href={`/blog`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Blog de Moda"}
              </motion.li>
            </Link>
            <Link href={`/contacto`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Contacto"}
              </motion.li>
            </Link>
            <Link href={`/tienda`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Tienda en Linea"}
              </motion.li>
            </Link>
          </ul>
        </div>
        <div>
          <p className="text-sm mb-2"> {"Declaraciones Legales"}</p>
          <ul className="text-xs font-base mt-2 flex flex-col gap-y-2">
            <Link href={`/terminos`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary  cursor-pointer duration-200"
              >
                {"Términos de Uso"}
              </motion.li>
            </Link>

            <Link href={`/politica`}>
              <motion.li
                whileHover={{ y: -4 }}
                whileTap={{ y: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:text-primary cursor-pointer duration-200"
              >
                {"Política de privacidad"}
              </motion.li>
            </Link>
          </ul>

          <div className="pt-5 flex flex-row flex-wrap items-center justify-start gap-x-4">
            <FaCcVisa className="text-xs" />
            <FaCcStripe className="text-xs" />
            <FaCcPaypal className="text-xs" />
            <FaCcMastercard className="text-xs" />
            <FaCcDiscover className="text-xs" />
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
