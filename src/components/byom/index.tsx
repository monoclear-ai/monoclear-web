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
  TbWorldCode,
} from "react-icons/tb";
import {
  MdOutlineEmail
} from "react-icons/md";
import {
  AiFillTag
} from "react-icons/ai";
import {
  MdDriveFileRenameOutline
} from "react-icons/md";
import LoginModal from "components/login";

/*
  Modal to register your own model API for private / public leaderboard upload.
*/
const BYOMModal = (props: {
    isBYOMOpen : boolean;
    onBYOMOpen : () => void; 
    onBYOMClose : () => void;
    quick: boolean;
  }) => {
    const { data: session, update } = useSession()
    useEffect(() => {
      setName(session?.user?.name ?? "")
      setEmail(session?.user?.email ?? "")
      setToken((session as any)?.token ?? "")
    }, [session])

    const { isBYOMOpen, onBYOMOpen, onBYOMClose, quick } = props;

    const { isOpen: isExecuteOpen, onOpen: onExecuteOpen, onClose: onExecuteClose } = useDisclosure()
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    
    const apiDefault = "https://api.openai.com/v1/chat/completions"

    const [tested, setTested] = React.useState(false);
    const [api, setApi] = React.useState(apiDefault);
    const [tag, setTag] = React.useState("");
    const [name, setName] = React.useState(session?.user?.name ?? "");
    const [email, setEmail] = React.useState(session?.user?.email ?? "");
    const [token, setToken] = React.useState((session as any)?.token ?? "");
  
    const headDefault = '{\n"Content-Type": "application/json", \n"Authorization": "Bearer <API-KEY>"\n}'
    const bodyDefault = '{\n"model": "gpt-3.5-turbo", \n "messages": <MESSAGES>, \n"temperature": 0.0\n}'
  
    const [urlDisabled, setURLDisabled] = React.useState(false);
    const [headDisabled, setHeadDisabled] = React.useState(false);
    const [bodyDisabled, setBodyDisabled] = React.useState(false);
  
    const [head, setHead] = React.useState(headDefault);
    const [body, setBody] = React.useState(bodyDefault);
  
    const [testLog, setTestLog] = React.useState("POST request will be executed, reponse should have a 'choices' field at top.");
  
  
    function handleSave() {
        const email = session?.user?.email ?? ""
        
        if (email == "") {
            console.error("Email is empty, trying login.")
            // TODO : Intermediate state - back to saving after login.
            onLoginOpen()
            return
        }
        
        const replaced = body.replace("<MESSAGES>", "[{\"role\":\"user\", \"content\":\"Say this is a test.\"}]")
        try {
            JSON.parse(head)
            JSON.parse(replaced)
        } catch (e) {
            console.error(e)
            setTestLog(e.toString())
        }
        const payload = {
            "tag": tag,
            "endpoint": api,
            "head": JSON.stringify(JSON.parse(head)),
            "body": body, // JSON check is only done with replacements.
        }

        fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/user/` + email + "/save_model_full", {
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
                onExecuteOpen();
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

    // TODO: Why not do a client side call for security? 
    // Two options:
    // 1. Auto validation in client & storing validation result.
    // 2. Manual validation in server.
    // There's risk of changing the API in server anyway. Maybe a mix of both?
    // Another aspect, is what's the risk? If the API is not valid or payload is too big, it will just fail.
    function handleTest() {
      const replaced = body.replace("<MESSAGES>", "[{\"role\":\"user\", \"content\":\"Say this is a test.\"}]")
      try {
        JSON.parse(head)
        JSON.parse(replaced)
      } catch (e) {
        console.error(e)
        setTestLog(e.toString())
      }
      const payload = {
        "tag": tag,
        // Dummy eval key
        "endpoint": api,
        "head": JSON.stringify(JSON.parse(head)),
        "body": JSON.stringify(JSON.parse(replaced)),
      }
  
      fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/test_model_full`, {
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
        setTestLog("Response : " + data["response"]["choices"][0]["message"]["content"])
        setHeadDisabled(true)
        setBodyDisabled(true)
        setURLDisabled(true)
        setTested(true)
      })
      .catch(err => {
        console.error(err.message)
        setTestLog(err.message)
        setTested(false)
      });
    }

    function handleAsyncEval() {
      const task_url = quick ? "/kor_quick_eval/" : "/kor_full_eval/"
      fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/user/` + email + task_url + tag, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-control': 'no-store'
        }
      })
      .then(response => response.json())
      .then((data) => {
        console.log(data)
        onBYOMClose();
        onExecuteClose();
      })
      .catch(err => {
        console.error(err.message)
        setTestLog(err.message)
        setTested(false)
      });
    }
  
    function handleExecute(event: any): void {
      handleAsyncEval();
    }

    function handleClose(): void {
        setHeadDisabled(false)
        setBodyDisabled(false)
        setURLDisabled(false)
        setTested(false)
    }

    return (
        <>
        {/* BYOM Modal */}
        <Modal closeOnOverlayClick={true} isOpen={isBYOMOpen} onClose={onBYOMClose} 
        onCloseComplete={handleClose} isCentered blockScrollOnMount={false}>
          <ModalOverlay className="bg-[#000] !opacity-30" />
          <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
              <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                <h1 className="mb-[20px] text-2xl font-bold">Register Model</h1>
                <p className="mb-[10px]">
                  Provided LLM API is only used to test the model. 
                  <p>
                  Choices field in <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" 
                  href="https://platform.openai.com/docs/api-reference/making-requests">OpenAI API</a> is used. <br/>
                  If in other format, please contact <a href="mailto:****@website.com">****@website.com</a>
                  </p>

                  <div className="mt-[8px] font-bold">
                    Endpoint URL
                  </div>
                  <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                      <TbWorldCode className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                      type="text"
                      placeholder={apiDefault}
                      value={api}
                      className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                      onChange={e => setApi(e.target.value)}
                      disabled={urlDisabled}
                    />
                  </div>
                  <div>
                    <>
                      <div className="mt-[8px] font-bold">
                        Header
                      </div>
                      <div className="flex h-[80px] w-[340px] mt-[5px] items-center rounded-2xl bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white">
                        <textarea
                          value={head}
                          placeholder={headDefault}
                          className="block h-full w-full resize-none pl-3 pt-3 pb-3 -mr-5 bg-lightPrimary rounded-2xl text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                          onChange={e => setHead(e.target.value)}
                          rows={2}
                          cols={40}
                          disabled={headDisabled} />
                      </div>
                      <div className="mt-[10px] font-bold">
                        Body
                      </div>
                      <div>
                        Find <u>&lt;MESSAGES&gt;</u> field and replace with <br/><u>&#91;&#123;"role":"user", "content":" ...&#125;", ...&#93;</u>.
                      </div>
                      <div className="flex h-[160px] w-[340px] mt-[5px] items-center rounded-2xl bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white">
                        <textarea
                          value={body}
                          placeholder={bodyDefault}
                          className="block h-full w-full resize-none pl-3 pt-3 pb-3 -mr-5 bg-lightPrimary rounded-2xl text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                          onChange={e => setBody(e.target.value)}
                          rows={4}
                          cols={40}
                          disabled={bodyDisabled} />
                      </div>
                    </>
                  </div>
                </p>
                <div className="flex h-[40px] w-[340px] mb-[10px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
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
                    onClick={handleTest} 
                    className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                    Test
                  </button>) : (<button
                    onClick={handleSave}
                    className="linear rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
                  >
                    OK
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
        
        {/* Execute Modal */}
        <Modal closeOnOverlayClick={true} isOpen={isExecuteOpen} onClose={onExecuteClose}
        isCentered blockScrollOnMount={false}>
          <ModalOverlay className="bg-[#000] !opacity-30" />
          <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
              <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                <h1 className="mb-[20px] text-2xl font-bold">Execute Test</h1>
                <p className="mb-4">
                  You may be charged if you are not using your own API.<br/>
                  We will send you an email after completion of the test (est. 2 hours).
                  </p>
                  <div className="flex h-[40px] w-[340px] mb-3 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
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
                  <div className="flex h-[40px] w-[340px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                    <p className="pl-3 pr-2 text-xl">
                      <MdOutlineEmail className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                      type="text"
                      placeholder="Verify Email"
                      value={email}
                      className="block h-full w-full -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                      onChange={e => setEmail(e.target.value)}
                      disabled={true}
                    />
                  </div>
                <div className="flex flex-row mt-3 gap-2">
                  <button
                    onClick={handleExecute} 
                    className="linear text-navy-700 rounded-xl border-2 border-gray-100 bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30">
                    OK
                  </button>
                </div>
              </Card>
            </ModalBody>
          </ModalContent>
        </Modal>

        <LoginModal isLoginOpen={isLoginOpen} onLoginOpen={onLoginOpen} onLoginClose={onLoginClose} />
        </>
    )
  }

  export default BYOMModal;