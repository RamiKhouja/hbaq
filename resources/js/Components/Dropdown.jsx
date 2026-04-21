import { useState, createContext, useContext, Fragment } from 'react';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'py-1 bg-white', children, type }) => {
    const { open, setOpen } = useContext(DropDownContext);
    const { i18n } = useTranslation();

    let alignmentClasses = 'origin-top right-0';

    // if(type && type=== "menu") {
    //     if (i18n.language === 'ar') {
    //         alignmentClasses = 'right-0';
    //     } else {
    //         alignmentClasses = 'left-0';
    //     }
    // } else {
    //     if (i18n.language === 'ar') {
    //         alignmentClasses = 'origin-top-left left-0';
    //     } else {
    //         alignmentClasses = 'origin-top-right right-0';
    //     }
    // }

    let widthClasses = '';
    if(type) {
        if(type === "menu") {
            widthClasses = 'w-56';
        }
        else if(type === "liked") {
            widthClasses = 'w-80';
        }
    } else {
        if (width === '48') {
            widthClasses = 'w-48';
        }
        if (width === '36') {
            widthClasses = 'w-36';
        }
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses}>{children}</div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const { i18n } = useTranslation();
    return (
        <Link
            {...props}
            className={
                ` ${i18n.language==='ar' ? 'text-right' : 'text-left'} block w-full px-4 py-2 leading-5 text-brown-800 hover:bg-brown-100/50 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ${className}`
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
