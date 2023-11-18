import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import Card from "components/card/index"
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { signIn, signOut } from "next-auth/react"

const LoginModal = (props: {
    isLoginOpen : boolean;
    onLoginOpen : () => void; 
    onLoginClose : () => void;
  }) => {
    const { isLoginOpen, onLoginOpen, onLoginClose } = props;

    const [email, setEmail] = React.useState("");

    function handleEmailInput(event: any): void {
      const text = event.target.value;
      setEmail(text);
    }
  
    function handleMagicLink() {
      signIn("email", { email: email })
    }
  
    function handleGoogleLogin(event: any): void {
      signIn("google")
    }

    return (
    <Modal closeOnOverlayClick={true} isOpen={isLoginOpen} onClose={onLoginClose}
    isCentered blockScrollOnMount={false}>
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
                <Card extra={"px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]"}>
                <h1 className="mb-[20px] mt-[20px] mx-[20px] text-2xl font-bold">로그인</h1>
                <p className="flex flex-col mb-[0px] w-full items-center">
                    <div className="flex h-[40px] w-[340px] mt-[5px] justify-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                        <p className="pl-3 pr-2 text-l">
                            <button
                                className="px-4 py-2 border w-[190px] flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                                onClick={handleGoogleLogin}>
                                <FcGoogle className="w-6 h-6 mr-[10px]"/>
                                <span>Google 로그인</span>
                            </button>
                        </p>
                    </div>
                </p>
                <p className="mb-[20px]">
                    <div className="my-2 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-2">
                        이메일 로그인
                    </div>
                    </div>
                </p>

                <p className="flex flex-col items-center mb-[15px]">
                    <div className="flex h-[40px] w-[340px] mb-[10px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                        <AiOutlineMail className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="이메일"
                        className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                        onChange={handleEmailInput}
                    />
                    </div>
                </p>

                <div className="flex flex-col mb-[20px] items-center gap-2">
                    <button
                        onClick={handleMagicLink} 
                        className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                        매직 링크
                    </button>
                </div>
                </Card>
            </ModalBody>
        </ModalContent>
    </Modal>
    );
  }

  export default LoginModal;