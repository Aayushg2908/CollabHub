import { Code, ListTodo, Presentation, Type } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { cn } from "@/lib/utils";

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
  ];

  return (
    <div className="mt-10 w-full flex flex-col items-center gap-y-4 p-10">
      <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl text-center">
        Welcome to{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59]">
          CollabHub
        </span>
      </h1>
      <p className="max-w-3xl text-center text-base sm:text-lg text-gray-400">
        Your one stop solution for all your collaboration needs. We provide you
        with a platform to collaborate with your friends, family and colleagues.
      </p>
      <div className="mt-10 flex flex-col items-center gap-y-4">
        <h1 className="font-bold text-2xl sm:text-5xl">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card className="w-full md:w-[350px]">
              <CardHeader className={cn("flex gap-x-3", product.className)}>
                <product.icon className="w-7 h-7" />
                <h1 className="font-bold text-lg">{product.name}</h1>
              </CardHeader>
              <Divider />
              <CardBody>{product.description}</CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
