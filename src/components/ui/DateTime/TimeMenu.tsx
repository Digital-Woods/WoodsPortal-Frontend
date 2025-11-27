import { useState, useEffect, useRef } from 'react'
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

const menuDynamicClassName = "!z-200 !bg-transparent";

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
    const timeSelectRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [usePortal, setUsePortal] = useState(false);
    const [inputValue, setInputValue] = useState('')

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

    useEffect(() => {
        const checkSpace = () => {
            if (!timeSelectRef.current) return;

            const triggerRect = timeSelectRef.current.getBoundingClientRect();
            const menuHeight = 350;

            let topBound = 0;
            let bottomBound = window.innerHeight;

            if (panelRef?.current) {
                const panelRect = panelRef.current.getBoundingClientRect();
                topBound = panelRect.top;
                bottomBound = panelRect.bottom;
            }

            const spaceAbove = triggerRect.top - topBound;
            const spaceBelow = bottomBound - triggerRect.bottom;

            const fitsBelow = spaceBelow > menuHeight;
            const fitsAbove = spaceAbove > menuHeight;

            if (fitsBelow) {
                setUsePortal(false);
            } else if (fitsAbove) {
                setUsePortal(false);
            } else {
                setUsePortal(true);
            }
        };

        checkSpace();

        const scrollTarget: any = panelRef?.current || window;
        scrollTarget.addEventListener("scroll", checkSpace, { passive: true });
        window.addEventListener("resize", checkSpace);

        return () => {
            scrollTarget.removeEventListener("scroll", checkSpace);
            window.removeEventListener("resize", checkSpace);
        };
    }, [panelRef]);

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (isMenuOpen) {
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";
        } else {
            html.style.overflow = "";
            body.style.overflow = "";
        }

        return () => {
            html.style.overflow = "";
            body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <div ref={timeSelectRef}>
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
                    onMenuChange={({ open }: any) => setIsMenuOpen(open)}
                    state="open"
                    // align="center"
                    direction="top"
                    position="anchor"
                    viewScroll="auto"
                    anchorRef={panelRef}
                    portal={usePortal}  // ← Dynamic Portal Toggle 🚀
                >
                    <MenuItem>
                        <CustomMenu
                            defaultValue={defaultValue}
                            handleTimeSelect={handleTimeSelect}
                        />
                    </MenuItem>
                </Menu>
            )}
        </div>
    )
}
