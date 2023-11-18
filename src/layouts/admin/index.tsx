import React, { PropsWithChildren, useEffect } from "react";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes";

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any
}

export default function Admin(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    window.document.documentElement.dir = 'ltr'
  })
  return (
    <div className="flex h-full w-full">
      <Sidebar routes={routes} open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              // brandText={getActiveRoute(routes)}
              // secondary={getActiveNavbar(routes)}
              // message={getActiveNavbarText(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              {children}
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
