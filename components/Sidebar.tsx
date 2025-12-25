
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectChat, onLogout }) => {
  return (
    <aside className="hidden md:flex flex-col w-[260px] h-full bg-[#09090b] text-zinc-300 border-r border-zinc-800">
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors text-sm font-medium text-white mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">History</p>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectChat(session.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm truncate ${
                activeSessionId === session.id 
                  ? 'bg-zinc-800 text-white' 
                  : 'hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="truncate">{session.title}</span>
              </div>
            </button>
          ))}
          {sessions.length === 0 && (
            <p className="px-3 text-xs text-zinc-600 italic">No previous chats</p>
          )}
        </div>
      </div>
      
      <div className="mt-auto p-3 border-t border-zinc-800">
        <div className="mb-4 px-3 flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-md bg-somaiya-red flex items-center justify-center text-white font-bold text-xs shadow-lg">S</div>
          <div>
            <p className="text-xs font-bold text-zinc-100">Somaiya Vidyavihar</p>
            <p className="text-[10px] text-zinc-500">Academic Platform</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
