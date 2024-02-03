"use client";

import { deleteRoom, updateRoom } from "@/actions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ROOMTYPE } from "@prisma/client";
import { EditIcon, MoreVertical, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

export const Actions = ({
  roomId,
  type,
  roomName,
}: {
  roomId: string;
  type: ROOMTYPE;
  roomName: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updatedRoomName, setUpdatedRoomName] = useState(roomName);

  useEffect(() => {
    setUpdatedRoomName(roomName);
  }, [roomName]);

  return (
    <>
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
            onClick={onOpen}
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
      <Modal
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Room
              </ModalHeader>
              <ModalBody>
                <Input
                  value={updatedRoomName}
                  onChange={(e) => setUpdatedRoomName(e.target.value)}
                  label="Name of the Room"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    if (roomName.length < 3) {
                      return toast.error(
                        "Room name must be at least 3 characters long"
                      );
                    }
                    try {
                      await updateRoom(roomId, type, updatedRoomName);
                      toast.success("Room Name updated successfully!");
                    } catch (error) {
                      toast.error("Something went wrong!");
                    } finally {
                      onClose();
                    }
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
