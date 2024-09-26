"use client";
import React, { useState } from "react";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

interface templateProps {
  selectedTemplate?: TEMPLATE;
  setUserFormInput: any;
  loading: boolean;
}

const FormSection = ({
  selectedTemplate,
  setUserFormInput,
  loading,
}: templateProps) => {
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    setUserFormInput(formData);
  };
  const [formData, setFormData] = useState<any>();

  const handleChangeEvent = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className=" p-5 shadow-md rounded-[10px] bg-card">
      {/* @ts-ignore */}
      <Image alt="icon" src={selectedTemplate?.icon} width={70} height={70} />
      <h2 className="font-bold text-xl mb-2 text-primary">
        {selectedTemplate?.name}
      </h2>
      <p className="text-gray-500 text-xs">{selectedTemplate?.desc}</p>

      <form className=" mt-6 " onSubmit={onSubmitForm}>
        {selectedTemplate?.form.map((item, index) => (
          <div key={item.label} className=" my-2 flex flex-col gap-2 mb-7">
            <label className="text-xs font-bold">{item.label}</label>
            {item.field === "input" ? (
              <Input
                name={item.name}
                required={item?.required}
                onChange={handleChangeEvent}
                placeholder={item.label}
              />
            ) : item.field === "textarea" ? (
              <Textarea
                name={item.name}
                placeholder={item.label}
                required={item?.required}
                onChange={handleChangeEvent}
              />
            ) : null}
          </div>
        ))}
        <Button
          type="submit"
          variant={"secondary"}
          className="w-full py-6 rounded-[10px]"
          disabled={loading}
        >
          {loading && <LoaderIcon className=" animate-spin" />}
          Generar Contenido
        </Button>
      </form>
    </div>
  );
};

export default FormSection;
