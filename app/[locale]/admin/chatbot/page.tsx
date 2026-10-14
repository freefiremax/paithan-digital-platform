import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { KnowledgeConsole } from "@/components/chatbot/KnowledgeConsole";

export default async function ChatbotAdminPage() {
  await requireAuth(Role.ADMIN);
  return <KnowledgeConsole />;
}
