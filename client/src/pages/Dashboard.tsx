import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Send, Bot, User, HelpCircle, FileText, CheckCircle2, 
  AlertTriangle, TrendingUp, BookOpen, ExternalLink, RefreshCw,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { getFundingAdvice, saveFounderProfile, type FundingAdvice } from "@/lib/api";

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
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [fundingAdvice, setFundingAdvice] = useState<FundingAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Save profile to backend on component mount
  useEffect(() => {
    const saveProfile = async () => {
      try {
        const normalizedProfile = {
          startup_stage: (profile.stage || 'Idea').toLowerCase(),
          sector: profile.sector.toLowerCase(),
          location: profile.location,
          funding_goal: (profile.fundingGoal || 'Angel').toLowerCase(),
          preferred_language: profile.language.toLowerCase(),
        };
        await saveFounderProfile(normalizedProfile);
        setApiError(null);
      } catch (error) {
        console.error('Failed to save profile:', error);
        setApiError('Could not save profile to backend. Using local mode.');
      }
    };
    
    if (profile.sector && profile.stage && profile.fundingGoal) {
      saveProfile();
    }
  }, [profile]);

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuestion = inputValue;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // 🔥 SOLUTION A: Pre-filter casual greetings to avoid expensive LLM calls
    const casualGreetings = ['hi', 'hello', 'hey', 'thanks', 'thank you', 'ok', 'okay', 'bye', 'goodbye'];
    const normalizedQuestion = userQuestion.toLowerCase().trim().replace(/[!.?]/g, '');
    const isCasualMessage = casualGreetings.includes(normalizedQuestion);
    
    if (isCasualMessage) {
      // Respond without calling expensive LLM
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Hello! Feel free to ask me any funding-related questions. For example: 'What investors should I approach?' or 'How do I prepare my pitch deck?'",
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 500);
      return; // Exit early, no API call
    }

    setIsTyping(true);
    setLoadingAdvice(true);

    try {
      // Call the real API
      const advice = await getFundingAdvice({
        question: userQuestion,
        context: `Stage: ${profile.stage}, Sector: ${profile.sector}, Goal: ${profile.fundingGoal}`
      });
      
      setFundingAdvice(advice);
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: advice.explanation,
        timestamp: new Date()
      }]);
      
      setApiError(null);
    } catch (error) {
      console.error('Error fetching advice:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to get funding advice. Please try again.';
      
      // Show fallback response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm currently unable to connect to the AI advisor (${errorMsg}). Please ensure the backend is running at http://localhost:8000`,
        timestamp: new Date()
      }]);
      
      setApiError(errorMsg);
    } finally {
      setIsTyping(false);
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-muted/20">
      
      {/* Left Panel - Chat Interface */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] border-r bg-background">
        <div className="p-4 border-b flex justify-between items-center bg-background/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Bot className="text-primary w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="font-heading font-semibold text-sm">Nivesh AI Advisor</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online • {profile.language} Mode
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.1, duration: 0.2 }}
                >
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </motion.div>
                <motion.div 
                  className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm transition-all duration-300 hover:shadow-md markdown-content
                    ${msg.role === 'assistant' 
                      ? 'bg-background border border-border rounded-tl-none hover:border-primary/30' 
                      : 'bg-primary text-primary-foreground rounded-tr-none hover:bg-primary/90'}
                  `}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.05, duration: 0.3 }}
                >
                  {msg.role === 'assistant' ? (
                    <div className="space-y-4">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : msg.content}
                </motion.div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <div className="bg-background border p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-primary/40 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-primary/40 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-primary/40 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask about ${profile.fundingGoal} funding...`}
              className="pr-12 py-6 rounded-full shadow-sm input-glow focus-ring-premium"
            />
            <motion.button 
              type="submit" 
              className="absolute right-1 top-1 rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              disabled={!inputValue.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>

      {/* Right Panel - Intelligence */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-muted/10 p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-4">
        
        {/* Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-background to-primary/5 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                Funding Readiness Score
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <HelpCircle className="w-4 h-4 cursor-help" />
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-3 gap-3">
                <motion.span 
                  className="text-4xl font-bold font-heading text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  68<span className="text-xl text-muted-foreground">/100</span>
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                    Medium Confidence
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              >
                <Progress value={68} className="h-2 mb-3 progress-animated" />
              </motion.div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are stronger than 42% of startups in the {profile.sector} sector at {profile.stage} stage.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </motion.div>
                Recommended Path: {profile.fundingGoal === 'Angel' ? 'Angel Network' : profile.fundingGoal}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div 
                className="p-3 bg-muted/50 rounded-lg text-sm border-l-4 border-primary hover:border-primary/80 transition-colors"
                whileHover={{ x: 4 }}
              >
                <p className="font-medium text-foreground mb-1">Why this path?</p>
                <p className="text-muted-foreground">
                  Your revenue metrics suggest you are early for VC but perfect for Angel networks looking for {profile.sector} exposure.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="shadow-sm card-hover">
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
                <motion.div 
                  key={i} 
                  className="flex gap-3 items-start group cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleCheck(i)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <motion.div 
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all duration-300
                      ${checkedItems.has(i) 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-muted-foreground/30 hover:border-primary'}
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    {checkedItems.has(i) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Check className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.div>
                  <span className={`text-sm font-medium transition-all duration-300 ${
                    checkedItems.has(i) 
                      ? 'text-muted-foreground line-through' 
                      : 'text-foreground'
                  }`}>
                    {task}
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sources / Trust */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-sm bg-slate-50 dark:bg-slate-900/50 card-hover">
            <CardContent className="pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sources & Verification</h4>
              <div className="space-y-2">
                <motion.div 
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer link-hover group"
                  whileHover={{ x: 4 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                  >
                    <BookOpen className="w-3 h-3" />
                  </motion.div>
                  <span>SEBI AIF Regulations 2024</span>
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary cursor-pointer link-hover"
                  whileHover={{ x: 4 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                  >
                    <BookOpen className="w-3 h-3" />
                  </motion.div>
                  <span>IVCA Indian Startup Report Q3</span>
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                  >
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </motion.div>
                </motion.div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start gap-2 text-xs text-amber-600/80">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                </motion.div>
                <span>AI-generated advice based on public data. Consult a financial advisor for final decisions.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
