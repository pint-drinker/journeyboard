import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Stack, Button } from "@chakra-ui/react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

type AddProcessMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProcessMapModal = ({ isOpen, onClose }: AddProcessMapModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleOnClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const addProcessMap = useMutation(api.processMaps.create);
  const handleClick = () => {
    addProcessMap({ name, description });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Process Map</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter process map name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter process map description"
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue"
            onClick={() => {
              handleClick();
              handleOnClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
