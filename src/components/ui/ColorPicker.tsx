import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import '@simonwep/pickr/dist/themes/nano.min.css';
import Pickr from '@simonwep/pickr';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export const ColorPicker = ({ color, setColor, setIsOpen, defaultTextColor }: any) => {
  const [tab, setTab] = useState("tab1");
  const defaultColor = defaultTextColor;

  const onColorChange = (color: any, open: any) => {
    setColor(color);
    if (!open) setIsOpen(false);
  };
  const resetColor = () => {
    setColor(defaultColor);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/2">
          <button
            className={`${tab == 'tab1' ? 'bg-gray-100' : ''} inline-flex items-center justify-center whitespace-nowrap rounded-tl-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input dark:text-dark-300 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-full py-3`}
            onClick={() => setTab("tab1")}
          >
            Simple
          </button>
        </div>
        <div className="w-1/2">
          <button
            className={`${tab == 'tab2' ? 'bg-gray-100' : ''} inline-flex items-center justify-center whitespace-nowrap rounded-tl-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input dark:text-dark-300 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-full py-3`}
            onClick={() => setTab("tab2")}
          >
            Advance
          </button>
        </div>
      </div>
      <div className={`${tab === "tab1" ? "block bg-gray-100" : "hidden"}`}>
        <GridColorPicker onColorChange={onColorChange} />
      </div>
      <div className={`${tab === "tab2" ? "block bg-gray-100" : "hidden"} advance-color-picker`}>
        <SimonColorPicker onColorChange={onColorChange} defaultColor={defaultColor} />
      </div>
      <div className="flex justify-center bg-gray-100 py-2">
        <Button
          className="!w-full"
          size='sm'
          onClick={resetColor}
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

const GridColorPicker = ({ onColorChange }: any) => {
  const colors = [
    "bg-[#000000]",
    "bg-[#FF0201]",
    "bg-[#FF9902]",
    "bg-[#FFFF04]",
    "bg-[#00FF03]",
    "bg-[#00FFFF]",
    "bg-[#0600FF]",
    "bg-[#9A00FF]",
    "bg-[#FF00FF]",
    "bg-[#FFFFFF]",
    "bg-[#F4CCCC]",
    "bg-[#FCE5CD]",
    "bg-[#FFF2CC]",
    "bg-[#D9EAD3]",
    "bg-[#D0E0E3]",
    "bg-[#CFE2F3]",
    "bg-[#D9D2E9]",
    "bg-[#EAD1DC]",
    "bg-[#FAFAFA]",
    "bg-[#EA9999]",
    "bg-[#F9CB9C]",
    "bg-[#FFE599]",
    "bg-[#B6D7A8]",
    "bg-[#A2C4C9]",
    "bg-[#9FC5E8]",
    "bg-[#B4A7D6]",
    "bg-[#D5A6BD]",
    "bg-[#EEEEEE]",
    "bg-[#E06666]",
    "bg-[#F6B26B]",
    "bg-[#FFD966]",
    "bg-[#93C47D]",
    "bg-[#76A5AF]",
    "bg-[#6FA8DC]",
    "bg-[#8E7CC3]",
    "bg-[#C27BA0]",
    "bg-[#CCCCCC]",
    "bg-[#CC0201]",
    "bg-[#E69138]",
    "bg-[#F1C233]",
    "bg-[#69A84F]",
    "bg-[#45818E]",
    "bg-[#3D85C6]",
    "bg-[#674EA7]",
    "bg-[#A64D79]",
    "bg-[#999999]",
    "bg-[#990100]",
    "bg-[#B45F06]",
    "bg-[#BF9002]",
    "bg-[#37761D]",
    "bg-[#134F5C]",
    "bg-[#0C5394]",
    "bg-[#351C75]",
    "bg-[#741B47]",
    "bg-[#666666]",
    "bg-[#660000]",
    "bg-[#783F04]",
    "bg-[#7F6001]",
    "bg-[#274E13]",
    "bg-[#0C343D]",
    "bg-[#073763]",
    "bg-[#20124D]",
    "bg-[#4C1130]",
  ];
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-9 gap-2 p-4 ">
        {colors.map((color, index) => (
          <div
            key={index}
            className={twMerge(
              classNames(
                'w-5 h-5 rounded shadow-md cursor-pointer border border-gray-300',
                color
              )
            )}
            title={color}
            onClick={() => onColorChange(color, false)}
          ></div>
        ))}
      </div>
    </div>
  );
};

const SimonColorPicker = ({ onColorChange, defaultColor }: any) => {
  const [color, setColor] = useState<any>(defaultColor);
  const pickerRef = React.useRef<any>(null);

  useEffect(() => {
    const pickr = Pickr.create({
      el: pickerRef.current,
      theme: "nano",
      useAsButton: true,
      inline: true,
      width: 100,
      default: color,

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
        },
      },
      defaultRepresentation: "HEX",
      showAlways: true,
    });

    pickr.on("change", (color: any) => {
      const selectedColor = color.toHEXA().toString();
      setColor(selectedColor);
      onColorChange(selectedColor, true);
    });

    return () => pickr.destroy();
  }, []);

  return <div ref={pickerRef}></div>;
};
