"use client";
import React, { useContext, useState } from "react";
import OutputSection from "./OutputSection";
import FormSection from "./FormSection";
import { ArrowBigLeftDash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Templates from "@/app/(dashdata)/Templates";
import { TEMPLATE } from "../../_components/TemplateListSection";
import { GetAIContent } from "./GetContent";
import { db } from "../../../../../../utils/db";
import { AIOutput } from "../../../../../../utils/schema";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";

const InnerTemplate = ({ pageSlug }: { pageSlug: string }) => {
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === pageSlug
  );
  const [onLoading, setOnLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);

  const GenerateAIContent = async (formData: any) => {
    if (totalUsage >= 100000) {
      toast({
        title: "Actualiza tu plan",
        description: "Llegaste al limite de tu crédito mensual",
      });
      router.push("/aicontent/cobranza");
      return;
    }
    setOnLoading(true);

    const response = await GetAIContent(JSON.stringify(formData), pageSlug);
    setAiOutput(response.result);
    await saveInDb(formData, selectedTemplate?.slug, response.result);
    setOnLoading(false);
  };

  const saveInDb = async (formData: any, slug: any, aiResp: string) => {
    const createdBy = user?.email ?? ""; // Provide a default value if undefined
    const createdAt = new Date().toLocaleDateString(); // Ensure this is a string

    if (!createdBy) {
      throw new Error("User's email address is missing");
    }

    const result = await db.insert(AIOutput).values({
      formData: formData,
      templateSlug: slug,
      aiResponse: aiResp,
      createdBy: createdBy,
      createdAt: createdAt,
    });
  };

  return (
    <div className="p-5 bg-background">
      <Link href={"/admin/aicontent"}>
        <Button className="text-[12px] rounded-[10px]">
          <ArrowBigLeftDash size={20} /> Atras
        </Button>
      </Link>
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-5 py-5">
        {/* Form Section */}
        <FormSection
          selectedTemplate={selectedTemplate}
          setUserFormInput={(v: any) => GenerateAIContent(v)}
          loading={onLoading}
        />

        {/* Output Section */}
        <div className=" col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
};

export default InnerTemplate;
