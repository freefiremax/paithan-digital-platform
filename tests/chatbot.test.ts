import { describe, it, expect } from "vitest";
import { queryKnowledgeBase, buildChatbotContext, KNOWLEDGE_BASE } from "@/lib/rag";
import { POST } from "@/app/api/chatbot/route";
import { NextRequest } from "next/server";

describe("Chatbot RAG Knowledge Base", () => {
  it("should have comprehensive knowledge base documents", () => {
    expect(KNOWLEDGE_BASE.length).toBeGreaterThanOrEqual(12);
  });

  it("should correctly retrieve Paithani saree details for English query", () => {
    const results = queryKnowledgeBase("Tell me about Paithani silk sarees and motifs");
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top.content).toContain("Paithani");
    expect(top.content).toContain("silk");
    expect(top.sourceUrl).toBe("/heritage/cultural-heritage");
  });

  it("should correctly retrieve Jayakwadi Dam details for Marathi query", () => {
    const results = queryKnowledgeBase("जायकवाडी धरण क्षमता आणि दरवाजे");
    expect(results.length).toBeGreaterThan(0);
    const hasJayakwadi = results.some((r) => r.content.includes("Jayakwadi") || r.content.includes("नाथ सागर"));
    expect(hasJayakwadi).toBe(true);
  });

  it("should retrieve emergency contacts for emergency search", () => {
    const results = queryKnowledgeBase("emergency fire police ambulance numbers");
    expect(results.length).toBeGreaterThan(0);
    const emergencyDoc = results.find((r) => r.id === "kb-emergency");
    expect(emergencyDoc).toBeDefined();
    expect(emergencyDoc?.content).toContain("02431-223010");
  });

  it("should retrieve Sant Eknath spiritual heritage", () => {
    const results = queryKnowledgeBase("Sant Eknath Samadhi and Nath Shashti");
    expect(results.length).toBeGreaterThan(0);
    const eknathDoc = results.find((r) => r.id === "kb-sant-eknath");
    expect(eknathDoc).toBeDefined();
    expect(eknathDoc?.content).toContain("Eknathi Bhagavata");
  });

  it("should retrieve grievance redressal info", () => {
    const results = queryKnowledgeBase("how to file a complaint for street light and garbage");
    expect(results.length).toBeGreaterThan(0);
    const grievanceDoc = results.find((r) => r.id === "kb-grievances");
    expect(grievanceDoc).toBeDefined();
    expect(grievanceDoc?.sourceUrl).toBe("/grievances/new");
  });

  it("should build structured context with citations", () => {
    const { contextText, sources } = buildChatbotContext("Jayakwadi bird sanctuary flamingos");
    expect(contextText).toContain("Source 1:");
    expect(sources.length).toBeGreaterThan(0);
  });
});

describe("Chatbot API Route Handler", () => {
  it("should return 400 when query is empty", async () => {
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "   " }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Query is required");
  });

  it("should handle greetings in English with friendly assistant response", async () => {
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "Hello! How are you?", language: "en" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toBeDefined();
    expect(data.reply.length).toBeGreaterThan(20);
  });

  it("should handle greetings in Marathi", async () => {
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "राम कृष्ण हरी", language: "mr" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain("राम कृष्ण हरी");
  });

  it("should handle questions about bot capabilities", async () => {
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "what can you do?", language: "en" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain("AI Citizen Assistant");
  });

  it("should answer civic queries with grounded knowledge sources", async () => {
    const req = new NextRequest("http://localhost:3000/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: "What are the office timings and phone number of Paithan Municipal Council?", language: "en" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain("02431-223010");
    expect(data.sources.length).toBeGreaterThan(0);
  });
});
