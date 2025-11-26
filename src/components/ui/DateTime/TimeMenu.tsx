import { useState, useEffect } from 'react'
import { TimePicker } from './TimePicker'
import { formatTimestampIST } from '@/utils/DateTime'
import { FormLabel, Input } from '../Form'
import {
    Menu as MenuInner,
    MenuItem as MenuItemInner,
} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

export const CustomMenu = ({ defaultValue, handleTimeSelect }: any) => {
    const [openTimePicker, setOpenTimePicker] = useState(true)

    const handelChangeTime = (time: any) => {
        handleTimeSelect(time)
    }

    return (
        <div className="py-2">
            <TimePicker
                defaultValue={defaultValue || ''}
                setOpenTimePicker={setOpenTimePicker}
                openTimePicker={openTimePicker}
                handelChangeTime={handelChangeTime}
            />
        </div>
    )
}

const menuDynamicClassName = "!z-50 !bg-transparent";

const menuItemDynamicClassName = "!list-none !p-0";

const Menu = (props: any) => <MenuInner {...props} menuClassName={menuDynamicClassName} />;

const MenuItem = (props: any) => (
    <MenuItemInner {...props} className={menuItemDynamicClassName} />
);

export const TimeMenu = ({
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
    panelRef = null
}: any) => {
    const [inputValue, setInputValue] = useState('')
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    useEffect(() => {
        if (defaultValue) {
            const formatedDateTime = formatTimestampIST(defaultValue)
            setInputValue({
                label: formatedDateTime?.time,
                value: formatedDateTime?.time,
            })
        }
    }, [defaultValue, time])

    const handleTimeSelect = (time: any) => {
        const newTime = `${time?.time} ${time?.timeZone}`
        handleSelect(time, field)
        setInputValue({ label: newTime, value: newTime })
    }

    return (
        <>
            {isAssociations ? (
                <>
                    <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
                        Select Time
                    </FormLabel>

                    <Input
                        control={control}
                        height="small"
                        className=""
                        placeholder="Select Time"
                        value={inputValue ? inputValue.label : ''}
                    />
                    <CustomMenu
                        defaultValue={defaultValue}
                        handleTimeSelect={handleTimeSelect}
                    />
                </>
            ) : (
                <Menu
                    boundingBoxRef={panelRef}
                    menuButton={
                        <Input
                            control={control}
                            height="small"
                            className=""
                            placeholder="Select Time"
                            value={inputValue ? inputValue.label : ''}
                        />
                    }
                    // menuStyle={{ background: "transparent" }}
                    portal={false} // Important: keeps menu inside scroll container
                    position="anchor" // keeps menu anchored inside scroll area
                    viewScroll="auto" // ensures proper scrolling behavior
                >
                    <MenuItem
                    // style={{
                    //     padding: 0,
                    //     margin: 0,
                    //     background: "transparent",
                    //     '--szh-menu-item-hover-bg': 'transparent', // removes internal lib hover color
                    // }}
                    >
                        <CustomMenu
                            defaultValue={defaultValue}
                            handleTimeSelect={handleTimeSelect}
                        />
                    </MenuItem>
                </Menu>
            )}
        </>
    )
}
