import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import * as React from "react";

import { Button, Label } from "@corpora/ui";
import { Calendar } from "@corpora/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@corpora/ui";
import { cn } from "@corpora/ui";

import type { BaseFormFieldProps } from "./types";

interface FormDatePickerFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  dateFormat?: string;
}

export function FormDatePickerField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Pick a date",
  className,
  disabled,
  dateFormat = "dd/MM/yyyy",
}: FormDatePickerFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const dateValue = React.useMemo(() => {
    if (!field.value) return null;
    const d = new Date(field.value);
    return isValid(d) ? d : null;
  }, [field.value]);

  return (
    <div className="gap-3 flex w-full flex-col">
      <Label
        htmlFor={name}
        className="text-xs md:text-sm text-slate-900 font-medium"
      >
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateValue && "text-muted-foreground",
              "text-xs md:text-sm text-slate-900 font-normal no-focus-outline",
              "placeholder:text-xs md:placeholder:text-sm placeholder:text-slate-500 placeholder:font-normal",
              "py-4 md:py-5 rounded-md",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 size-4" />
            {dateValue ? format(dateValue, dateFormat) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue || undefined}
            onSelect={field.onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-sm font-normal"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
