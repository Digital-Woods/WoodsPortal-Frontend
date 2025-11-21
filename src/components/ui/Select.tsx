import React, { useEffect, useState } from 'react'
import MSelect from 'react-select';

import { Controller } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { Client } from '@/data/client/index'
import { useToaster } from '@/state/use-toaster';
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export const Select = ({
  label,
  name = "",
  options: selectOptions = [],
  defaultValue = "",
  control,
  filled = null,
  onChangeSelect = null,
  setValue = null,
  size = "medium",
  className,
  apiEndPoint = null,
  optionlabel = "label",
  optionValue = "value",
  disabled = false,
  isMulti = false,
  isClearable = true,
  ...props
}: any) => {
  const { setToaster } = useToaster();
  const [options, setOptions] = useState([]);

  const { mutate: fetchOptions, isLoading } = useMutation({
    mutationKey: ["getOptionsData"],
    mutationFn: async () => {
      try {
        const response = await Client.form.options({
          API: apiEndPoint,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (response: any) => {
      setOptions(response?.data?.results || []);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({ message: errorMessage, type: "error" });
    },
  });

  const getValue = (data: any) => {
    // If array → return joined values
    if (Array.isArray(data)) {
      return data
        .map((item) => (typeof item === "object" ? item[optionValue] : item))
        .join(";");
    }

    // If object → return property value
    if (typeof data === "object" && data !== null) {
      return data[optionValue];
    }

    // If string/number/etc → return as-is
    return data;
  };

  const handleChange = (e: any, field?: { onChange: (value: any) => void }) => {
    const selected = getValue(e);

    if(field) {
      field.onChange(selected);
    }

    if (onChangeSelect) {
      onChangeSelect(filled, selected);
    }
    if (setValue) {
      setValue(filled?.name, selected);
    }
  };

  useEffect(() => {
    if (selectOptions) {
      setOptions(selectOptions)
    }
    if (disabled && selectOptions.length === 1) {
      handleChange(selectOptions[0].value)
    }
    if (selectOptions.length === 0) { // if empty or change pipeline
      handleChange("")
    }
  }, [selectOptions]);

  const parseValue = (value: any) => {
    if (!options || options.length === 0) return isMulti ? [] : null;
    if (!value) return isMulti ? [] : null;

    // MULTI
    if (isMulti) {
      if (typeof value === "string") {
        const splitValues = value.split(";").map((v) => v.trim());
        return options.filter((opt: any) =>
          splitValues.includes(opt[optionValue])
        );
      }
      return value;
    }

    // SINGLE
    return options.find((opt: any) => opt[optionValue] === value) || null;
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }: any) =>
        <MSelect
          {...field}
          value={parseValue(field[optionValue])}
          options={options}
          isMulti={isMulti}
          isClearable={isClearable}
          onMenuOpen={apiEndPoint != null ? fetchOptions : null}
          isLoading={apiEndPoint != null ? isLoading : false}
          getOptionLabel={(option) => option[optionlabel]}
          getOptionValue={(option) => option[optionValue]}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              cn(
                "min-h-[44px] flex items-center rounded-md border px-3",
                "bg-white border-gray-300 text-black",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                isFocused && "ring-2 ring-blue-500 border-blue-500"
              ),

            valueContainer: () => "p-1",

            placeholder: () =>
              "text-gray-500 dark:text-gray-300",

            singleValue: () =>
              "text-black dark:text-white",

            indicatorsContainer: () =>
              "text-gray-700 dark:text-gray-300",

            menuPortal: () => "z-[9999]",

            menu: () =>
              cn(
                "mt-1 rounded-md border shadow-lg",
                "bg-white border-gray-200 text-black",      // Light mode
                "dark:bg-gray-600 dark:border-gray-400 dark:text-white" // Dark mode
              ),
            option: ({ isFocused, isSelected }) =>
              cn(
                "cursor-pointer px-3 py-2 rounded-sm",
                isSelected
                  ? "dark:bg-gray-700 text-white"
                  : "hover:bg-gray-200 hover:dark:bg-[#3f4757]",
                // existing logic
                // isFocused && !isSelected && "bg-gray-100 dark:bg-[#3f4757]",
                "text-black dark:text-white"
              ),
            multiValue: () =>
              cn(
                "flex items-center rounded-md px-2 py-0.5 mr-1",
                "bg-gray-200 text-gray-800",                      // Light mode chip
                "dark:bg-gray-600 dark:text-white"          // Dark mode chip
              ),

            multiValueLabel: () =>
              cn(
                "text-sm font-medium"
              ),

            multiValueRemove: () =>
              cn(
                "ml-1 cursor-pointer",
                "text-red-400 hover:text-red-500",               // Light
                "dark:text-gray-200 dark:hover:text-gray-300"      // Dark
              ),
          }}
          onChange={(e: any) => {
            handleChange(e, field);
          }}
        />
      }
    />
  );
};