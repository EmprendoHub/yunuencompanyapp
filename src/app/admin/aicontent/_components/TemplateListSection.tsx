"use client";
import Templates from "@/app/(dashdata)/Templates";
import React, { useEffect, useState } from "react";
import TemplateCard from "./TemplateCard";

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug?: string;
  aiPromt?: string;
  form: FORM[];
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

const TemplateListSection = ({ userSearchInput }: any) => {
  useEffect(() => {
    if (userSearchInput) {
      const filterData = Templates.filter((item) =>
        item.name
          .toLocaleLowerCase()
          .includes(userSearchInput.toLocaleLowerCase())
      );

      setTemplateList(filterData);
    } else {
      setTemplateList(Templates);
    }
  }, [userSearchInput]);

  const [templateList, setTemplateList] = useState(Templates);

  return (
    <div className=" bg-background grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
      {templateList.map((item: TEMPLATE, index: number) => (
        <TemplateCard key={index} {...item} />
      ))}
    </div>
  );
};

export default TemplateListSection;
