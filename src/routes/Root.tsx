import React from 'react'
import { useState } from 'react'
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';


export function Root() {
  const tasks = useQuery(api.tasks.get);
  const [count, setCount] = useState(0)

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex direction="column" maxW="container.lg" mx="auto" p={8}>
        <Table variant="simple" bg="white" rounded="lg" shadow="sm">
          <Thead>
            <Tr>
              <Th>Task</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks?.map(({ _id, text, isCompleted }) => (
              <Tr key={_id}>
                <Td>{text}</Td>
                <Td>{isCompleted ? "Completed" : "Pending"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Box>
  )
}
