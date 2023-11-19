import TimelyLineGraphs from "views/admin/components/TimelyLineGraphs";
import { useSession } from "next-auth/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/modal";
import Card from "components/card";
import Admin from "layouts/admin";
import CheckTable from "views/admin/components/CheckTable";
import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import BYOMModal from "components/byom";
import { NumberFormatter } from "utils/utils";
import HFModal from "components/hf";
import { GetStaticProps, GetStaticPropsResult, InferGetServerSidePropsType } from "next";
import LoginModal from "components/login";

/*
  SSG (Static Site Generation) for LeaderboardAll page.
  This is an effort to load default leaderboard data before login.

  This function is called during build time.
  The result is passed to the page component as props.

  For development, the leaderboard will be updated every time the page is refreshed.
  For production, the leaderboard will not be updated until the next build.

  Options:
    context: any - context

  Returns:
    public_rank: any - public rank, list of 
    sota_rank: any - sota rank
*/
export const getStaticProps = (async (context) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/public_ranks`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Cache-control': 'no-store'
    }
  })
  const data = await res.json()
  console.log(data)
  const ranks = data?.ranks?.full_kor
  const public_rank = ranks?.public?.ranks
  const sota_rank = ranks?.sota?.ranks
  return {
    props: { public_rank, sota_rank }
  }
}) satisfies GetStaticProps<{public_rank: any, sota_rank: any}>;

/*
  This page displays the leaderboard for all metrics.

  Options:
    public_rank: any - list of public rank items.
    sota_rank: any - list of sota rank items.
 */
export default function LeaderboardAll({
  public_rank, sota_rank
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure()
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure()
  const { isOpen: isBYOMOpen, onOpen: onBYOMOpen, onClose: onBYOMClose } = useDisclosure();
  const { isOpen: isHFOpen, onOpen: onHFOpen, onClose: onHFClose } = useDisclosure();
  const [ publicData, setPublicData ] = useState([])
  const [ sotaData, setSOTAData ] = useState([{
    tag: "Overall",
    values: [
    [new Date('01 Aug 2023').getTime(), 50], 
    [new Date('14 Aug 2023').getTime(), 64], 
    [new Date('01 Sep 2023').getTime(), 48], 
    [new Date('10 Sep 2023').getTime(), 66]
  ]}])
  const [ sotaDetailData, setSOTADetailData ] = useState([])
  const [ lastSOTAData, setLastSOTAData ] = useState([])
  const [ privateData, setPrivateData ] = useState([])
  const [ selIndices, setSelIndices ] = useState(new Set<number>())

  const [ publicRanks, setPublicRanks ] = useState(public_rank)
  const [ sotaRanks, setSotaRanks ] = useState(sota_rank)
  const [ privateRanks, setPrivateRanks ] = useState([])

  const [ sdkKey, setSdkKey ] = useState("")

  function createDetailRanks(ranks: any, flat: boolean) {
    const display_ranks = []
    for (let i = 0; i < ranks?.length ?? 0; i++) {
      const item = ranks[i]
      const tag = item[0]
      const viz_tag = tag.split("__", 2)[1]
      const date = item[1]
      const score = flat ? item[2] : ('full_kor' in item[2] ? item[2]['full_kor'] : null)
      if (score == null) {
        continue
      }

      const displayScore = {
        " ": false,
        "Model": viz_tag,
        "Submitted": new Date(date).toLocaleDateString('en-ZA'),
        // TODO: Fill name
        "User": "Anonymous",
        "Score": NumberFormatter.format(score["alltasks_overall"]),
        "HAE-RAE": NumberFormatter.format(score["haerae_overall"]),
        "KOBEST": NumberFormatter.format(score["kobest_overall"]),
        "KLUE": NumberFormatter.format(score["klue_overall"]),
        "invis: orig_tag" : tag
      }
      display_ranks.push(displayScore)
    }
    return display_ranks
  }

  function createLineRanks(ranks: any, flat: boolean) {
    const display_values = []
    for (let i = 0; i < ranks?.length ?? 0; i++) {
      const item = ranks[i]
      const tag = item[0]
      const viz_tag = tag.split("__", 2)[1]
      const date = item[1]
      const score = flat ? item[2] : ('full_kor' in item[2] ? item[2]['full_kor'] : null)
      if (score == null) {
        continue
      }
      const display_value = [
        new Date(date).getTime(), 
        NumberFormatter.format(score["alltasks_overall"]),
        viz_tag
      ]
      display_values.push(display_value)
    }
    return [{
      tag: "score",
      values: display_values
    }]
  }

  const { data: session, update } = useSession()
  const [token, setToken] = useState((session as any)?.token ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");

  useEffect(() => {
    setToken((session as any)?.token ?? "")
    setEmail(session?.user?.email ?? "")
    setSdkKey((session as any)?.sdk_key ?? "")
    const ranks = (session as any)?.ranks?.full_kor
    if (ranks) {
      setPublicRanks(ranks?.public?.ranks)
      setSotaRanks(ranks?.sota?.ranks)
      setPrivateRanks(ranks?.private?.ranks)
    }
    if (publicRanks) {
      console.log("***********PUBLIC RANKS UPDATE ************")
      console.log(publicRanks)
      const display_public_ranks = createDetailRanks(publicRanks, true)
      setPublicData(display_public_ranks)
      console.log(display_public_ranks)
    }
    if (sotaRanks) {
      console.log("***********SOTA RANKS UPDATE ************")
      console.log(sotaRanks)
      const display_sota_ranks = createLineRanks(sotaRanks, true)
      const display_sota_detail_ranks = createDetailRanks(sotaRanks, true)
      setSOTAData(display_sota_ranks)
      setSOTADetailData(display_sota_detail_ranks)
      const vals = display_sota_ranks[0].values
      setLastSOTAData(vals[vals.length - 1])
    }
    if (privateRanks) {
      console.log("***********PRIVATE RANKS UPDATE ************")
      console.log(privateRanks)
      const display_private_ranks = createDetailRanks(privateRanks, false)
      setPrivateData(display_private_ranks)
    }
  }, [session])

  const eval_details = (session as any)?.eval_details

  const directSubmitOnClick = () => {
    console.log("directSubmitOnClick")
    if (email == "") {
        console.error("Email is empty, trying login.")
        // TODO : Intermediate state - back to saving after login.
        onLoginOpen()
        return
    }
    onUploadOpen()
  }

  const public_columns = ["Submitted", "Model", "User", "Score", "HAE-RAE", "KOBEST", "KLUE"]
  const private_columns = [" ", "Model", "Score", "HAE-RAE", "KOBEST", "KLUE"]

  function submitToPublic(event: any): void {
    const submitTags: any[] = []
    selIndices.forEach((idx: number) => {
      const tag = privateData[idx]["invis: orig_tag"]
      submitTags.push(tag)
    })
    const str_tags = submitTags
    console.log("submitTags = " + str_tags)
    const payload = {
      "new_model_tags" : str_tags
    }

    fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/ranking/full_kor/submit`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Cache-control': 'no-store'
        }
    })
  }

  return (
    <Admin>
      {/* Charts */}
      <div className="mt-5 h-[300px] grid grid-cols-1 gap-5">
        <TimelyLineGraphs title="SOTA Trend" 
        metricData={sotaData} setMetricData={setSOTAData} 
        metricName="Best Score" currentMetric={lastSOTAData} 
        detailData={sotaDetailData}
        detailColumns={public_columns} metricColumns={["score"]} />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 h-[400px] grid grid-cols-1 gap-5">
        <CheckTable title="Current Leaderboard" tableColumns={public_columns} 
        tableData={publicData} directSubmitOnClick={directSubmitOnClick}/>
      </div>

      {/* Upload Modal */}
      <Modal closeOnOverlayClick={true} isOpen={isUploadOpen} onClose={onUploadClose}
      isCentered blockScrollOnMount={false}>
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%]">
          <ModalBody>
            <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
              <h1 className="mb-[20px] text-2xl font-bold">Submit to Leaderboard</h1>
              <p className="mb-[5px]">
                Verify scores before submission.
              </p>
              <p className="mb-[15px]">
                SDK key : {sdkKey}
              </p>
              <div className="flex flex-row w-full items-center justify-evenly">
                <div
                  className="cursor-pointer text-gray-600"
                  onClick={() => {
                    onBYOMOpen()
                  }}
                >
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl">
                    Custom Model API
                  </button>
                </div>
                <div
                    className="cursor-pointer text-gray-600"
                    onClick={() => {
                      onHFOpen()
                    }}
                  >
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl">
                    Huggingface Model
                  </button>
                </div>
              </div>

              <p className="mb-[10px]">
                <div className="my-2 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-2">
                  Select from private models (up to 5)
                </div>
                </div>
              </p>

              <CheckTable title="Submit Model" tableColumns={private_columns} 
              headless={true} tableData={privateData} selIndices={selIndices} 
              setSelIndices={setSelIndices}/>
              <div className="flex flex-col mt-[10px] w-full items-center">
                <div
                  className="cursor-pointer text-gray-600"
                  onClick={submitToPublic}
                >
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl">
                    Submit Model
                  </button>
                </div>
              </div>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>

      <BYOMModal isBYOMOpen={isBYOMOpen} onBYOMOpen={onBYOMOpen} onBYOMClose={onBYOMClose} quick={false} />
      <HFModal isHFOpen={isHFOpen} onHFOpen={onHFOpen} onHFClose={onHFClose} />
      <LoginModal isLoginOpen={isLoginOpen} onLoginOpen={onLoginOpen} onLoginClose={onLoginClose} />
    </Admin>
  );
};