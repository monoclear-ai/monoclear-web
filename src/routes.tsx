import React from "react";

import { IRoute } from 'types/navigation'
// Admin Imports
import PerfKoDashboard from "pages/admin/perf_kor";
import PerfEnDashboard from "pages/admin/perf_eng";
import SafetyDashboard from "pages/admin/safety";

// Icon Imports
import {
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

/*
  Routes for the admin dashboard.
  Each route has a name, path, icon, and component.
  The layout is the admin layout.
*/
const routes: IRoute[] = [
  {
    name: "Overall Leaderboard",
    layout: "/admin",
    path: "/leaderboard_all",
    icon: <RiMedalFill className="h-6 w-6" />,
    component: LeaderboardAll,
  },
  {
    name: "HAERAE Leaderboard",
    layout: "/admin",
    path: "/leaderboard_haerae",
    icon: <GiTigerHead className="h-6 w-6" />,
    component: LeaderboardHaerae,
  },
  {
    name: "(BETA) Korean",
    layout: "/admin",
    path: "/perf_kor",
    icon: <span className="fi fi-kr h-6 w-6 items-center" />,
    component: PerfKoDashboard,
  },
  {
    name: "(BETA) English",
    layout: "/admin",
    path: "/perf_eng",
    icon: <span className="fi fi-us h-6 w-6 items-center" />,
    component: PerfEnDashboard,
  },
  {
    name: "(BETA) Safety",
    layout: "/admin",
    path: "/safety",
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    component: SafetyDashboard,
  },
];
export default routes;
