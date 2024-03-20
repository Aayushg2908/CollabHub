import {
  Code,
  ListTodo,
  Presentation,
  Type,
  MessageCircleMore,
  Video,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { cn } from "@/lib/utils";
import {
  MotionDiv,
  MotionH1,
  MotionP,
  MotionSpan,
} from "@/components/MotionComponent";

export default function Home() {
  const products = [
    {
      name: "Whiteboard",
      icon: Presentation,
      description: "A collaborative whiteboard to draw and share ideas.",
      className: "text-purple-600",
    },
    {
      name: "Text Editor",
      icon: Type,
      description: "A collaborative text editor to write and share ideas.",
      className: "text-blue-600",
    },
    {
      name: "Code Editor",
      icon: Code,
      description: "A collaborative code editor to write and share ideas.",
      className: "text-red-600",
    },
    {
      name: "Todo",
      icon: ListTodo,
      description: "A collaborative todo list to mantain your daily tasks.",
      className: "text-green-600",
    },
    {
      name: "Chat",
      icon: MessageCircleMore,
      description: "A collaborative chat to communicate with your friends.",
      className: "text-yellow-600",
    },
    {
      name: "Call",
      icon: Video,
      description:
        "A collaborative video/audio call to communicate with your friends.",
      className: "text-cyan-500",
    },
  ];

  return (
    <div className="mt-10 w-full flex flex-col items-center gap-y-4 p-10">
      <MotionH1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="font-bold text-3xl sm:text-5xl md:text-6xl text-center"
      >
        Welcome to{" "}
        <MotionSpan
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59]"
        >
          CollabHub
        </MotionSpan>
      </MotionH1>
      <MotionP
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="max-w-3xl text-center text-base sm:text-lg text-gray-400"
      >
        Your one stop solution for all your collaboration needs. We provide you
        with a platform to collaborate with your friends, family and colleagues.
      </MotionP>
      <div className="mt-8 flex flex-col items-center gap-y-4">
        <MotionH1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="font-bold text-2xl sm:text-5xl"
        >
          Products
        </MotionH1>
        <MotionDiv
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {products.map((product, index) => (
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: index * 0.1 }}
              key={index}
            >
              <Card
                isPressable={true}
                isHoverable={true}
                className="w-full md:w-[350px]"
              >
                <CardHeader className={cn("flex gap-x-3", product.className)}>
                  <product.icon className="w-7 h-7" />
                  <h1 className="font-bold text-lg">{product.name}</h1>
                </CardHeader>
                <Divider />
                <CardBody>{product.description}</CardBody>
              </Card>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </div>
  );
}
