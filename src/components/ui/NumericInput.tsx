import React, { useRef, useState, useLayoutEffect } from "react";

interface NumericInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  ref?: any;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value: outerValue = "",
  onChange,
  maxLength = 20,
  placeholder,
  className,
  ref
}) => {
  const [value, setValue] = useState<string>(outerValue);
  const inputRef = ref;
  const composing = useRef(false);
  const caretPos = useRef<number | null>(null);

  // sync value from parent
  React.useEffect(() => {
    if (outerValue !== value) {
      setValue(outerValue);
    }
  }, [outerValue]);

  // restore caret position
  useLayoutEffect(() => {
    if (caretPos.current !== null && inputRef.current) {
      const pos = Math.min(caretPos.current, inputRef.current.value.length);
      inputRef.current.setSelectionRange(pos, pos);
      caretPos.current = null;
    }
  }, [value]);

  const sanitize = (v: string) => v.replace(/\D+/g, "").slice(0, maxLength);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (composing.current) return;

    const el = e.target;
    const start = el.selectionStart ?? 0;
    const oldLen = el.value.length;

    const cleaned = sanitize(el.value);
    const newLen = cleaned.length;

    // caret position fix
    const delta = oldLen - newLen;
    const newPos = Math.max(0, start - Math.max(0, delta));
    caretPos.current = newPos;

    setValue(cleaned);
    onChange?.(cleaned);
  };

  const handleCompositionStart = () => {
    composing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    composing.current = false;
    const cleaned = sanitize(e.currentTarget.value);
    const pos = e.currentTarget.selectionStart ?? cleaned.length;

    caretPos.current = Math.min(pos, cleaned.length);
    setValue(cleaned);
    onChange?.(cleaned);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text");
    const filtered = sanitize(paste);

    const el = inputRef.current!;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    const before = value.slice(0, start);
    const after = value.slice(end);

    const newVal = (before + filtered + after).slice(0, maxLength);
    const newPos = before.length + filtered.length;

    caretPos.current = newPos;
    setValue(newVal);
    onChange?.(newVal);
  };

  return (
    <input
      ref={ref}
      type="text"                 // IMPORTANT — Safari-friendly
      inputMode="numeric"         // mobile numeric keypad
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onPaste={handlePaste}
      maxLength={maxLength}
      placeholder={placeholder}
      className={className}
    />
  );
};
