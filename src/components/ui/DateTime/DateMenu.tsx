import { useState, useEffect, useRef } from 'react'
import { DatePicker } from './DatePicker'
import { formatTimestampIST } from '@/utils/DateTime'
import { FormLabel, Input } from '../Form'
import {
  ControlledMenu,
  useClick, useMenuState,
  MenuItem
  // Menu as MenuInner,
  // MenuItem as MenuItemInner,
} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

export const CustomMenu = ({ defaultValue, dateFormat, handleDateSelect }: any) => {
  const [openDatePicker, setOpenDatePicker] = useState(true)

  const handelChangeDate = (date: any, state: any) => {
    handleDateSelect(date, state)
  }

  return (
    <div className="py-2">
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

const menuDynamicClassName = "!z-200 !bg-transparent";

const menuItemDynamicClassName = "!list-none !p-0";

// const Menu = (props: any) => <MenuInner {...props} menuClassName={menuDynamicClassName} />;

// const MenuItem = (props: any) => (
//   <MenuItemInner {...props} className={menuItemDynamicClassName} />
// );


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
  panelRef = null
}: any) => {
  const dateSelectRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usePortal, setUsePortal] = useState(false);
  const [inputValue, setInputValue] = useState('')

  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  useEffect(() => {
    if (defaultValue) {
      const formatedDateTime = formatTimestampIST(defaultValue)
      setInputValue({
        label: formatedDateTime?.date,
        value: formatedDateTime?.date,
      })
    }
  }, [defaultValue, time])

  const handleDateSelect = (date: string | null, state: any) => {
    if (state === 'date') toggleMenu(false)
    handleSelect(date, field)
    setInputValue({ label: date, value: date })
  }

  // useEffect(() => {
  //   const checkSpace = () => {
  //     if (!dateSelectRef.current) return;

  //     const triggerRect = dateSelectRef.current.getBoundingClientRect();
  //     const menuHeight = 350; // approximate calendar height

  //     // If we have a scroll container (dialog body), use it as bounds
  //     let topBound = 0;
  //     let bottomBound = window.innerHeight;

  //     if (panelRef?.current) {
  //       const panelRect = panelRef.current.getBoundingClientRect();
  //       topBound = panelRect.top;
  //       bottomBound = panelRect.bottom;
  //     }

  //     const spaceAbove = triggerRect.top - topBound;
  //     const spaceBelow = bottomBound - triggerRect.bottom;
  //     console.log('DateMenu spaceAbove:', spaceAbove, 'spaceBelow:', spaceBelow);

  //     const fitsBelow = spaceBelow > menuHeight;
  //     const fitsAbove = spaceAbove > menuHeight;

  //     // If it fits either above or below inside the container → no portal
  //     const nextPortal = !(fitsAbove || fitsBelow);

  //     setUsePortal(prev => (prev === nextPortal ? prev : nextPortal));
  //   };

  //   // Run once on mount / first open
  //   checkSpace();

  //   const scrollTarget: any = panelRef?.current || window;

  //   const handleScroll = () => checkSpace();
  //   scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
  //   window.addEventListener('resize', checkSpace);

  //   return () => {
  //     scrollTarget.removeEventListener('scroll', handleScroll);
  //     window.removeEventListener('resize', checkSpace);
  //   };
  // }, [panelRef]);

  useEffect(() => {
    const checkSpace = () => {
      if (!dateSelectRef.current) return;

      const triggerRect = dateSelectRef.current.getBoundingClientRect();
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
    <div ref={dateSelectRef}>
      {isAssociations ? (
        <>
          <FormLabel className="text-xs font-semibold text-gray-800 dark:text-gray-300 focus:text-blue-600">
            Select Time
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
        <>
          <div
            ref={ref}
            {...anchorProps}
          >
            <Input
              control={control}
              height="small"
              className=""
              placeholder="Select Time"
              value={inputValue ? inputValue.label : ''}
            />
          </div>
          <ControlledMenu
            {...menuState}
            anchorRef={ref}
            onClose={() => toggleMenu(false)}
            boundingBoxRef={panelRef}
            onMenuChange={({ open }: any) => setIsMenuOpen(open)}
            // align="center"
            direction="top"
            position="anchor"
            viewScroll="auto"
            portal={usePortal}  // ← Dynamic Portal Toggle 🚀
            menuClassName={menuDynamicClassName}
          >
            <MenuItem className={menuItemDynamicClassName} onClick={(e: any) => e.keepOpen = true}>
              <CustomMenu
                defaultValue={defaultValue}
                handleDateSelect={handleDateSelect}
              />
            </MenuItem>
          </ControlledMenu>

          {/* <Menu
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
              handleDateSelect={handleDateSelect}
            />
          </MenuItem>
        </Menu> */}
        </>
      )}
    </div>
  )
}
