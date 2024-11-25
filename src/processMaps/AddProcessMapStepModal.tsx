import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Stack, Button } from "@chakra-ui/react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

type AddProcessMapStepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mapId: Id<"processMaps">;
}

export const AddProcessMapStepModal = ({ isOpen, onClose, mapId }: AddProcessMapStepModalProps) => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleOnClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const addProcessMapStep = useMutation(api.processMapSteps.create);
  const handleClick = () => {
    addProcessMapStep({ name, description, mapId });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Process Map Step</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter process map step name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter process map step description"
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
