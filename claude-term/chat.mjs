// chat.mjs
import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";

// Create a new client using your API key from environment variable
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Setup a readline interface for interactive terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send your question to Claude and print the response
async function ask(question) {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20240620",  // model name
    max_tokens: 1024,                     // adjust if you want longer replies
    messages: [
      { role: "user", content: question }
    ]
  });

  // Extract and print the text part of the reply
  const first = response.content.find(c => c.type === "text");
  console.log("\nclaude> " + (first?.text ?? "[no text content]") + "\n");
}

// Configure prompt
rl.setPrompt("you> ");
rl.prompt();

// Loop: take user input, send to Claude, print reply
rl.on("line", async line => {
  const trimmed = line.trim().toLowerCase();
  if (trimmed === "exit" || trimmed === "quit") {
    rl.close();
    return;
  }
  try {
    await ask(line);
  } catch (err) {
    console.error("Error:", err?.message ?? err);
  }
  rl.prompt();
});
