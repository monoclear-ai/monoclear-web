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
import LoginModal from "components/login";
import { EmailSubscriber } from "utils/utils";


const BetaModal = (props: {
    isBetaOpen : boolean;
    onBetaOpen : () => void; 
    onBetaClose : () => void;
  }) => {
    const { data: session, update } = useSession()
    useEffect(() => {
      setName(session?.user?.name ?? "")
      setEmail(session?.user?.email ?? "")
    }, [session])

    const { isBetaOpen, onBetaOpen, onBetaClose } = props;

    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    
    const [tested, setTested] = React.useState(false);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState(session?.user?.email ?? "");
    const [upload, setUpload] = React.useState("없음")
    const [org, setOrg] = React.useState("")
    const [feature, setFeature] = React.useState("")

  
    const [testLog, setTestLog] = React.useState("");
  
  
    function handleSave() {
        const payload = {
          "email": email,
          "name": name,
          "org": org,
          "upload": upload,
          "feature": feature
        }

        fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/beta/signup`, {
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
                EmailSubscriber.subscribe(email)
                setTested(true)
                setTestLog("성공하였습니다.")
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
        setTested(false)
        onBetaClose()
    }

    return (
        <>
        {/* Beta Modal */}
        <Modal closeOnOverlayClick={true} isOpen={isBetaOpen} onClose={onBetaClose} 
        onCloseComplete={handleClose} isCentered blockScrollOnMount={false}>
          <ModalOverlay className="bg-[#000] !opacity-30" />
          <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
            <ModalBody>
              <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                <h1 className="mb-[20px] text-2xl font-bold">베타 접속 요청</h1>
                <p className="mb-1">
                  모노클리어.ai 는 LM과 챗봇의 성능을 관리하고 변화를 추적할 수 있는 플랫폼입니다.<br/>
                  아래 정보를 입력 주시면, 곧 있을 베타 오픈시에 모노클리어.ai의 접속 권한을 순차적으로 제공할 예정입니다.
                </p>
                <div className="mt-2 font-bold">
                이메일 (필수)
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <input
                    type="text"
                    placeholder=""
                    value={email}
                    className="block h-full w-full pl-3 -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setEmail(e.target.value)}
                />
                </div>
                <div className="mt-2 font-bold">
                이름
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <input
                    type="text"
                    placeholder=""
                    value={name}
                    className="block h-full w-full pl-3 -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setName(e.target.value)}
                />
                </div>
                <div className="mt-2 font-bold">
                소속
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <input
                    type="text"
                    placeholder=""
                    value={org}
                    className="block h-full w-full pl-3 -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setOrg(e.target.value)}
                />
                </div>
                <div className="mt-2 font-bold">
                모델 업로드 여부 (우선권을 드립니다.)
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <input
                    type="text"
                    placeholder=""
                    value={upload}
                    className="block h-full w-full pl-3 -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setUpload(e.target.value)}
                />
                </div>
                <div className="mt-2 font-bold">
                모델 종류 및 테스트 할 기능 설명
                </div>
                <div className="flex h-[40px] w-[340px] mt-[8px] items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                <input
                    type="text"
                    placeholder=""
                    value={feature}
                    className="block h-full w-full pl-3 -mr-5 rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                    onChange={e => setFeature(e.target.value)}
                />
                </div>
                
                <div className="mt-3 flex flex-row gap-2">
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

  export default BetaModal;