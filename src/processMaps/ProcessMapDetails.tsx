import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Heading, Stack, Skeleton, Button, Flex, Text, Card, CardBody, VStack, ButtonGroup } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { AddProcessMapStepModal } from "./AddProcessMapStepModal";
import { AnnotationsModal } from "./AnnotationsModal";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { analyzeWithOpenAI } from "../openai";

export const ProcessMapDetails = () => {
  const { id } = useParams();
  const processMap = useQuery(api.processMaps.getWithInsightCount, { processMapId: id });
  const processMapSteps = useQuery(api.processMapSteps.listByMap, { mapId: id });
  const insights = useQuery(api.insights.listByMap, { mapId: id });
  const annotations = useQuery(api.annotations.listByMap, { mapId: id });
  
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
