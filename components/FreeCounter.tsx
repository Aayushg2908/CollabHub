"use client";

import { useEffect, useState } from "react";
import { Progress } from "@nextui-org/react";

const MAX_ROOMS = 6;

export const FreeCounter = ({
  roomLimitCount = 0,
  isPro = false,
}: {
  roomLimitCount: number;
  isPro: boolean;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isPro) {
    return null;
  }

  return (
    <div className="px-3 w-[400px]">
      <div className="text-center text-sm text-black mb-4 space-y-2">
        <p className="text-white">
          {roomLimitCount} / {MAX_ROOMS} Free Generations
        </p>
        <Progress className="h-3" value={(roomLimitCount / MAX_ROOMS) * 100} />
      </div>
    </div>
  );
};
