"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className,
}) => {
  const [date, setDate] = React.useState<Date | null>(selected);

  React.useEffect(() => {
    setDate(selected);
  }, [selected]);

  // Change the type of newDate to accept Date | undefined, and convert undefined to null.
  const handleDateChange = (newDate: Date | undefined) => {
    const convertedDate = newDate ?? null;
    setDate(convertedDate);
    onChange(convertedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined} // Convert null to undefined
          onSelect={handleDateChange} // Update the event handler to handle Date | undefined
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
