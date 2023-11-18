import React from "react";

import { IRoute } from 'types/navigation'
// Admin Imports
import PerfKoDashboard from "pages/admin/perf_kor";
import PerfEnDashboard from "pages/admin/perf_eng";
import SafetyDashboard from "pages/admin/safety";

// Icon Imports
import {
  MdStackedBarChart,
  MdHealthAndSafety
} from "react-icons/md";
import {
  RiMedalFill
} from "react-icons/ri"
import {
  GiTigerHead
} from "react-icons/gi"
import LeaderboardAll from "pages/admin/leaderboard_all";
import LeaderboardHaerae from "pages/admin/leaderboard_haerae";
import "/node_modules/flag-icons/css/flag-icons.min.css";


const routes: IRoute[] = [
  {
    name: "종합 리더보드",
    layout: "/admin",
    path: "/leaderboard_all",
    icon: <RiMedalFill className="h-6 w-6" />,
    component: LeaderboardAll,
  },
  {
    name: "해래 리더보드",
    layout: "/admin",
    path: "/leaderboard_haerae",
    icon: <GiTigerHead className="h-6 w-6" />,
    component: LeaderboardHaerae,
  },
  {
    name: "(베타) 한국어 성능",
    layout: "/admin",
    path: "/perf_kor",
    icon: <span className="fi fi-kr h-6 w-6 items-center" />,
    component: PerfKoDashboard,
  },
  {
    name: "(베타) 영어 성능",
    layout: "/admin",
    path: "/perf_eng",
    icon: <span className="fi fi-us h-6 w-6 items-center" />,
    component: PerfEnDashboard,
  },
  {
    name: "(베타) 안전성",
    layout: "/admin",
    path: "/safety",
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    component: SafetyDashboard,
  },
];
export default routes;
