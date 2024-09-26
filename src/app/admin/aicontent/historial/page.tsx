"use client";

import React, { useState, useEffect, useContext } from "react";
import { db } from "../../../../../utils/db";
import { AIOutput } from "../../../../../utils/schema";
import { DataTableHistory } from "./_components/DataTable";
import AuthContext from "@/context/AuthContext";
import { eq } from "drizzle-orm";

const HistoryPage = () => {
  const [data, setData] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const result = await db
          .select()
          .from(AIOutput)
          .where(eq(AIOutput.createdBy, user?.email || ""));
        setData(result);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-5 bg-background">
      <DataTableHistory rawData={data} />
    </div>
  );
};

export default HistoryPage;
