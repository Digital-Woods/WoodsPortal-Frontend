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
    setIsOpen(false);
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
      <div className={`${tab === "tab2" ? "block bg-gray-100" : "hidden"} CUSTOM-advance-color-picker`}>
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
  "#000000",
  "#ff0201",
  "#ff9902",
  "#ffff04",
  "#00ff03",
  "#00ffff",
  "#0600ff",
  "#9a00ff",
  "#ff00ff",
  "#ffffff",
  "#f4cccc",
  "#fce5cd",
  "#fff2cc",
  "#d9ead3",
  "#d0e0e3",
  "#cfe2f3",
  "#d9d2e9",
  "#ead1dc",
  "#fafafa",
  "#ea9999",
  "#f9cb9c",
  "#ffe599",
  "#b6d7a8",
  "#a2c4c9",
  "#9fc5e8",
  "#b4a7d6",
  "#d5a6bd",
  "#eeeeee",
  "#e06666",
  "#f6b26b",
  "#ffd966",
  "#93c47d",
  "#76a5af",
  "#6fa8dc",
  "#8e7cc3",
  "#c27ba0",
  "#cccccc",
  "#cc0201",
  "#e69138",
  "#f1c233",
  "#69a84f",
  "#45818e",
  "#3d85c6",
  "#674ea7",
  "#a64d79",
  "#999999",
  "#990100",
  "#b45f06",
  "#bf9002",
  "#37761d",
  "#134f5c",
  "#0c5394",
  "#351c75",
  "#741b47",
  "#666666",
  "#660000",
  "#783f04",
  "#7f6001",
  "#274e13",
  "#0c343d",
  "#073763",
  "#20124d",
  "#4c1130",
];

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-9 gap-2 p-4 ">
        {colors.map((color, index) => (
          <div
            style={{ "backgroundColor": color }}
            key={index}
            className={
              classNames(
                'w-5 h-5 rounded shadow-md cursor-pointer border border-gray-300',
              )
            }
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
      defaultRepresentation: "HEXA",
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
