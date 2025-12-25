
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() && !previewImage) return;
    onSendMessage(inputText, previewImage || undefined);
    setInputText('');
    setPreviewImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // 1. Handle Headers (###)
      if (line.startsWith('###')) {
        return (
          <h3 key={i} className="text-lg font-bold text-zinc-900 mt-6 mb-3 border-b border-zinc-100 pb-2">
            {line.replace(/^###\s*/, '').replace(/\*\*/g, '')}
          </h3>
        );
      }

      // 2. Handle Markdown Links [text](url)
      const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [full, linkText, url] = linkMatch;
        const parts = line.split(full);
        return (
          <div key={i} className="my-3">
            {parts[0] && <span className="text-zinc-700">{parts[0]}</span>}
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all shadow-sm border border-zinc-800"
            >
              <svg className="w-3.5 h-3.5 text-somaiya-red" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              {linkText}
            </a>
            {parts[1] && <span className="text-zinc-700">{parts[1]}</span>}
          </div>
        );
      }

      // 3. Handle Bullet Points
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <div key={i} className="flex gap-3 mb-1 pl-4">
            <span className="text-somaiya-red mt-1.5">•</span>
            <p className="text-zinc-700 leading-relaxed text-[14px]">
              {renderInlineMarkdown(content)}
            </p>
          </div>
        );
      }

      // 4. Regular Paragraphs
      return line.trim() ? (
        <p key={i} className="text-zinc-700 leading-relaxed text-[14px] mb-2">
          {renderInlineMarkdown(line)}
        </p>
      ) : (
        <div key={i} className="h-2" />
      );
    });
  };

  // Helper for bold and italic within text
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-zinc-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-4 pb-32"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center mb-4">
              <span className="text-somaiya-red font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-800 mb-2">Academic Assistant</h1>
            <p className="text-zinc-500 text-sm max-w-sm">Try asking: "What is the IT Sem 4 syllabus?" or "Show me COMP Sem 3 PYQs."</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`py-8 w-full border-b border-zinc-50 message-fade-in ${
                msg.role === 'model' ? 'bg-zinc-50/30' : 'bg-white'
              }`}
            >
              <div className="chat-container-max flex gap-5 px-4 md:px-0">
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-black shadow-sm tracking-tighter ${
                  msg.role === 'model' ? 'bg-somaiya-red text-white' : 'bg-zinc-900 text-zinc-100'
                }`}>
                  {msg.role === 'model' ? 'AI' : 'YOU'}
                </div>
                <div className="flex-1 min-w-0">
                  {msg.image && (
                    <div className="mb-4 max-w-sm">
                      <img src={msg.image} alt="Upload" className="rounded-xl border border-zinc-200 shadow-sm object-cover" />
                    </div>
                  )}
                  <div className="text-zinc-800">
                    {renderMessageText(msg.text)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="py-8 bg-zinc-50/30">
            <div className="chat-container-max px-4 md:px-0 flex gap-5">
               <div className="w-8 h-8 rounded-lg bg-somaiya-red flex items-center justify-center text-white text-[9px] font-black shadow-sm">AI</div>
               <div className="flex gap-1 items-center mt-3">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10 px-4">
        <div className="chat-container-max">
          {previewImage && (
            <div className="mb-3 relative inline-block">
              <img src={previewImage} className="w-16 h-16 rounded-lg object-cover border-2 border-somaiya-red" alt="Preview" />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-2 -right-2 bg-zinc-900 text-white rounded-full p-1 shadow-lg"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          <div className="relative flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl shadow-xl focus-within:border-somaiya-red/30 transition-all p-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-zinc-400 hover:text-somaiya-red hover:bg-zinc-50 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g., 'What subjects are in IT Sem 4?'"
              className="flex-1 bg-transparent border-none py-3 px-1 focus:outline-none text-[15px] text-zinc-800 placeholder-zinc-400"
            />
            
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() && !previewImage || isLoading}
              className={`p-3 rounded-xl transition-all ${
                (!inputText.trim() && !previewImage) || isLoading ? 'text-zinc-200' : 'text-somaiya-red hover:bg-somaiya-red/5'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 text-center mt-3 tracking-tight">KJSCE Verified Repository • Data Syncing Every 24h</p>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
