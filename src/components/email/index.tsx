import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import Card from "components/card/index"
import { useSession } from "next-auth/react";
import React from "react";
import { useEffect } from "react";
import BetaModal from "components/beta";

/*
  Modal for Email Subscription.
  Related modal : BetaModal

  Options:
    isEmailOpen : boolean - whether email modal is open
    onEmailOpen : () => void - function to open email modal
    onEmailClose : () => void - function to close email modal
*/
const EmailModal = (props: {
    isEmailOpen : boolean;
    onEmailOpen : () => void; 
    onEmailClose : () => void;
  }) => {
    const { isOpen: isBetaOpen, onOpen: onBetaOpen, onClose: onBetaClose } = useDisclosure()

    const { isEmailOpen, onEmailOpen, onEmailClose } = props;
    
  
    function handleBeta() {
        onBetaOpen()
    }
  
    function handleClose(): void {
        onEmailClose()
    }

    return (
        <>
        {/* Email Modal */}
        <Modal closeOnOverlayClick={true} isOpen={isEmailOpen} onClose={onEmailClose} 
        onCloseComplete={handleClose} isCentered blockScrollOnMount={false}>
          <ModalOverlay className="bg-[#000] !opacity-30" />
          <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
              <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                <h1 className="mb-[20px] text-2xl font-bold">Confirm Subscription</h1>
                <p className="mb-1">
                  You have agreed to receive Monoclear.ai information updates.<br/>
                  Do you also want to receive beta access to the platform?
                </p>
                <div className="mt-3 flex flex-row gap-2">
                  <button
                    onClick={handleBeta} 
                    className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                    YES
                  </button>
                  <button
                    onClick={onEmailClose} 
                    className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                    NO
                  </button>
                </div>
              </Card>
            </ModalBody>
          </ModalContent>
        </Modal>

        <BetaModal isBetaOpen={isBetaOpen} onBetaOpen={onBetaOpen} onBetaClose={onBetaClose} />
        </>
    )
  }

  export default EmailModal;