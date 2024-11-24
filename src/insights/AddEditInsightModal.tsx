import { useState, useEffect } from "react"; 
import { Doc } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Select,Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, VStack, Button } from "@chakra-ui/react";

type AddEditInsightModalProps = {
  isOpen: boolean;
  onClose: () => void;
  existingInsight?: Doc<"insights"> | null;
  mode: "create" | "edit";
}

export const AddEditInsightModal = ({ isOpen, onClose, existingInsight, mode }: AddEditInsightModalProps) => {
  const [selectedMapId, setSelectedMapId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (existingInsight) {
      setSelectedMapId(existingInsight.mapId);
      setOwnerName(existingInsight.ownerName);
      setTitle(existingInsight.title);
      setContent(existingInsight.content || "");
    } else {
      setSelectedMapId("");
      setOwnerName("");
      setTitle("");
      setContent("");
    }
  }, [existingInsight]);

  const processMaps = useQuery(api.processMaps.list);
  const createInsight = useMutation(api.insights.create);
  const editInsight = useMutation(api.insights.edit);

  const handleSubmit = async () => {
    if (!selectedMapId || !ownerName || !title) return;
    if (mode === "create") {
      await createInsight({
        mapId: selectedMapId,
        ownerName,
        title,
        content,
      });
    } else if (existingInsight) {
      await editInsight({
        insightId: existingInsight._id,
        mapId: selectedMapId,
        ownerName,
        title,
        content
      });
    }

    onClose();
    setSelectedMapId("");
    setOwnerName("");
    setTitle("");
    setContent("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === "create" ? "Add New Insight" : "Edit Insight"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Process Map</FormLabel>
              <Select
                placeholder="Select process map"
                value={selectedMapId}
                onChange={(e) => setSelectedMapId(e.target.value)}
              >
                {processMaps?.map((map) => (
                  <option key={map._id} value={map._id}>
                    {map.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Owner Name</FormLabel>
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter insight title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter insight description"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {mode === "create" ? "Create Insight" : "Save Insight"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
