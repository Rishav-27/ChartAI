import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are a chart data generator. You only respond with JSON using function call. Given a prompt, determine the most appropriate chart type (bar, pie, line, doughnut, radar, polarArea, scatter, bubble, etc.) based on the data context. Output a complete structured chart data object.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_chart",
            description: "Generate a chart data structure",
            parameters: {
              type: "object",
              properties: {
                chartType: {
                  type: "string",
                  description:
                    "The most appropriate chart type for the given prompt. Examples: bar, pie, line, doughnut, radar, polarArea, scatter, bubble, etc.",
                },
                title: { type: "string" },
                labels: {
                  type: "array",
                  items: { type: "string" },
                },
                datasets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      data: {
                        type: "array",
                        items: { type: "number" },
                      },
                      backgroundColor: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                    required: ["label", "data"],
                  },
                },
              },
              required: ["chartType", "labels", "datasets"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "generate_chart" },
      },
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    const chartJson = toolCall?.function?.arguments;

    if (!chartJson) {
      return NextResponse.json(
        { error: "No chart data returned." },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(chartJson));
  } catch (error) {
    console.error("[CHART_API_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
