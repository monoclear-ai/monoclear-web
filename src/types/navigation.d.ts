import { ReactComponentElement } from "react";

/*
  Route interface
  Elements are displayed in the sidebar.
  
  @name: string - display name of the route
  @layout: string - layout path
  @path: string - page path
  @component: ReactComponentElement - component to render
  @icon: ReactComponentElement | string - icon to display
*/
export interface IRoute {
  name: string;
  layout: string;
  component: ReactComponentElement;
  icon: ReactComponentElement | string;
  secondary?: boolean;
  path: string;
}
