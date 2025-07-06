import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

// Define supported chart types (for validation if needed)
const supportedChartTypes = [
  "bar",
  "line",
  "pie",
  "doughnut",
  "radar",
  "polarArea",
  "scatter",
  "bubble",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const aiResponse = await openai.chat.completions.create({
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
                  description: "The chart type (bar, pie, etc.)",
                },
                title: {
                  type: "string",
                },
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

    const toolCall = aiResponse.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall || !toolCall.function?.arguments) {
      console.error("No tool function arguments returned:", aiResponse);
      return NextResponse.json(
        { error: "Chart generation failed. Try a different prompt." },
        { status: 500 }
      );
    }

    // Parse JSON safely
    let chartData;
    try {
      chartData = JSON.parse(toolCall.function.arguments);
    } catch (parseError) {
      console.error("JSON parse error:", parseError,toolCall.function.arguments);
      return NextResponse.json(
        { error: "Failed to parse chart data." },
        { status: 500 }
      );
    }

    // Optional: validate chart type
    if (!supportedChartTypes.includes(chartData.chartType)) {
      return NextResponse.json(
        { error: `Unsupported chart type: ${chartData.chartType}` },
        { status: 400 }
      );
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("[CHART_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
