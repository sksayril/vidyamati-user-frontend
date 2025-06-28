import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Image as ImageIcon, FileText, X, Clock, ChevronRight, History, Plus, Menu, ArrowLeft, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FilePreview {
  file: File;
  preview: string;
  type: 'image';
}

interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  contentType: string;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface ChatStartResponse {
  message: string;
  chat: Chat;
}

interface ChatMessageResponse {
  message: string;
  response: string;
  chatId: string;
}

interface LastMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    content: string;
    role: string;
    timestamp: string;
  };
  messageCount: number;
}

interface ChatHistoryResponse {
  chats: ChatHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalChats: number;
    hasMore: boolean;
  };
}

interface ChatDetails {
  _id: string;
  userId: string;
  title: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    contentType: 'text' | 'image';
    _id: string;
    files: string[];
    timestamp: string;
  }[];
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  contentType?: string;
  timestamp?: string;
}

const JumpingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const formatTitle = (title: string): string => {
  // Remove markdown formatting
  const cleanTitle = title.replace(/[*_#]/g, '');
  // Split by newlines and get first line
  const firstLine = cleanTitle.split('\n')[0];
  // Take first 6 words
  const words = firstLine.split(' ').slice(0, 6);
  // Add ellipsis if there are more words
  const hasMore = firstLine.split(' ').length > 6;
  return words.join(' ') + (hasMore ? '...' : '');
};

const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('https://7cvccltb-3330.inc1.devtunnels.ms/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();
      setChatHistory(data.chats || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadChat = async (chatId: string) => {
    if (!chatId) {
      console.error('Invalid chat ID');
      return;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://7cvccltb-3330.inc1.devtunnels.ms/api/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load chat');
      }

      const data = await response.json();
      
      // Convert the chat details to our Chat format
      setCurrentChat({
        id: chatId,
        title: data.title || 'Chat',
        messages: data.messages.map((msg: ApiMessage) => ({
          _id: msg._id || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          contentType: msg.contentType || 'text',
          timestamp: msg.timestamp || new Date().toISOString()
        }))
      });

      // Scroll to bottom after loading chat
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);

    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.messages, isTyping]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FilePreview[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
          type: 'image'
        });
      }
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const sendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    try {
      setIsLoading(true);
      setIsTyping(true);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('message', message.trim());

      // Add files to FormData
      selectedFiles.forEach(file => {
        formData.append('image', file.file);
      });

      // Add user message immediately to UI
      const userMessage: ChatMessage = {
        _id: Date.now().toString(),
        role: 'user',
        content: message,
        contentType: 'text',
        timestamp: new Date().toISOString()
      };

      setCurrentChat(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        };
      });

      // Clear input and files immediately
      setMessage('');
      setSelectedFiles([]);

      let response;
      if (currentChat) {
        // Continue existing chat
        response = await fetch(`https://7cvccltb-3330.inc1.devtunnels.ms/api/chat/${currentChat.id}/message`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // Start new chat
        response = await fetch('https://7cvccltb-3330.inc1.devtunnels.ms/api/chat/start', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      if (!currentChat) {
        // If this was a new chat, set the full chat data
        setCurrentChat(data.chat);
        // Refresh chat history to include the new chat
        fetchChatHistory();
      } else {
        // Add assistant's response to existing chat
        const assistantMessage: ChatMessage = {
          _id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          contentType: 'text',
          timestamp: new Date().toISOString()
        };

        setCurrentChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, assistantMessage]
          };
        });

        // Refresh chat history to update last message
        fetchChatHistory();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage();
  };

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp));
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const ChatHistorySection = () => {
    const startNewChat = () => {
      setCurrentChat(null);
      setMessage('');
      setSelectedFiles([]);
      // Close sidebar on mobile after starting new chat
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    if (isLoadingHistory) {
      return <div className="p-4">Loading chat history...</div>;
    }

    return (
      <div className="flex flex-col space-y-2 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat History</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        {chatHistory.length === 0 ? (
          <div className="text-gray-500">No chat history yet</div>
        ) : (
          chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                loadChat(chat.id);
                // Close sidebar on mobile after selecting a chat
                if (window.innerWidth < 768) {
                  setShowSidebar(false);
                }
              }}
              className={`text-left p-3 rounded-lg transition-colors ${
                currentChat?.id === chat.id
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{formatTitle(chat.title)}</div>
              <div className="text-sm text-gray-500">
                {formatTimeAgo(chat.updatedAt)}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {chat.messageCount} messages
              </div>
            </button>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Chat History Sidebar - hidden on mobile by default */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 border-r border-gray-200 overflow-y-auto h-full flex-shrink-0 bg-white z-10 ${showSidebar ? 'fixed inset-0 w-full md:relative md:w-80 lg:w-96' : ''}`}>
        <ChatHistorySection />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 mr-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
              aria-label="Toggle chat history"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <Bot className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold">
                {currentChat ? formatTitle(currentChat.title) : 'Chat with AI Assistant'}
              </h1>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <Bot className="w-16 h-16 text-blue-200" />
              <h2 className="text-xl font-medium">Ask me anything about your studies!</h2>
              <p className="max-w-md">I can help with explanations, summaries, practice questions, and more.</p>
            </div>
          ) : (
            currentChat.messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-start mb-1">
                    {msg.role === 'assistant' ? (
                      <Bot className="w-5 h-5 mr-2 flex-shrink-0" />
                    ) : (
                      <User className="w-5 h-5 mr-2 flex-shrink-0" />
                    )}
                    <div className="text-xs opacity-70">
                      {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
                    </div>
                  </div>
                  {msg.contentType === 'text' ? (
                    <div className={`prose ${msg.role === 'user' ? 'prose-invert' : ''} max-w-none`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.contentType === 'image' ? (
                    <img
                      src={msg.content}
                      alt="Shared image"
                      className="max-w-full rounded"
                    />
                  ) : null}
                  <div className="text-xs opacity-50 mt-2 flex items-center justify-end">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 rounded-bl-none">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  <JumpingDots />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="border-t border-gray-200 p-2 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-200 rounded-lg p-2 flex items-center"
                >
                  <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm truncate max-w-[150px]">
                    {file.file.name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 bottom-3 text-gray-500 hover:text-blue-600 transition-colors"
                title="Upload image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  
                  const newFiles: FilePreview[] = [];
                  
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const isImage = file.type.startsWith('image/');
                    
                    if (isImage) {
                      newFiles.push({
                        file,
                        preview: URL.createObjectURL(file),
                        type: 'image'
                      });
                    }
                  }
                  
                  setSelectedFiles([...selectedFiles, ...newFiles]);
                  
                  // Reset file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                multiple
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || (!message.trim() && selectedFiles.length === 0)}
              className={`p-3 rounded-full ${
                isLoading || (!message.trim() && selectedFiles.length === 0)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 