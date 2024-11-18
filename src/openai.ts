import OpenAI from "openai";
import { useMutation } from '@tanstack/react-query';
import { Doc } from "../convex/_generated/dataModel";

console.log(import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Convert to standalone function for mutation
const fetchGPT4Response = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message?.content;
};

// New mutation hook
export const useGPT4Mutation = () => {
  return useMutation({
    mutationFn: fetchGPT4Response,
    onError: (error) => {
      console.error("Error fetching GPT-4 response:", error);
    }
  });
};

const generateSystemPrompt = (steps: Doc<"processMapSteps">[]) => {
  return `You are an AI assistant that analyzes customer insights and maps them to process steps. For each insight, you will:
1. Identify which process step it relates to
2. Extract the key feedback from the insight
3. Determine if the sentiment is positive or negative

Here are the process steps: ${JSON.stringify(steps)}.

Format your response as JSON array with objects containing:
{
  "content": "extracted feedback",
  "stepId": "id of related step", 
  "sentiment": boolean
}

The stepId correlates to the _id field on the steps. When returning content, return it in raw json so i can use JSON.parse() on it.
`;
};

function stripCodeBlockFormatting(rawString) {
  // Check if the string starts with "```json" and ends with "```"
  if (rawString.startsWith("```json") && rawString.endsWith("```")) {
    // Remove the "```json" from the start and "```" from the end
    return rawString.slice(7, -3).trim();
  }
  // Return the original string if no formatting is found
  return rawString;
}

export async function analyzeWithOpenAI(insightTitle: string, insightContent: string, steps: Doc<"processMapSteps">[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: generateSystemPrompt(steps),
      },
      {
        role: "user", 
        content: `Analyze this insight and map it to the process steps given above: \n\nInsight title: ${insightTitle}\nInsight content: ${insightContent}`
      }
    ],
    temperature: 0.7
  })
  if (!response.choices[0].message.content) {
    throw new Error(`OpenAI API error: ${response}`);
  }
  let out = stripCodeBlockFormatting(response.choices[0].message.content);
  try {
    return JSON.parse(out);
  } catch (e) {
    console.error(e);
    return null;
  }
}