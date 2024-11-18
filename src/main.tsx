import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ConvexProvider, ConvexReactClient, useAction, useMutation } from "convex/react";
import type { Doc, Id } from "./../convex/_generated/dataModel";
import { ChakraProvider, extendTheme, Tbody, Th, Tr, Table, Thead, useDisclosure, Td, ButtonGroup } from "@chakra-ui/react";
import { Box, Flex, Text, Heading, Stack, Skeleton, Button, Link as RouterLink, Card, CardBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, VStack, Select } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useParams,
  Outlet
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { analyzeWithOpenAI } from "./openai";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const theme = extendTheme({});


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const NavBar = () => (
  <>
    <Box position="fixed" top={0} width="100%" bg="white" boxShadow="sm" zIndex={1}>
      <Flex maxW="container.lg" p={4} align="center">
        <Text fontSize="xl" fontWeight="bold" mr={8}>JourneyBoard</Text>
        <Link as={RouterLink} to="/process-maps" mr={4}>
          <Button variant="ghost">Process Maps</Button>
        </Link>
        <Link as={RouterLink} to="/insights">
          <Button variant="ghost">Insights</Button>
        </Link>
      </Flex>
    </Box>
    <Box mx="auto" p={4}>
      <Outlet />
    </Box>
  </>
);

interface AddProcessMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProcessMapModal = ({ isOpen, onClose }: AddProcessMapModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleOnClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const addProcessMap = useMutation(api.processMaps.create);
  const handleClick = () => {
    addProcessMap({ name, description, groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
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

const ProcessMapsList = () => {
  const processMaps = useConvexQuery(api.processMaps.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!processMaps) {
    return (
      <Box pt={20}>
        <Skeleton height="60px" mb={4} />
        <Skeleton height="60px" mb={4} />
        <Skeleton height="60px" />
      </Box>
    );
  }

  return (
    <>
    <AddProcessMapModal isOpen={isOpen} onClose={onClose} />
    <Box pt={20}>
      <Heading mb={6}>Process Maps</Heading>
      <Stack spacing={4} gap={1} mb={1}>
        {processMaps.map((map) => (
          <Link key={map._id} as={RouterLink} to={`/process-maps/${map._id}`}>
            <Button 
              width="100%" 
              p={4} 
              bg="white" 
              rounded="md" 
              shadow="sm"
              justifyContent="flex-start"
              _hover={{ bg: 'gray.50' }}
            >
              <Text>{map.name}</Text>
            </Button>
          </Link>
        ))}
      </Stack>
      <Button
        mb={6}
        colorScheme="blue"
        onClick={onOpen}
      >
        Add Process Map
      </Button>
    </Box>
    </>
  );
};

type AddProcessMapStepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mapId: Id<"processMaps">;
}

const AddProcessMapStepModal = ({ isOpen, onClose, mapId }: AddProcessMapStepModalProps) => {

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


const AnnotationsModal = ({ isOpen, onClose, annotations, insights }) => {
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

const ProcessMapDetails = () => {
  const { id } = useParams();
  const processMap = useConvexQuery(api.processMaps.getWithInsightCount, { processMapId: id });
  const processMapSteps = useConvexQuery(api.processMapSteps.listByMap, { mapId: id });
  const insights = useConvexQuery(api.insights.listByMap, { mapId: id });
  const annotations = useConvexQuery(api.annotations.listByMap, { mapId: id });
  
  const processMapStepsMap = new Map<Id<"processMapSteps">, Doc<"processMapSteps">>();
  processMapSteps?.forEach((step) => {
    processMapStepsMap.set(step._id, step);
  });

  const annotationsByStepMap = new Map<Id<"processMapSteps">, Doc<"annotations">[]>();
  annotations?.forEach((annotation) => {
    const stepAnnotations = annotationsByStepMap.get(annotation.processMapStepId) || [];
    stepAnnotations.push(annotation);
    annotationsByStepMap.set(annotation.processMapStepId, stepAnnotations);
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeStepId, setActiveStepId] = useState<Id<"processMapSteps"> | null>(null);
  const { isOpen: isAnnotationsModalOpen, onOpen: onAnnotationsModalOpen, onClose: onAnnotationsModalClose } = useDisclosure();

  const createAnnotations = useMutation(api.annotations.createMany);
  const deleteAnnotations = useMutation(api.annotations.deleteByMap);

  const handleClick = async () => {
    if (!insights || !processMapSteps) return;

    // Loop through insights and analyze each one
    const annotationsPayload = [];
    for (const insight of insights) {
      try {
        const analysisResults = await analyzeWithOpenAI(insight.title, insight.content || "", processMapSteps);
        console.log(`Analysis results for insight ${insight._id}:`, analysisResults);
        for (const result of analysisResults) {
          const step = processMapStepsMap.get(result.stepId);
          if (step) {
            annotationsPayload.push({
              content: result.content,
              mapId: id,
              insightId: insight._id,
              processMapStepId: step._id,
              positiveSentiment: result.sentiment
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing insight ${insight._id}:`, error);
      }
    }

    console.log(annotationsPayload);
    await deleteAnnotations({ mapId: id });
    await createAnnotations({ annotations: annotationsPayload });
  };

  if (!processMap || !processMapSteps) {
    return (
      <Box pt={20}>
        <Skeleton height="200px" mb={6} />
        <Stack spacing={4}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      </Box>
    );
  }

  return (
    <>
    <AnnotationsModal isOpen={isAnnotationsModalOpen} onClose={onAnnotationsModalClose} annotations={annotationsByStepMap.get(activeStepId) || []} />
    <AddProcessMapStepModal isOpen={isOpen} onClose={onClose} mapId={id} />
      <Box pt={20}>
        <Heading mb={6}>{processMap.name}</Heading>
        <Box overflowX="auto" pb={4}>
          <VStack width="100%" spacing={1} align="stretch" border="1px" borderColor="gray.200" p={4}>
            {processMapSteps?.map((step) => (
              <Card 
                key={step._id} 
                maxW="400px"
                height="100%"
              >
                <CardBody whiteSpace="normal" width="100%">
                  <Box textAlign="left">
                    <Text>{step.name}</Text>
                    <Text fontSize="sm" color="gray.600">{step.description}</Text>
                    <Flex mt={2}>
                      {(annotationsByStepMap.get(step._id)?.length ?? 0) > 0 && (
                        <Button
                          onClick={() => {
                            setActiveStepId(step._id);
                            onAnnotationsModalOpen();
                          }}
                          variant="ghost"
                          size="sm"
                          p={1}
                          height="auto"
                        >
                          <Flex gap={2}>
                            <Text fontSize="sm" color="green.500">
                              +{annotationsByStepMap.get(step._id)?.filter(a => a.positiveSentiment).length || 0}
                            </Text>
                            <Text fontSize="sm" color="red.500">
                              -{annotationsByStepMap.get(step._id)?.filter(a => !a.positiveSentiment).length || 0}
                            </Text>
                          </Flex>
                        </Button>
                      )}
                    </Flex>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </Box>
      <ButtonGroup>
      <Button
          mb={6}
          colorScheme="blue"
          onClick={onOpen}
        >
          Add Process Map Step
        </Button>
        <Button
          mb={6}
          colorScheme="green"
          onClick={handleClick}
        >
          Ingest Insights ({processMap.insightCount})
        </Button>
      </ButtonGroup>
      
    </>
  );
};


type AddInsightModalProps = {
  isOpen: boolean;
  onClose: () => void;
  existingInsight?: Doc<"insights"> | null;
  mode: "create" | "edit";
}

const AddEditInsightModal = ({ isOpen, onClose, existingInsight, mode }: AddInsightModalProps) => {
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

  const processMaps = useConvexQuery(api.processMaps.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
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
        groupId: "kn79hhv4152st4yna00avqe3n174rr2f"
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


const InsightsList = () => {
  const insights = useConvexQuery(api.insights.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
  const processMaps = useConvexQuery(api.processMaps.list, { groupId: "kn79hhv4152st4yna00avqe3n174rr2f" });
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


const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "process-maps",
        children: [
          {
            path: "",
            element: <ProcessMapsList />
          },
          {
            path: ":id",
            element: <ProcessMapDetails />
          }
        ]
      },
      {
        path: "insights",
        children: [
          {
            path: "",
            element: <InsightsList />
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </QueryClientProvider>
    </ConvexProvider>
  </React.StrictMode>,
);
