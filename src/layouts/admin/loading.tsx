import beta from "assets/img/beta/monoclear_beta.jpg";
import Image from "next/image";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <div className="h-full w-full relative">
        
        <img src={beta['src']} 
            alt="Beta page"
        />
    </div>

  }