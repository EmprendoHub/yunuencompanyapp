"use client";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { AIOutput } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { AiDbOutput } from "../historial/_components/DataTable";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import AuthContext from "@/context/AuthContext";

const UsageTrack = () => {
  const { user } = useContext(AuthContext);
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);

  useEffect(() => {
    user && GetData();
    // eslint-disable-next-line
  }, [user, totalUsage]);

  const GetData = async () => {
    const result: AiDbOutput[] = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, user?.email || ""));
    GetTotalUsage(result);
  };

  const GetTotalUsage = (result: AiDbOutput[]) => {
    let total: number = 0;
    result.forEach((element) => {
      total = total + Number(element.aiResponse?.length);
    });

    setTotalUsage(total);
  };
  return (
    <div className="tracking-class">
      <div className="bg-primary text-white p-3 rounded-[10px] ">
        <h2>Credits</h2>
        <div className="h-2 bg-primary-foreground w-full rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{ width: (totalUsage / 1000000) * 100 + "%" }}
          ></div>
        </div>
        <h2 className="text-[10px]">{totalUsage}/1,000,000 Credits used</h2>
      </div>
      <Button
        variant={"outline"}
        className="w-full my-3 rounded-[10px]  text-[12px]"
      >
        Upgrade
      </Button>
    </div>
  );
};

export default UsageTrack;
