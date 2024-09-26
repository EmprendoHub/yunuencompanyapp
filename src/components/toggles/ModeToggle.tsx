"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center gap-x-2 justify-start">
      <Button onClick={() => setTheme("light")} variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 text-slate-500 hover:text-slate-500" />
      </Button>
      <Button onClick={() => setTheme("dark")} variant="ghost" size="icon">
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 text-foreground dark:text-slate-700 hover:text-slate-500 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
