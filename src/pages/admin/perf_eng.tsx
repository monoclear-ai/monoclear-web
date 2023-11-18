import Admin from "layouts/admin";
import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import beta from "assets/img/beta/monoclear_beta.jpg";
import BetaModal from "components/beta";
import Image from "next/image";

export default function PerfEnDashboard() {
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