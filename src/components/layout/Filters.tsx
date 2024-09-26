"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getPriceQueryParams } from "@/backend/helpers/index";
import { IoIosStar } from "react-icons/io";
import Search from "./Search";

const Filters = ({ allCategories }: { allCategories: any }) => {
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const router = useRouter();
  let queryParams: any;

  function handleClick(checkbox: any) {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item: any) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      //delete filter
      queryParams.delete(checkbox.name);
    } else {
      //set query filter
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
      }
    }
    const path = window.location.pathname + "?" + queryParams.toString();
    router.push(path);
  }

  function handlePriceButtonClick() {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);

      queryParams = getPriceQueryParams(queryParams, "max", maxAmount);
      queryParams = getPriceQueryParams(queryParams, "min", minAmount);

      const path = window.location.pathname + "?" + queryParams.toString();
      router.push(path);
    }
  }

  function checkHandler(checkBoxType: any, checkBoxValue: any) {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);

      const value = queryParams.get(checkBoxType);
      if (checkBoxValue === value) return true;
      return false;
    }
  }

  const starRating = (props: any) => {
    if (props) {
      let stars = props;
      if (stars == 0 || stars == 1 || stars == 1.5) {
        stars = 1;
      } else if (stars == 2 || stars == 2.5) {
        stars = 2;
      } else if (stars == 3 || stars == 3.5) {
        stars = 3;
      } else if (stars == 4 || stars == 4.5) {
        stars = 4;
      } else if (stars == 5) {
        stars = 5;
      }
    }

    const starArray = Array.from({ length: props }, (_, index) => (
      <span key={index} className="text-yellow-500">
        <IoIosStar />
      </span>
    ));
    return <>{starArray}</>;
  };

  return (
    <aside className="maxmd:w-1/3 lg:w-1/4 px-4">
      <a
        className="maxmd:hidden mb-5  w-full text-center px-4 py-2 inline-block text-lg text-gray-700 bg-background shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
        href="#"
      >
        Filtrar por
      </a>
      {/* Search Filter */}

      <div className=" px-6 py-4 border border-gray-200 bg-background rounded shadow-sm">
        <Search />
      </div>
      {/* Price Filter */}

      <div className=" px-6 py-4 border border-gray-200 bg-background rounded shadow-sm">
        <h3 className="font-semibold mb-2">Price ($)</h3>

        <div className="grid sm:grid-cols-3 gap-x-2">
          <div className="mb-4">
            <input
              name="min"
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="number"
              placeholder="Min"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              name="max"
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
              type="number"
              placeholder="Max"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button
              className="px-1 py-2 text-center w-full inline-block text-white bg-black border border-transparent rounded-md hover:bg-indigo-700"
              onClick={handlePriceButtonClick}
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <div className="hidden maxmd:block px-6 py-4 border border-gray-200 bg-background rounded shadow-sm">
        <h3 className="font-semibold mb-2">Category</h3>

        <ul className="space-y-1">
          {allCategories?.map((category: any, index: number) => (
            <li key={index}>
              <label className="flex items-center">
                <input
                  name="category"
                  type="checkbox"
                  value={category}
                  className="h-4 w-4"
                  defaultChecked={checkHandler("category", `${category}`)}
                  onClick={(e) => handleClick(e.target)}
                />
                <span className="ml-2 text-gray-500"> {category} </span>
              </label>
            </li>
          ))}
        </ul>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Ratings</h3>
        <ul className="space-y-1">
          <li>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  name="rating"
                  type="checkbox"
                  value={rating}
                  className="h-4 w-4"
                  defaultChecked={checkHandler("rating", `${rating}`)}
                  onClick={(e) => handleClick(e.target)}
                />
                <span className="ml-2 text-gray-500">{starRating(rating)}</span>
              </label>
            ))}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Filters;
