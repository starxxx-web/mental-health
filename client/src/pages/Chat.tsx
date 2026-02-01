import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Loader2, Mic, Send, Plus, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function Chat() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">AI心理对话</h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <ConversationList
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
          <div className="lg:col-span-3">
            {selectedConversationId ? (
              <ChatInterface conversationId={selectedConversationId} />
            ) : (
              <EmptyState onCreateConversation={setSelectedConversationId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { data: conversations, isLoading } = trpc.conversation.list.useQuery();
  const createMutation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      onSelect(data.conversationId);
      toast.success("新对话已创建");
    },
  });

  const handleCreateNew = () => {
    createMutation.mutate({
      title: `对话 ${new Date().toLocaleDateString()}`,
    });
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>对话列表</span>
          <Button size="sm" onClick={handleCreateNew} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-18rem)]">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">加载中...</div>
          ) : conversations && conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedId === conv.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium truncate">{conv.title}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无对话记录
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreateConversation }: { onCreateConversation: (id: number) => void }) {
  const createMutation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      onCreateConversation(data.conversationId);
      toast.success("新对话已创建");
    },
  });

  return (
    <Card className="h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">开始新的对话</h3>
        <p className="text-muted-foreground mb-6">
          创建一个新对话,与AI心理顾问分享您的感受
        </p>
        <Button onClick={() => createMutation.mutate({ title: `对话 ${new Date().toLocaleDateString()}` })} disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              创建中...
            </>
          ) : (
            "创建新对话"
          )}
        </Button>
      </div>
    </Card>
  );
}

function ChatInterface({ conversationId }: { conversationId: number }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.conversation.get.useQuery({ conversationId });
  const sendMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      // Refetch conversation data to get new messages
      utils.conversation.get.invalidate({ conversationId });
    },
    onError: (error) => {
      toast.error("发送失败: " + error.message);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      conversationId,
      content: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>{data?.conversation.title}</CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">加载对话中...</div>
        ) : data?.messages && data.messages.length > 0 ? (
          <div className="space-y-4">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Streamdown>{msg.content}</Streamdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  <div className="text-xs opacity-70 mt-2">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {sendMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            开始对话,分享您的感受
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="输入您的消息..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMutation.isPending}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setIsRecording(!isRecording);
              toast.info("语音输入功能开发中");
            }}
            disabled={sendMutation.isPending}
          >
            <Mic className={`w-5 h-5 ${isRecording ? "text-destructive" : ""}`} />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
