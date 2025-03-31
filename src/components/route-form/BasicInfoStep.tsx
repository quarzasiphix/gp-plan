
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BasicInfoStepProps {
  routeName: string;
  date: Date | undefined;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

const BasicInfoStep = ({ 
  routeName, 
  date, 
  onNameChange, 
  onDateChange 
}: BasicInfoStepProps) => {
  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Route Name</label>
        <input
          type="text"
          name="name"
          value={routeName}
          onChange={onNameChange}
          placeholder="e.g. Poland to Spain Trip"
          className="search-input"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Departure Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-full justify-start text-left font-normal border border-input bg-background",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BasicInfoStep;
