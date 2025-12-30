import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Send, Bot, User, HelpCircle, FileText, CheckCircle2, 
  AlertTriangle, TrendingUp, BookOpen, ExternalLink, RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const { profile } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Namaste! I've analyzed your ${profile.sector} startup profile. Based on your ${profile.stage} stage, I can help you prepare for ${profile.fundingGoal} funding. What would you like to know first?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on recent data from similar startups in your sector, investors are looking for strong unit economics before Series A.",
        "For government grants, you should check the Startup India Seed Fund Scheme. Your sector is eligible.",
        "I've updated your readiness score based on this new information. You need to work on your Go-To-Market strategy document."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-muted/20">
      
      {/* Left Panel - Chat Interface */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] border-r bg-background">
        <div className="p-4 border-b flex justify-between items-center bg-background/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="text-primary w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-sm">Nivesh AI Advisor</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online • {profile.language} Mode
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}
                  `}
                >
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div 
                  className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
                    ${msg.role === 'assistant' 
                      ? 'bg-background border rounded-tl-none' 
                      : 'bg-primary text-primary-foreground rounded-tr-none'}
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-background border p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask about ${profile.fundingGoal} funding...`}
              className="pr-12 py-6 rounded-full shadow-sm"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-1 top-1 rounded-full w-10 h-10"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel - Intelligence */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-muted/10 p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-4">
        
        {/* Readiness Score */}
        <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
              Funding Readiness Score
              <HelpCircle className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-bold font-heading text-primary">68<span className="text-xl text-muted-foreground">/100</span></span>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Medium Confidence</Badge>
            </div>
            <Progress value={68} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              You are stronger than 42% of startups in the {profile.sector} sector at {profile.stage} stage.
            </p>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" /> 
              Recommended Path: {profile.fundingGoal === 'Angel' ? 'Angel Network' : profile.fundingGoal}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg text-sm border-l-4 border-primary">
              <p className="font-medium text-foreground mb-1">Why this path?</p>
              <p className="text-muted-foreground">
                Your revenue metrics suggest you are early for VC but perfect for Angel networks looking for {profile.sector} exposure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Next 7-Day Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Prepare 12-month Burn Rate projection",
              "Update Pitch Deck with Market Size (TAM/SAM/SOM)",
              "Register on Startup India portal"
            ].map((task, i) => (
              <div key={i} className="flex gap-3 items-start group">
                <div className="mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-transparent hover:text-primary hover:border-primary cursor-pointer transition-colors">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span className="text-sm text-foreground/90 group-hover:text-foreground transition-colors">{task}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sources / Trust */}
        <Card className="shadow-sm bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources & Verification</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                <BookOpen className="w-3 h-3" />
                <span>SEBI AIF Regulations 2024</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                <BookOpen className="w-3 h-3" />
                <span>IVCA Indian Startup Report Q3</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center gap-2 text-xs text-amber-600/80">
              <AlertTriangle className="w-3 h-3" />
              <span>AI-generated advice based on public data. Consult a financial advisor for final decisions.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
