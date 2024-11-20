import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Table, Thead, Tbody, Tr, Th, Td, Button, Link as RouterLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Doc } from "../../convex/_generated/dataModel";

type AnnotationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  annotations: Doc<"annotations">[];
  insights: Doc<"insights">[];
}

export const AnnotationsModal = ({ isOpen, onClose, annotations, insights }: AnnotationsModalProps) => {
  // Create a map of insight IDs to insights for quick lookup
  const insightMap = new Map();
  insights?.forEach((insight) => {
    insightMap.set(insight._id, insight);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>Annotations</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Content</Th>
                <Th>Sentiment</Th>
                <Th>Original Insight</Th>
              </Tr>
            </Thead>
            <Tbody>
              {annotations?.map((annotation) => {
                const insight = insightMap.get(annotation.insightId);
                return (
                  <Tr key={annotation._id}>
                    <Td>{annotation.content}</Td>
                    <Td>{annotation.positiveSentiment ? "Positive" : "Negative"}</Td>
                    <Td>
                      <Link as={RouterLink} to={`/insights/${annotation.insightId}`} color="blue.500">
                        {insight?.title || "Unknown Insight"}
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
