"use client";
import React, { useEffect, useRef, useState } from "react";
// import "@toast-ui/editor/dist/toastui-editor.css";
// import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
// import { Editor } from "@toast-ui/react-editor";
import Tiptap from "./Tiptap";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

interface aiProps {
  aiOutput: string;
}

const OutputSection = ({ aiOutput }: aiProps) => {
  const editorRef: any = useRef();
  const { theme } = useTheme();
  console.log(theme, "theme");
  const [editorText, setEditorText] = useState(aiOutput);

  useEffect(() => {
    setEditorText(aiOutput);
  }, [aiOutput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutput);

    toast({ title: "Se copio al portapapeles" });
  };

  return (
    <div className="bg-background shadow-lg border rounded-[10px]">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-sm font-bold">Tus resultados</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={"secondary"}
            className="rounded-[10px] text-xs"
            onClick={handleCopy}
          >
            <Copy /> Copiar
          </Button>
          <Button className="rounded-[10px] text-xs">
            <Copy /> Descargar
          </Button>
        </div>
      </div>
      {/* <Editor
        ref={editorRef}
        initialValue="Tus resultados aparecerán aquí"
        initialEditType="wysiwyg"
        height={"500px"}
        useCommandShortcut={true}
        theme={theme}
        onChange={() =>
          console.log(editorRef.current.getInstance().getMarkdown())
        }
      /> */}
      <Tiptap onChange={(e: any) => console.log(e)} content={editorText} />
    </div>
  );
};

export default OutputSection;
