/* eslint-disable */
import { useDisclosure } from "@chakra-ui/hooks";

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import { IRoute } from "types/navigation";

import logo from "assets/img/logos/monocle.png";
import { MdLock, MdLogin, MdLogout } from "react-icons/md";

import React, { useEffect } from "react";

import { useSession, signIn, signOut } from "next-auth/react"
import LoginModal from "components/login";

/*
  Sidebar component that displays the sidebar.

  Options:
    routes: IRoute[] - array of routes
    open: boolean - whether sidebar is open
    onClose: () => void - function to close sidebar
*/
const Sidebar = (props: {
  routes: IRoute[];
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}) => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { routes, open, onClose } = props;

  const { data: session } = useSession()

  useEffect(() => {}, [session])

  console.log(JSON.stringify(logo))

  function onAuth(event: any): void {
    if (session) {
      signOut()
    } else {
      onLoginOpen()
    }
  }

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[40px] mb-[40px] flex items-center`}>
        <div className="mt-1 ml-1 h-10 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img src={logo['src']} width={64} height={64} alt="logo"/>
          Monoclear.ai
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
        <div 
          className="relative mb-3 flex hover:cursor-pointer"
          onClick={onAuth}>
          <li
            className="my-[3px] flex cursor-pointer items-center px-8"
            key={100}
          >
            <span
              className="font-medium text-gray-600"
            >
              {session ? <MdLogout className="h-6 w-6"/> 
              : <MdLogin className="h-6 w-6"/>
              }
            </span>
            <p className="leading-1 ml-4 flex font-medium text-gray-600">
              {session ? "Logout" : "Login" }
            </p>
          </li>
        </div>
      </ul>
      {/* Nav item end */}

      <LoginModal isLoginOpen={isLoginOpen} onLoginOpen={onLoginOpen} onLoginClose={onLoginClose} />
    </div>
  );
};

export default Sidebar;
