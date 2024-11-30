import MessagesTabOne from "@/components/bulkmessenger/bulkMesaggesPage/MessagesTabOne";
import TemplateMessage from "@/components/bulkmessenger/template/TemplateMessage";
import React from "react";

export default function BulkEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center  bg-background">
      <TemplateMessage />
      <br />
      <div className="border border-1 shadow-lg p-8 maxsm:px-1 rounded-lg w-full h-full">
        <MessagesTabOne />
      </div>
    </div>
  );
}
