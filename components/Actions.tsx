"use client";

import { deleteRoom } from "@/actions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ROOMTYPE } from "@prisma/client";
import { EditIcon, MoreVertical, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

export const Actions = ({
  roomId,
  type,
}: {
  roomId: string;
  type: ROOMTYPE;
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <MoreVertical
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-1.5 right-1 w-5 h-5 cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          startContent={<EditIcon className="w-5 h-5" />}
          key="edit"
        >
          Edit Name
        </DropdownItem>
        <DropdownItem
          startContent={<Trash2Icon className="w-5 h-5" />}
          key="delete"
          className="text-danger"
          color="danger"
          onClick={async () => {
            await deleteRoom(roomId, type);
            toast.success("Room deleted successfully");
          }}
        >
          Delete Room
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
