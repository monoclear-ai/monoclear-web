import { useDisclosure } from "@chakra-ui/hooks";
import React, { useEffect } from "react";
import { RiMoonFill, RiOpenaiFill, RiSunFill } from "react-icons/ri";
import {
  AiOutlineEnter,
  AiOutlineMail
} from "react-icons/ai";
import BYOMModal from "components/byom";
import { useSession } from "next-auth/react";
import { EmailSubscriber } from "utils/utils";
import BetaModal from "components/beta";
import EmailModal from "components/email";

// TODO : Refactor modals
const Navbar = (props: {
  onOpenSidenav: () => void;
}) => {
  const { onOpenSidenav } = props;
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure()
  const { data: session, update } = useSession()
  
  useEffect(() => {
    setNavEmail(session?.user?.email ?? "")
  }, [session])

  const [darkmode, setDarkmode] = React.useState(false);

  const [navEmail, setNavEmail] = React.useState("");

  function onEmailSubscribe(event: any): void {
    EmailSubscriber.subscribe(navEmail)
    onEmailOpen()
  }

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <AiOutlineMail className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="이메일 주소"
            value={navEmail}
            onChange={e => setNavEmail(e.target.value)}
            className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
          <p className="pl-3 pr-2 text-xl">
            <AiOutlineEnter className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
        </div>
        <div
          className="cursor-pointer text-gray-600"
          onClick={onEmailSubscribe}
        >
          {darkmode ? (
            <button className="bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
              구독
            </button>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              구독
            </button>
          )}
        </div>

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        <EmailModal isEmailOpen={isEmailOpen} onEmailOpen={onEmailOpen} onEmailClose={onEmailClose}/>
      </div>
    </nav>
  );
};

export default Navbar;
