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
import {
  FaRobot,
} from "react-icons/fa";
import {
  MdOutlineEmail
} from "react-icons/md";
import {
  MdDriveFileRenameOutline
} from "react-icons/md";
import LoginModal from "components/login";
import { AiFillTag } from "react-icons/ai";

/*
  Modal for HuggingFace Model registration.
  Related modal : BYOModal

  Options:
    isHFOpen : boolean - whether HF modal is open
    onHFOpen : () => void - function to open HF modal
    onHFClose : () => void - function to close HF modal
*/
const HFModal = (props: {
    isHFOpen : boolean;
    onHFOpen : () => void; 
    onHFClose : () => void;
  }) => {
    const { data: session, update } = useSession()
    useEffect(() => {
      setName(session?.user?.name ?? "")
      setEmail(session?.user?.email ?? "")
    }, [session])

    const { isHFOpen, onHFOpen, onHFClose } = props;

    const { isOpen: isExecuteOpen, onOpen: onExecuteOpen, onClose: onExecuteClose } = useDisclosure()
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    
    const [tested, setTested] = React.useState(false);
    const [name, setName] = React.useState(session?.user?.name ?? "");
    const [tag, setTag] = React.useState("");
    const [model, setModel] = React.useState("");
    const [email, setEmail] = React.useState(session?.user?.email ?? "");
    const [token, setToken] = React.useState((session as any)?.token ?? "");
  
    const [urlDisabled, setURLDisabled] = React.useState(false);
  
    const [testLog, setTestLog] = React.useState("");
  
  
    function handleSave() {
        const email = session?.user?.email ?? ""
        
        if (email == "") {
            console.error("Email is empty, trying login.")
            // TODO : Intermediate state - back to saving after login.
            onLoginOpen()
            return
        }

        const payload = {
          "tag": tag,
          "hf_path": model
        }

        fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/user/` + email + "/save_hf", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-store'
            }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            update();
            console.log("******Loaded session")
            console.log(session)
            if (data["status"] == "success") {
                setTested(true)
                setTestLog("Success.")
            } else {
                setTestLog("Error: " + data["message"])
                setTested(false)
            }
        })
        .catch(err => {
            console.error(err.message)
            setTestLog(err.message)
            setTested(false)
        });
    }
  
    function handleClose(): void {
        setURLDisabled(false)
        setTested(false)
        onHFClose()
    }

    return (
        <>
        {/* HF Modal */}
        <Modal closeOnOverlayClick={true} isOpen={isHFOpen} onClose={onHFClose} 
        onCloseComplete={handleClose} isCentered blockScrollOnMount={false}>
          <ModalOverlay className="bg-[#000] !opacity-30" />
          <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
              <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                <h1 className="mb-[20px] text-2xl font-bold">(BETA) Register HuggingFace Model</h1>
                <p className="mb-2">
                  Evaluation may require up to a day depending on model size.<br/>
                  If fast evaluation is required, we recommand custom model API.
                </p>
                  
                <div className="font-bold">
                  Model Name
                </div>
                <div className="flex h-[40px] w-[340px] mt-1 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                  <p className="pl-3 pr-2 text-xl">
                    <FaRobot className="h-4 w-4 text-gray-400 dark:text-white" />
                  </p>
                  <input
                    type="text"
                    placeholder="EleutherAI/polyglot-ko-1.3b"
                    value={model}
                    className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setModel(e.target.value)}
                    disabled={urlDisabled}
                  />
                </div>
                <div className="font-bold mt-2">
                  Confirm Email
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                  <p className="pl-3 pr-2 text-xl">
                    <MdOutlineEmail className="h-4 w-4 text-gray-400 dark:text-white" />
                  </p>
                  <input
                    type="text"
                    placeholder="Confirm Email"
                    value={email}
                    className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setModel(e.target.value)}
                    disabled={true}
                  />
                </div>
                <div className="flex h-[40px] mt-2 w-[340px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                  <p className="pl-3 pr-2 text-xl">
                    <MdDriveFileRenameOutline className="h-4 w-4 text-gray-400 dark:text-white" />
                  </p>
                  <input
                    type="text"
                    placeholder="Public Username"
                    value={name}
                    className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="flex h-[40px] w-[340px] mt-2 mb-[10px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                  <p className="pl-3 pr-2 text-xl">
                    <AiFillTag className="h-4 w-4 text-gray-400 dark:text-white" />
                  </p>
                  <input
                    type="text"
                    placeholder="Model Name"
                    value={tag}
                    className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setTag(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-row gap-2">
                  {!tested ? (<button
                    onClick={handleSave} 
                    className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                    OK
                  </button>) : (<button
                    onClick={handleClose}
                    className="linear rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
                  >
                    EXIT
                  </button>
                  )}
                  <div className="gap-1 max-h-12 w-full overflow-y-auto">
                    {testLog}
                  </div>
                </div>
              </Card>
            </ModalBody>
          </ModalContent>
        </Modal>

        <LoginModal isLoginOpen={isLoginOpen} onLoginOpen={onLoginOpen} onLoginClose={onLoginClose} />
        </>
    )
  }

  export default HFModal;