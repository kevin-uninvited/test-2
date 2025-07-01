import { NextResponse } from "next/server"

export const runtime = 'edge'; // Add edge runtime for better streaming support

export async function POST(request: Request) {
    try {
        const { messages } = await request.json()

        console.log("Sending request to API with messages:", messages)

        const response = await fetch(process.env.NEBUL_API_URL!, {
            method: "POST",
            headers: {
                accept: "application/json",
                "X-API-Key": process.env.NEBUL_API_KEY!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                stream: true,
                model: process.env.NEBUL_MODEL!,
                messages: messages,
            }),
        })

        if (!response.ok) {
            console.error(`API responded with status: ${response.status}`)
            const errorText = await response.text()
            console.error(`API error response: ${errorText}`)
            return NextResponse.json({
                choices: [{
                    message: {
                        content: `Error: API responded with status ${response.status}. Please try again.`
                    }
                }]
            })
        }

        // Handle streaming response
        if (response.body) {
            const stream = new ReadableStream({
                async start(controller) {
                    const reader = response.body!.getReader()
                    const decoder = new TextDecoder()
                    let buffer = '';

                    try {
                        while (true) {
                            const { done, value } = await reader.read();

                            if (done) {
                                // Process any remaining buffer content
                                if (buffer.trim()) {
                                    processChunk(buffer, controller);
                                }
                                controller.close();
                                break;
                            }

                            // Decode the chunk and add to buffer
                            const chunk = decoder.decode(value, { stream: true });
                            buffer += chunk;

                            // Process complete lines from buffer
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

                            for (const line of lines) {
                                processChunk(line, controller);
                            }
                        }
                    } catch (error) {
                        console.error("Stream reading error:", error);
                        controller.error(error);
                    }
                }
            });

            // Helper function to process a chunk of data
            function processChunk(line: string, controller: ReadableStreamDefaultController) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') {
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                            const content = parsed.choices[0].delta.content;
                            controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
                        }
                    } catch {
                        // Skip invalid JSON chunks
                        console.debug("Failed to parse JSON:", data);
                    }
                }
            }

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'Transfer-Encoding': 'chunked',
                    'X-Accel-Buffering': 'no', // Disable buffering in Nginx
                }
            });
        }

        // Fallback for non-streaming response
        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error("Error in chat API route:", error)
        return NextResponse.json({
            choices: [{
                message: {
                    content: "An error occurred while processing your request. Please try again."
                }
            }]
        }, { status: 500 })
    }
} 