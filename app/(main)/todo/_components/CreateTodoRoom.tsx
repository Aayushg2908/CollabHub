import { PlusIcon } from "lucide-react";

export const CreateTodoRoom = () => {
  return (
    <div className="border border-dashed hover:bg-neutral-800 transition-all rounded-md w-[150px] h-[130px] flex items-center justify-center cursor-pointer">
      <PlusIcon className="w-10 h-10" />
    </div>
  );
};
