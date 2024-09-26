"use client";
import { useEffect, useRef, useState } from "react";
import "./productstyles.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { IoMdCart } from "react-icons/io";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { motion } from "framer-motion";
import { calculatePercentage } from "@/backend/helpers";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/shoppingSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Variation } from "./ProductDetailsComponent";

const ProductComponent = ({
  product,
  trendingProducts,
}: {
  product: any;
  trendingProducts: any;
}) => {
  const dispatch = useDispatch();
  const { productsData } = useSelector((state: any) => state?.compras);
  const router = useRouter();
  const [images, setImages] = useState(product?.images);
  const slideRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState([product?.variations[0].size]);
  const [colors, setColors] = useState(product?.colors);
  const [alreadyCart, setAlreadyCart] = useState(false);
  const [color, setColor] = useState(product?.variations[0].color);
  const [size, setSize] = useState(product?.variations[0].size);
  const [variation, setVariation] = useState<Variation>({
    _id: product?.variations[0]._id,
    size: product?.variations[0].size,
    color: product?.variations[0].color,
    colorHex: product?.variations[0].colorHex,
    price: product?.variations[0].price,
    stock: product?.variations[0].stock,
    image: product?.variations[0].image,
  });

  useEffect(() => {
    if (slideRef.current) {
      appendClone();
    }
  }, [images]);

  useEffect(() => {
    // Find matches based on _id property
    const existingProduct = productsData.find((item1: any) =>
      product.variations.some((item2: any) => item1._id === item2._id)
    );

    if (existingProduct?.quantity >= product.stock) {
      setAlreadyCart(true);
    }
  }, [productsData]);

  const appendClone = () => {
    const lists: any = slideRef.current?.querySelectorAll(".item");
    const lastItem = lists[lists.length - 1];

    slideRef.current?.prepend(lastItem);
    if (lists.length > 1) {
      slideRef.current?.prepend(lastItem.cloneNode(true));
      slideRef.current?.removeChild(lists[lists.length - 1]);
    }
  };

  const moveNext = () => {
    const lists: any = slideRef.current?.querySelectorAll(".item");
    const lastItem = lists[lists.length - 1];

    // Clone the last item
    const clonedItem: any = lastItem.cloneNode(true);

    // Add click event to the cloned item
    clonedItem.addEventListener("click", () =>
      clickImage(clonedItem.getAttribute("data-image-id"))
    );

    // Prepend the cloned item
    slideRef.current?.prepend(clonedItem);

    if (lists.length > 1) {
      // Remove the last original item
      slideRef.current?.removeChild(lists[lists.length - 1]);
    }
  };

  const movePrev = () => {
    const lists: any = slideRef.current?.querySelectorAll(".item");
    const firstItem = lists[0];

    // Clone the first item
    const clonedItem = firstItem.cloneNode(true);

    // Add click event to the cloned item
    clonedItem.addEventListener("click", () =>
      clickImage(clonedItem.getAttribute("data-image-id"))
    );

    // Append the cloned item
    slideRef.current?.appendChild(clonedItem);

    if (lists.length > 1) {
      // Remove the first original item
      slideRef.current?.removeChild(firstItem);
    }
  };

  const clickImage = (imageId: any) => {
    const lists: any = slideRef.current?.children;

    // Find the clicked item using imageId
    const clickedItem: any = Array.from(lists).find((item: any) => {
      const itemId = item.getAttribute("data-image-id");
      return itemId === imageId;
    });

    if (clickedItem && lists.length > 1) {
      // Reorder the items in the list
      slideRef.current?.insertBefore(clickedItem, slideRef.current.firstChild);
    }
  };

  const handleClick = () => {
    variation.product = product._id;
    variation.variation = variation._id;
    variation.title = product.title;
    variation.images = [{ url: variation.image }];
    variation.quantity = 1;
    variation.brand = product.brand;
    dispatch(addToCart(variation));
    toast(`${product?.title.substring(0, 15)}... se agrego al carrito`);
    router.push("/carrito");
  };

  const handleColorSelection = (e: any) => {
    e.preventDefault();
    const valueToCheck = e.target.value;
    setColor(valueToCheck);
    const pickedColorVariation = product.variations.find(
      (variation: any) => variation.color === valueToCheck
    );
    setSize(pickedColorVariation.size);
    setVariation(pickedColorVariation);

    const pickedVariation = product.variations.find(
      (variation: any) =>
        variation.color === valueToCheck &&
        variation.size === pickedColorVariation.size
    );
    const currentSizes: any[] = [];
    product?.variations.forEach((variation: any) => {
      const exists = variation.color === valueToCheck;

      if (exists) {
        currentSizes.push(variation.size);
      }
    });
    setSizes(currentSizes);
  };

  const handleSizeSelection = (e: any) => {
    e.preventDefault();
    const valueToCheck = e.target.value;
    const pickedSizeVariation = product.variations.find(
      (variation: any) =>
        variation.size === valueToCheck && variation.color === color
    );
    setVariation(pickedSizeVariation);
    setSize(valueToCheck);
  };

  return (
    <div className="container-class maxsm:py-8 h-full">
      <main className="bg-gray-100 flex min-h-screen flex-col items-center justify-between">
        <div className="w-full mx-auto wrapper-class gap-3 bg-slate-100 text-foreground bg-opacity-80 rounded-lg">
          <div className="flex flex-row maxsm:flex-col items-start justify-start gap-x-5 px-20 py-8 maxmd:py-4  maxmd:px-3">
            <div className="image-class w-1/2 maxsm:w-full flex flex-col items-center justify-center ">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="p-2 w-full relative"
              >
                <h2 className="hidden maxsm:block text-5xl font-semibold font-EB_Garamond mb-5">
                  BRAND
                </h2>
                <div className="container body  " ref={slideRef}>
                  {images.map((image: any, index: number) => (
                    <div
                      key={image._id}
                      data-image-id={image._id}
                      onClick={() => clickImage(image._id)}
                      className={`item cursor-pointer ${
                        index === 0 && "active"
                      }`}
                      style={{
                        backgroundImage: `url('${image.url}')`,
                      }}
                    ></div>
                  ))}
                </div>

                <div className="buttons left-[10%] maxsm:left-[20%]">
                  <button id="prev" onClick={movePrev}>
                    <FaAngleLeft />
                  </button>
                  <button id="next" onClick={moveNext}>
                    <FaAngleRight />
                  </button>
                </div>
              </motion.div>
            </div>
            <div className="description-class w-1/2 maxsm:w-full h-full ">
              <div className="flex flex-col items-start justify-start pt-10 maxsm:pt-2 gap-y-5 w-[90%] maxmd:w-full p-5 pb-10">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-7xl font-semibold font-EB_Garamond mb-3">
                    {product?.brand}
                  </p>
                  <div className="text-xl font-normal s">
                    <div className="flex items-center gap-x-1">
                      <span className="font-base text-xl">
                        {product?.title}
                      </span>
                    </div>
                  </div>
                  {product?.sale_price ? (
                    <div className="flex flex-row items-center justify-between">
                      <div className="border-[1px] border-yellow-600 w-fit py-1 px-4 rounded-full text-xs text-foreground">
                        <p>
                          {calculatePercentage(
                            variation.price,
                            product?.sale_price
                          )}
                          % menos
                        </p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <p className="line-through text-sm text-gray-600 font-bodyFont">
                          <FormattedPrice amount={variation.price} />
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <p className="font-semibold text-4xl text-foreground font-bodyFont">
                      {product?.sale_price > 0 ? (
                        <FormattedPrice amount={product?.sale_price} />
                      ) : variation.price > 0 ? (
                        <FormattedPrice amount={variation.price} />
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="text-xs font-normal text-gray-600">
                      Apártalo con solo 30%:
                    </p>
                    <p className="text-xl text-foreground font-bodyFont">
                      <FormattedPrice amount={variation.price * 0.3} />
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-slate-600 description-class tracking-wider"
                >
                  {product?.description ? product?.description : ""}
                </motion.div>
                <span>
                  Existencias:{" "}
                  <span className=" font-bodyFont">
                    <b>{variation.stock}</b>
                  </span>
                </span>
                {product?.stock <= 0 || alreadyCart ? (
                  ""
                ) : (
                  <>
                    {" "}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="text-sm text-lightText flex flex-col"
                    >
                      <p className="text-slate-500 tracking-widest mb-2">
                        Colores Disponibles:
                      </p>
                      {product?.variations.length > 0 && (
                        <span className="text-foreground flex flex-row items-center gap-5">
                          {colors?.map((c: any, index: number) => (
                            <button
                              value={c.value}
                              key={index}
                              onClick={handleColorSelection}
                              className={`flex cursor-pointer p-3  text-white ${
                                color === c.value ? "bg-black" : "bg-slate-500"
                              }`}
                            >
                              {c.value}
                            </button>
                          ))}
                        </span>
                      )}
                    </motion.div>
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="text-sm text-lightText flex flex-col"
                    >
                      <p className="text-slate-500 tracking-widest mb-2">
                        Tallas Disponibles:
                      </p>
                      {product?.variations.length > 1 ? (
                        <span className="flex items-center gap-5 justify-start mt-2 ">
                          {sizes?.map((s, index) => (
                            <button
                              key={index}
                              onClick={handleSizeSelection}
                              value={s}
                              className={`rounded-full border border-slate-400 flex items-center justify-center px-2 py-1 ${
                                size === s
                                  ? " bg-black text-white"
                                  : "border-slate-400"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </span>
                      ) : (
                        <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-4 mt-2">
                          <p>Talla:</p>
                          <p className="text-foreground">
                            {product?.variations[0].size}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center group"
                >
                  {/* add to cart button */}
                  {product?.stock <= 0 ? (
                    <span className="  border-[1px] border-black font-medium text-xl py-1 px-3 rounded-sm bg-black text-slate-100">
                      SOLD OUT
                    </span>
                  ) : alreadyCart ? (
                    <span className="  border-[1px] border-black text-sm py-1 px-3 rounded-sm bg-black text-slate-100">
                      TODAS LAS EXISTENCIAS ESTÁN EN CARRITO
                    </span>
                  ) : (
                    <motion.button
                      disabled={variation?.stock <= 0}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${
                        variation?.stock <= 0
                          ? "bg-slate-300 grayscale-0 text-slate-500 border-slate-300"
                          : "text-white border-black"
                      } border  drop-shadow-md flex flex-row items-center justify-between px-6 py-3 text-sm gap-x-4 rounded-sm  bg-black  ease-in-out  duration-300 w-80 uppercase tracking-wider cursor-pointer `}
                      onClick={handleClick}
                    >
                      {variation?.stock <= 0
                        ? "Out of Stock"
                        : "Agregar a carrito"}

                      <span
                        className={`${
                          variation?.stock <= 0
                            ? "bg-slate-300 grayscale-0 text-slate-500"
                            : "group-hover:bg-black hover:text-white duration-200 "
                        } text-xl text-slate-400 w-12 flex items-center justify-center  rounded-full py-2`}
                      >
                        <IoMdCart />
                      </span>
                    </motion.button>
                  )}
                </motion.div>
                <div className="flex flex-col">
                  <span>
                    SKU:{" "}
                    <span className=" font-bodyFont">
                      <b>{product?._id}</b>
                    </span>
                  </span>

                  <span>
                    Categoría:{" "}
                    <span className="t font-bodyFont">
                      <b>{product?.category}</b>
                    </span>
                  </span>
                  <span>
                    Genero:{" "}
                    <span className="t font-bodyFont">{product?.gender}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" maxsm:px-4 mb-10 mt-10 w-[90%] mx-auto h-full">
          <p className="text-5xl maxsm:text-4xl font-EB_Garamond pb-5 font-semibold">
            {"Productos destacados"}
          </p>
          <div className="grid maxxsm:grid-cols-1 maxmd:grid-cols-2 grid-cols-4 gap-4 mt-2">
            {trendingProducts?.map((product: any) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductComponent;
