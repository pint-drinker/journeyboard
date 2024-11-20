import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Link as RouterLink, Skeleton, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { AddEditInsightModal } from "./AddEditInsightModal";

export const InsightsList = () => {
  const insights = useQuery(api.insights.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
  const processMaps = useQuery(api.processMaps.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
  console.log(insights);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInsight, setSelectedInsight] = useState<Doc<"insights"> | null>(null);
  if (!insights || !processMaps) {
    return (
      <Box pt={20}>
        <Skeleton height="100px" mb={4} />
        <Skeleton height="100px" mb={4} />
        <Skeleton height="100px" />
      </Box>
    );
  }

  const processMapMap = new Map<Id<"processMaps">, string>();
  processMaps.forEach((map) => {
    processMapMap.set(map._id, map.name);
  });

  return (
    <>
      <AddEditInsightModal isOpen={isOpen} onClose={onClose} existingInsight={selectedInsight} mode={selectedInsight ? "edit" : "create"} />
      <Box pt={20} mb={1}>
        <Heading mb={6}>Insights</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Process Map</Th>
              <Th>Owner</Th>
              <Th>Title</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {insights.map((insight) => (
              <Tr
                key={insight._id}
                cursor="pointer"
                onClick={() => {
                  setSelectedInsight(insight);
                  onOpen();
                }}
                _hover={{ bg: 'gray.50' }}
              >
                <Td>
                  <Link as={RouterLink} to={`/process-maps/${insight.mapId}`}>
                    {processMapMap.get(insight.mapId)}
                  </Link>
                </Td>
                <Td>{insight.ownerName}</Td>
                <Td>{insight.title}</Td>
                <Td>{insight.content?.split(' ').slice(0, 10).join(' ')}...</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Button
          mb={6}
          colorScheme="blue"
          onClick={onOpen}
        >
          Add Insight
        </Button>
    </>
  );
};
