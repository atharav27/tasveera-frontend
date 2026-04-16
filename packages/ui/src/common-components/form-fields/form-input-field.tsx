import type { FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import { Input, Label } from "@corpora/ui";
import { cn } from "@corpora/ui";

import type { BaseFormFieldProps } from "./types";

interface FormInputFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  readOnly?: boolean;
  optional?: boolean;
}

export function FormInputField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  disabled,
  readOnly,
  optional,
  type = "text",
}: FormInputFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className="gap-3 flex w-full flex-col">
      <Label
        htmlFor={name}
        className="text-xs md:text-sm text-slate-900 font-medium"
      >
        {label}
        {optional && <span className="text-slate-500 font-normal ml-1">(Optional)</span>}
      </Label>
      <Input
        {...field}
        value={field.value ?? ""}
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "text-xs md:text-sm text-slate-900 font-normal no-focus-outline",
          "placeholder:text-xs md:placeholder:text-sm placeholder:text-slate-500 placeholder:font-normal",
          "py-4 md:py-5 rounded-md",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
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

