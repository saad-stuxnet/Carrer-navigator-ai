import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full px-4 py-6 md:px-8",
        isUser ? "bg-white" : "bg-slate-50"
      )}
    >
      <div className="mx-auto flex w-full max-w-4xl gap-4 md:gap-6">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10",
            isUser ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
          )}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="font-semibold text-slate-900">
            {isUser ? "You" : "Career Navigator AI by MOHAMMAD SAAD SHEIKH"}
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
