"use client";

import { upgradeToPro } from "@/actions";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

const ProButton = () => {
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true); 
      const data = await upgradeToPro();
      window.location.href = data.url!;
    } catch (error) {
      toast.error("Something went wrong");
    }finally {
      setLoading(false);
    }
  };
  
  return (
    <Button disabled={loading} onClick={onSubscribe} className="bg-gradient-to-r from-blue-500 to-purple-500">Upgrade To Pro</Button>
  )
}

export default ProButton
