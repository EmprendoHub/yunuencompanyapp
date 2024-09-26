import TabOne from "@/components/bulkmailer/bulkEmailsPage/TabOne";
import Template from "@/components/bulkmailer/template/Template";
import React from "react";

export default function BulkEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Template />
      <br />
      <div className="border border-1 shadow-lg p-8 maxsm:px-1 rounded-lg w-full">
        <TabOne />
      </div>
    </div>
  );
}
