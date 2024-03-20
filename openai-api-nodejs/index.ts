import OpenAI from "openai";
import fs from "fs";
import path from "path";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class FileHandler {
  async createFile() {
    const file = await openai.files.create({
      file: fs.createReadStream(path.join(__dirname, "/data/cv.pdf")),
      purpose: "assistants",
    });
    console.log("Upload file for assistant: ", file.id);
    return file;
  }
}

class ThreadHandler {
  async createThread() {
    const thread = await openai.beta.threads.create({});
    console.log("Thread has been created: ", thread);
    return thread;
  }
}

class AssistantHandler {
  async createAssistant(file: OpenAI.Files.FileObject) {
    const assistantName = "Recruiter assistant";
    const assistants = await openai.beta.assistants.list();
    const existingAssistant = assistants.data.find(
      (a) => a.name === assistantName
    );

    if (existingAssistant) {
      console.log(`Assistant '${assistantName}' exists: `, existingAssistant);
      return existingAssistant;
    } else {
      const assistant = await openai.beta.assistants.create({
        name: assistantName,
        instructions:
          "You are a recruiter support chatbot. Use your knowledge base to best respond to customer queries. Please also keep the answer short and concise.",
        model: "gpt-4-1106-preview",
        tools: [{ type: "retrieval" }],
        file_ids: [file.id],
      });
      console.log("Assistant has been created: ", assistant);
      return assistant;
    }
  }
}

class App {
  fileHandler: FileHandler;
  threadHandler: ThreadHandler;
  assistantHandler: AssistantHandler;

  constructor() {
    this.fileHandler = new FileHandler();
    this.threadHandler = new ThreadHandler();
    this.assistantHandler = new AssistantHandler();
  }

  async checkRun(
    thread: OpenAI.Beta.Threads.Thread,
    run: OpenAI.Beta.Threads.Runs.Run
  ) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        const retrieveRun = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );

        console.log("Run status: ", retrieveRun.status);

        if (retrieveRun.status === "completed") {
          console.log("Run completed: ", retrieveRun);

          clearInterval(interval);
          resolve(retrieveRun);
        }
      }, 3000);
    });
  }

  async run() {
    const file = await this.fileHandler.createFile();

    const thread = await this.threadHandler.createThread();

    const assistant = await this.assistantHandler.createAssistant(file);

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content:
        "Summarize technologies that the candidate has worked with in the past and how long they have worked with them without mention company name or the candidate name.",
    });

    console.log("Adding message to thread: ", message);

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    console.log("Run has been created: ", run);

    await this.checkRun(thread, run);

    const messages = await openai.beta.threads.messages.list(thread.id);

    const answer = (messages.data ?? []).find((m) => m?.role === "assistant")
      ?.content?.[0];

    console.log("Answer: ", answer);
  }
}

(async () => {
  console.log("Running job...⏳");

  const app = new App();
  await app.run();

  console.log("Successfully ran job! ✅");
})();
