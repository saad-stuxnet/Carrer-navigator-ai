import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Bot } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { createChatSession } from "@/lib/gemini";
import { Chat } from "@google/genai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "initial-greeting",
  role: "assistant",
  content: "Hello! 👋 I am your personal Career Navigator AI by MOHAMMAD SAAD SHEIKH. I'm here to guide you in making the best decisions for your future — whether it's choosing subjects after 10th, selecting the right college after 12th, preparing for competitive exams, getting a job, or starting and growing a business. Let's build your future together! 🚀",
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createChatSession();
      }

      const response = await chatRef.current.sendMessageStream({
        message: userMessage.content,
      });

      let fullResponse = "";
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      for await (const chunk of response) {
        const text = (chunk as any).text || "";
        fullResponse += text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error while trying to respond. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Career Navigator AI by MOHAMMAD SAAD SHEIKH
          </h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col pb-32">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex w-full px-4 py-6 md:px-8 bg-slate-50">
              <div className="mx-auto flex w-full max-w-4xl gap-4 md:gap-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white md:h-10 md:w-10">
                  <Bot size={20} />
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about your career, studies, or business..."
              className="w-full bg-transparent py-4 pl-6 pr-14 text-slate-900 placeholder:text-slate-400 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-slate-500">
            Career Navigator AI by MOHAMMAD SAAD SHEIKH can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}
