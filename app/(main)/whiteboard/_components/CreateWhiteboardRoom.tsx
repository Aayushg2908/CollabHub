"use client";

import { createTodoRoom } from "@/actions/todo";
import { createWhiteboardRoom } from "@/actions/whiteboard";
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
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const CreateWhiteboardRoom = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <>
      <div
        onClick={onOpen}
        className="border border-dashed hover:bg-neutral-800 transition-all rounded-md w-[150px] h-[130px] flex items-center justify-center cursor-pointer"
      >
        <PlusIcon className="w-10 h-10" />
      </div>
      <Modal
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
                Create Whiteboard Room
              </ModalHeader>
              <ModalBody>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  label="Name of the Room"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  disabled={isLoading}
                  color="primary"
                  onPress={async () => {
                    setIsLoading(true);
                    if (roomName.length < 3) {
                      return toast.error(
                        "Room name must be at least 3 characters long"
                      );
                    }
                    try {
                      const room = await createWhiteboardRoom(roomName);
                      toast.success("Room created successfully!");
                      router.push(`/todo/${room.id}`);
                    } catch (error) {
                      toast.error("Something went wrong!");
                    } finally {
                      setRoomName("");
                      setIsLoading(false);
                      onClose();
                    }
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
