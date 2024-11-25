import OpenAI from "openai";
import { useMutation } from '@tanstack/react-query';
import { action } from "./_generated/server";
import { v } from "convex/values";

const openai = new OpenAI({ 
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
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

const generateSystemPrompt = (steps: { id: string, name: string, description: string }[]) => {
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

function stripCodeBlockFormatting(rawString: string) {
  // Check if the string starts with "```json" and ends with "```"
  if (rawString.startsWith("```json") && rawString.endsWith("```")) {
    // Remove the "```json" from the start and "```" from the end
    return rawString.slice(7, -3).trim();
  }
  // Return the original string if no formatting is found
  return rawString;
}

export const mapInsightsToSteps = action({
  args: { 
    steps: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
      })
    ), 
    insightTitle: v.string(), 
    insightContent: v.string() 
  },
  handler: async (_, args) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: generateSystemPrompt(args.steps),
        },
        {
          role: "user", 
          content: `Analyze this insight and map it to the process steps given above: \n\nInsight title: ${args.insightTitle}\nInsight content: ${args.insightContent}`
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
  },
});
