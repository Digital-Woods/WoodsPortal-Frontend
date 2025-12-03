import { useState, useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export const PhoneNumberInput = ({
  panelRef,
  control,
  name,
  defaultValue,
}: any) => {
  // const scrollRef = useRef<HTMLDivElement>(null)
  const scrollRef = panelRef
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [country, setCountry] = useState('us')
  const [value, setValue] = useState('')
  const [dropUp, setDropUp] = useState(false)

  const checkDropdownPosition = () => {
    if (!scrollRef.current || !wrapperRef.current) return

    const container = scrollRef.current
    const input = wrapperRef.current

    const containerRect = container.getBoundingClientRect()
    const inputRect = input.getBoundingClientRect()

    const dropdownHeight = 300 // dropdown approx height

    const spaceBelow =
      containerRect.bottom - inputRect.bottom // space inside scroll container

    setDropUp(spaceBelow < dropdownHeight)
  }

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    checkDropdownPosition()

    scrollContainer.addEventListener('scroll', checkDropdownPosition)
    window.addEventListener('resize', checkDropdownPosition)

    return () => {
      scrollContainer.removeEventListener('scroll', checkDropdownPosition)
      window.removeEventListener('resize', checkDropdownPosition)
    }
  }, [])

  const searchDynamicClassName = "dark:!border-gray-600 dark:!bg-gray-700";
  const dropdownDynamicClassName = "dark:!text-gray-400 dark:!border-gray-600 dark:!bg-gray-700"
  const dropdownPositionDynamicClassName = 'top-auto bottom-full'
  const containerDynamicClassName = "!w-full !relative"
  const inputDynamicClassName = "!w-full !rounded-md !bg-cleanWhite !text-base !transition-colors !border !border-2 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-gray-200 dark:!placeholder-gray-400 !py-2"
  const buttonDynamicClassName = "flag-dropdown-button !border-2 !border-gray-400 rounded-l-md dark:!border-gray-600 dark:!bg-gray-700 dark:hover:!bg-gray-800"

  return (

    <div ref={wrapperRef}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }: any) =>
          <PhoneInput
            {...field}
            country={country}
            value={field.value}
            onFocus={checkDropdownPosition}
            onChange={(val: string, countryData: any) => {
              setValue(val)
              setCountry(countryData?.countryCode || country)
              field.onChange(val);
            }}
            countryCodeEditable={false}
            enableSearch
            searchClass={searchDynamicClassName}
            dropdownClass={`${dropdownDynamicClassName} ${dropUp ? dropdownPositionDynamicClassName : ''}`}
            containerClass={containerDynamicClassName}
            inputClass={inputDynamicClassName}
            buttonClass={buttonDynamicClassName}
          />
        }
      />
    </div>

  )
}
