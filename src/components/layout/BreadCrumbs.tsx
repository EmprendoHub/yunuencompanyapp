import React from "react";
import Link from "next/link";
import { BsChevronRight } from "react-icons/bs";

const BreadCrumbs = ({ breadCrumbs }: { breadCrumbs: any }) => {
  return (
    <section className="py-5 sm:py-7 bg-blue-100 text-foreground">
      <div className=" max-w-screen-xl mx-auto px-4">
        <ol className="inline-flex flex-wrap text-gray-600 space-x-1 maxmd:space-x-3 items-center">
          {breadCrumbs?.map((crumb:any, index:number) => (
            <li key={index} className="inline-flex items-center">
              <Link
                href={crumb?.url}
                className="text-gray-600 hover:text-blue-600"
              >
                {crumb?.name}
              </Link>
              {breadCrumbs?.length - 1 !== index && (
                <BsChevronRight className="ml-3 text-gray-800" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default BreadCrumbs;
