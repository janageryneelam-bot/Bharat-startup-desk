import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/lib/profile";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, MessageSquare, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Do I need GST?",
  "Which company structure should I choose?",
  "What licenses are required?",
  "Which schemes am I eligible for?",
  "How do I raise funding?",
  "What happens if I miss compliance deadlines?",
];

export default function Copilot() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState([
    { role: "ai", text: `Namaste! I'm your AI co-founder. I know you're at the ${profile?.stage || "Idea"} stage in ${profile?.industry || "your industry"}, operating in ${profile?.state || "India"}. Ask me anything.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(`copilot-${Date.now()}`);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setMessages(m => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const r = await api.post("/copilot/chat", { question: q, context: profile, session_id: sessionRef.current });
      setMessages(m => [...m, { role: "ai", text: r.data.answer, demo: r.data.demo_ai }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Showing demo guidance — please try again shortly.", demo: true }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight inline-flex items-center gap-2"><MessageSquare className="h-6 w-6 text-primary" strokeWidth={1.5} /> AI Copilot</h2>
        <p className="text-muted-foreground mt-1">Powered by Claude Sonnet 4.5 — personalised to your stage, industry, state.</p>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-5 space-y-4" data-testid="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-md px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"}`}>
                  {m.demo && <div data-testid="demo-ai-badge" className="inline-block mb-2 text-[10px] font-mono uppercase tracking-wider bg-warning/20 text-foreground border border-warning/40 px-1.5 py-0.5 rounded">Demo AI Mode</div>}
                  {m.demo && <br/>}
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start"><div className="bg-secondary border border-border rounded-md px-4 py-3 text-sm inline-flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…</div></div>
            )}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border p-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs border border-border rounded-full px-3 py-1 bg-card hover:bg-secondary" data-testid={`suggestion-${s.slice(0, 8)}`}>{s}</button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="border-t border-border p-3 flex gap-2">
            <Input data-testid="copilot-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about your startup…" />
            <Button type="submit" data-testid="copilot-send-btn" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
