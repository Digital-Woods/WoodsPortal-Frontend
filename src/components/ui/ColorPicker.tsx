import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import '@simonwep/pickr/dist/themes/nano.min.css';
import Pickr from '@simonwep/pickr';

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
    "#000000",
    "#FF0201",
    "#FF9902",
    "#FFFF04",
    "#00FF03",
    "#00FFFF",
    "#0600FF",
    "#9A00FF",
    "#FF00FF",
    "#FFFFFF",
    "#F4CCCC",
    "#FCE5CD",
    "#FFF2CC",
    "#D9EAD3",
    "#D0E0E3",
    "#CFE2F3",
    "#D9D2E9",
    "#EAD1DC",
    "#FAFAFA",
    "#EA9999",
    "#F9CB9C",
    "#FFE599",
    "#B6D7A8",
    "#A2C4C9",
    "#9FC5E8",
    "#B4A7D6",
    "#D5A6BD",
    "#EEEEEE",
    "#E06666",
    "#F6B26B",
    "#FFD966",
    "#93C47D",
    "#76A5AF",
    "#6FA8DC",
    "#8E7CC3",
    "#C27BA0",
    "#CCCCCC",
    "#CC0201",
    "#E69138",
    "#F1C233",
    "#69A84F",
    "#45818E",
    "#3D85C6",
    "#674EA7",
    "#A64D79",
    "#999999",
    "#990100",
    "#B45F06",
    "#BF9002",
    "#37761D",
    "#134F5C",
    "#0C5394",
    "#351C75",
    "#741B47",
    "#666666",
    "#660000",
    "#783F04",
    "#7F6001",
    "#274E13",
    "#0C343D",
    "#073763",
    "#20124D",
    "#4C1130",
  ];
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-9 gap-2 p-4 ">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded shadow-md cursor-pointer border border-gray-300 bg-[${color}]`}
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
