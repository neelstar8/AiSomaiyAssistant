
import React, { useState, useEffect } from 'react';
import { AppView, User, ChatMessage, ChatSession, InfraReport, KnowledgeBaseItem } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ProfileView from './components/ProfileView';
import { getRAGResponse, analyzeInfrastructure } from './services/geminiService';
import { 
  getRagMetadata,
  syncUserProfile, 
  saveInfraReport,
} from './services/firestoreService';
import { fetchRagPayload } from './services/storageService';
import { REWARD_PER_REPORT, CAMPUS_SUBJECTS } from './constants';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [reports, setReports] = useState<InfraReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<{ message: string; domain?: string } | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoading(true);
        try {
          const syncedUser = await syncUserProfile({
            name: firebaseUser.displayName || 'Somaiya Student',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`
          });
          setUser(syncedUser);
          setView(AppView.DASHBOARD);
          initializeFirstSession(syncedUser.name);
        } catch (err) {
          console.error("Auth sync error", err);
          setAuthError({ message: "Profile sync failed. Check your connection." });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const initializeFirstSession = (userName: string) => {
    if (sessions.length === 0) {
      const firstSession: ChatSession = {
        id: Date.now().toString(),
        title: 'Curriculum Assistant',
        messages: [{
          id: 'welcome',
          role: 'model',
          text: `Hello ${userName}. I am the Somaiya Campus AI. Ask me for the syllabus of any branch (COMP, IT, EXTC) or semester.`,
          timestamp: Date.now()
        }],
        lastUpdated: Date.now(),
      };
      setSessions([firstSession]);
      setActiveSessionId(firstSession.id);
    }
  };

  useEffect(() => {
    const loadCurriculumData = async () => {
      setKnowledgeBase(CAMPUS_SUBJECTS);
      try {
        const metadataDocs = await getRagMetadata();
        if (metadataDocs && metadataDocs.length > 0) {
          const cloudKnowledge: KnowledgeBaseItem[] = [];
          for (const meta of metadataDocs as any) {
            const contents = await fetchRagPayload(meta.activePath);
            contents.forEach((text, index) => {
              cloudKnowledge.push({
                id: `${meta.id}_${index}`,
                category: meta.category,
                title: meta.title,
                content: text
              });
            });
          }
          setKnowledgeBase(prev => [...prev, ...cloudKnowledge]);
        }
      } catch (err) {
        console.warn("Using offline subject database.");
      }
    };
    loadCurriculumData();
  }, []);

  const knowledgeContext = knowledgeBase
    .map(item => `[${item.category.toUpperCase()}] ${item.title}: ${item.content} ${item.link ? `URL: ${item.link}` : ''}`)
    .join('\n\n');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError({ 
          message: "Domain Not Authorized: Firebase requires this domain to be whitelisted for Google Sign-In.",
          domain: window.location.hostname
        });
      } else {
        setAuthError({ message: "Sign-in error. Use 'Demo Access' to enter without setup." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    const guestUser: User = {
      name: 'Guest Student',
      email: 'guest@somaiya.edu',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=guest`,
      credits: 50
    };
    setUser(guestUser);
    setView(AppView.DASHBOARD);
    initializeFirstSession(guestUser.name);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
    setUser(null);
    setSessions([]);
    setActiveSessionId(null);
    setView(AppView.AUTH);
    setAuthError(null);
  };

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    if (!activeSessionId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s, messages: [...s.messages, newMessage], lastUpdated: Date.now()
    } : s));
    
    setIsLoading(true);
    let aiResponse = "";

    try {
      if (image) {
        aiResponse = await analyzeInfrastructure(image, text) || "";
        if (aiResponse.includes("CONFIRMED_DAMAGE")) {
          await saveInfraReport({ description: text, imageUrl: image, reporterEmail: user?.email || '', count: 1 });
          const newReport: InfraReport = {
            id: Math.random().toString(36).substr(2, 9),
            description: text, imageUrl: image, status: 'pending',
            reporterEmail: user?.email || '', count: 1, timestamp: Date.now(),
          };
          setReports(prev => [...prev, newReport]);
          setUser(prev => prev ? { ...prev, credits: prev.credits + REWARD_PER_REPORT } : null);
          aiResponse = `Analyzing report... \n\nInfrastructure damage confirmed. I have logged this for maintenance. You earned ${REWARD_PER_REPORT} credits.`;
        }
      } else {
        aiResponse = await getRAGResponse(text, knowledgeContext) || "";
      }
    } catch (error) {
      aiResponse = "I encountered an error processing your request. Please try again.";
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponse || "No subjects found for that criteria. Try another semester.",
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => s.id === activeSessionId ? {
      ...s, messages: [...s.messages, aiMessage], lastUpdated: Date.now()
    } : s));
    setIsLoading(false);
  };

  if (view === AppView.AUTH) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        <div className="w-20 h-20 bg-somaiya-red rounded-2xl flex items-center justify-center mb-8 shadow-2xl rotate-3">
          <span className="text-white font-black text-4xl">S</span>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 tracking-tight">Somaiya Campus AI</h1>
        <p className="text-zinc-500 mb-12 text-center max-w-sm font-medium leading-relaxed">
          The central academic hub for KJSCE curriculum details and infrastructure reporting.
        </p>
        
        <div className="w-full max-w-sm space-y-3">
          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Somaiya ID
              </>
            )}
          </button>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-400 bg-white px-4">Or</div>
          </div>

          <button 
            onClick={handleGuestAccess}
            className={`w-full py-4 rounded-2xl font-bold transition-all border shadow-sm ${authError ? 'bg-somaiya-red/5 border-somaiya-red/20 text-somaiya-red' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
          >
            {authError ? 'Bypass Setup & Enter as Guest' : 'Continue as Guest'}
          </button>
          
          {authError && (
            <div className="mt-6 bg-red-50 border border-red-100 p-5 rounded-2xl space-y-3">
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[11px] font-bold text-red-700 leading-tight">{authError.message}</p>
              </div>
              {authError.domain && (
                <div className="bg-white/80 p-3 rounded-xl border border-red-200">
                  <p className="text-[9px] uppercase tracking-wider text-red-500 font-black mb-1">To fix this in Firebase Console:</p>
                  <code className="block w-full bg-zinc-900 text-white p-2 rounded text-[10px] font-mono select-all mb-2">
                    {authError.domain}
                  </code>
                  <p className="text-[9px] text-zinc-500 leading-relaxed italic">Otherwise, click the "Bypass Setup" button above to proceed immediately.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-12 text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">KJSCE • Vidyavihar • Mumbai</p>
      </div>
    );
  }

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar 
        sessions={sessions} activeSessionId={activeSessionId}
        onNewChat={() => {
           const newS: ChatSession = { id: Date.now().toString(), title: 'New Query', messages: [], lastUpdated: Date.now() };
           setSessions([newS, ...sessions]);
           setActiveSessionId(newS.id);
           setView(AppView.DASHBOARD);
        }}
        onSelectChat={(id) => { setActiveSessionId(id); setView(AppView.DASHBOARD); }}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView(AppView.DASHBOARD)}
              className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${view === AppView.DASHBOARD ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
            >
              Academic AI
            </button>
            <button 
              onClick={() => setView(AppView.PROFILE)}
              className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${view === AppView.PROFILE ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
            >
              Rewards
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-zinc-900 leading-none">{user?.name}</p>
                  <p className="text-[9px] font-bold text-somaiya-red uppercase mt-1 tracking-tighter">{user?.credits} Credits</p>
               </div>
               <img src={user?.avatar} alt="A" className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
            </div>
          </div>
        </header>

        {view === AppView.DASHBOARD ? (
          <ChatView messages={activeSession?.messages || []} onSendMessage={sendMessage} isLoading={isLoading} />
        ) : (
          <ProfileView user={user} reports={reports} onRedeem={() => {}} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
};

export default App;
