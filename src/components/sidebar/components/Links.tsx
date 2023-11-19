/* eslint-disable */
import React from "react";
import DashIcon from "components/icons/DashIcon";

import { useRouter } from 'next/router'
import Link from "next/link";
import { IRoute } from "types/navigation";
// chakra imports

/*
  Routes and Links for the sidebar.

  Options:
    routes: IRoute[] - array of routes
*/
export const SidebarLinks = (props: { routes: IRoute[] }) => {
  // Chakra color mode
  const router = useRouter();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return router.pathname.includes(routeName);
  };

  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth"
      ) {
        const linkpath = route.layout + route.path
        return (
          <Link key={index} href={`${linkpath}`}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li
                  className="my-[3px] flex cursor-pointer items-center px-8"
                  key={index}
                >
                  <span
                    className={`${
                      activeRoute(route.path) === true
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${
                      activeRoute(route.path) === true
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
          </Link>
        );
      }
    });
  };
  // BRAND
  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;
