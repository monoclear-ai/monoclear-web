import Admin from "layouts/admin";
import React, { useEffect } from "react";
import beta from "assets/img/beta/monoclear_beta.jpg";
import BetaModal from "components/beta";
import { useDisclosure } from "@chakra-ui/hooks";
import Image from "next/image";

/*
  Safety Dashboard page.

  Beta signup is enabled by default.
  Review Korean version (PerfKoDashboard) for eventual release.
*/
export default function SafetyDashboard() {
  const { isOpen: isBetaOpen, onOpen: onBetaOpen, onClose: onBetaClose } = useDisclosure({ defaultIsOpen: true});

  return (
    <Admin>
      {/* Card widget */}
      <div className="h-full w-full relative">
        
      <img src={beta['src']} 
          alt="Beta page"
      />
      </div>
      <BetaModal isBetaOpen={isBetaOpen} onBetaOpen={onBetaOpen} onBetaClose={onBetaClose} />
    </Admin>
  );
};