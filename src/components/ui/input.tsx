import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, hint, leftIcon, rightIcon, wrapperClassName, ...props },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-[#374151]"
          >
            {label}
            {props.required && <span className="ml-1 text-[#EF4444]">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={id}
            className={cn(
              "flex h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] ring-offset-background transition-all duration-200 placeholder:text-[#9CA3AF]",
              "focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[#EF4444]">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[#6B7280]">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, wrapperClassName, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-[#374151]"
          >
            {label}
            {props.required && <span className="ml-1 text-[#EF4444]">*</span>}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1A1A2E] ring-offset-background transition-all duration-200 placeholder:text-[#9CA3AF]",
            "focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
            error && "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[#EF4444]">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[#6B7280]">{hint}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// Select Component
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, hint, options, placeholder, wrapperClassName, ...props },
    ref
  ) => {
    const id = React.useId();

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-[#374151]"
          >
            {label}
            {props.required && <span className="ml-1 text-[#EF4444]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              "flex h-11 w-full items-center rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] ring-offset-background transition-all duration-200 appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
              error && "border-[#EF4444] focus:ring-[#EF4444]/20 focus:border-[#EF4444]",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="h-5 w-5 text-[#9CA3AF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[#EF4444]">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[#6B7280]">{hint}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-[#E5E7EB] text-[#1A2B6B] transition-colors",
            "focus:ring-2 focus:ring-[#1A2B6B]/20 focus:ring-offset-0",
            error && "border-[#EF4444]",
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-[#374151] cursor-pointer">
            {label}
            {props.required && <span className="ml-1 text-[#EF4444]">*</span>}
          </label>
        )}
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// Radio Component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="flex items-start gap-2.5">
        <input
          type="radio"
          id={id}
          ref={ref}
          className={cn(
            "mt-0.5 h-4 w-4 border-[#E5E7EB] text-[#1A2B6B] transition-colors",
            "focus:ring-2 focus:ring-[#1A2B6B]/20 focus:ring-offset-0",
            error && "border-[#EF4444]",
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-[#374151] cursor-pointer">
            {label}
            {props.required && <span className="ml-1 text-[#EF4444]">*</span>}
          </label>
        )}
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Input, Textarea, Select, Checkbox, Radio };