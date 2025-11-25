import { useState, useEffect } from 'react'
import { DatePicker } from './DatePicker'
import { formatTimestampIST } from '@/utils/DateTime'
import { FormLabel, Input } from '../Form'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

export const CustomMenu = ({ defaultValue, dateFormat, handleDateSelect }: any) => {
  const [openDatePicker, setOpenDatePicker] = useState(true)

  const handelChangeDate = (date: any) => {
    handleDateSelect(date)
  }
  
  return (
    <div className="mt-2">
      <DatePicker
        defaultValue={defaultValue || ''}
        dateFormat={dateFormat || 'dd-mm-yyyy'}
        setOpenDatePicker={setOpenDatePicker}
        openDatePicker={openDatePicker}
        handelChangeDate={handelChangeDate}
      />
    </div>
  )
}

export const DateMenu = ({
  control = null,
  name = '',
  className,
  type = 'text',
  height = 'medium',
  icon: Icon = '',
  variant = 'normal',
  defaultValue = '',
  dateFormat = 'dd-mm-yyyy',
  isStringValue = true,
  setValue,
  time = true,
  field,
  handleSelect,
  isAssociations,
}: any) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (defaultValue) {
      const formatedDateTime = formatTimestampIST(defaultValue)
      setInputValue({
        label: formatedDateTime?.date,
        value: formatedDateTime?.date,
      })
    }
  }, [defaultValue, time])

  const handleDateSelect = (date: string | null) => {
    handleSelect(date, field)
    setInputValue({ label: date, value: date })
  }

  return (
    <>
      {isAssociations ? (
        <>
          <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
            Select Date
          </FormLabel>
          <Input
            control={control}
            height="small"
            className=""
            placeholder="Select Date"
            value={inputValue ? inputValue.label : ''}
          />
          <CustomMenu
            defaultValue={defaultValue}
            dateFormat={dateFormat}
            handleDateSelect={handleDateSelect}
          />
        </>
      ) : (
        <Menu
          menuButton={
            <Input
              control={control}
              height="small"
              className=""
              placeholder="Select Date"
              value={inputValue ? inputValue.label : ''}
            />
          }
          menuStyle={{ background: "transparent" }}
          portal={false} // Important: keeps menu inside scroll container
          position="anchor" // keeps menu anchored inside scroll area
          viewScroll="auto" // ensures proper scrolling behavior
        >
          <MenuItem
            style={{
              padding: 0,
              margin: 0,
              background: "transparent",
              '--szh-menu-item-hover-bg': 'transparent', // removes internal lib hover color
            }}
          >
            <CustomMenu
              defaultValue={defaultValue}
              dateFormat={dateFormat}
              handleDateSelect={handleDateSelect}
            />
          </MenuItem>
        </Menu>
      )}
    </>
  )
}
