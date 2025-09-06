import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { chatAPI } from '@/lib/api';
import { Conversation, Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export const ChatWindow = ({ conversation, onBack }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { 
    socket, 
    joinConversation, 
    leaveConversation, 
    sendMessage, 
    markMessagesRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping
  } = useSocket();

  const otherUser = conversation.buyerId === user?.id ? conversation.seller : conversation.buyer;

  useEffect(() => {
    loadMessages();
    joinConversation(conversation.id);

    // Set up socket listeners
    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversation.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    const handleUserTyping = (data: { conversationId: number; userId: number; username: string }) => {
      if (data.conversationId === conversation.id && data.userId !== user?.id) {
        setIsTyping(true);
        setTypingUser(data.username);
      }
    };

    const handleUserStoppedTyping = (data: { conversationId: number; userId: number }) => {
      if (data.conversationId === conversation.id && data.userId !== user?.id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    };

    onNewMessage?.(handleNewMessage);
    onUserTyping?.(handleUserTyping);
    onUserStoppedTyping?.(handleUserStoppedTyping);

    return () => {
      leaveConversation(conversation.id);
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getMessages(conversation.id.toString());
      setMessages(response.data);
      markMessagesRead(conversation.id);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      sendMessage(conversation.id, messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.trim() && !isTyping) {
      startTyping(conversation.id);
    } else if (!value.trim() && isTyping) {
      stopTyping(conversation.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            {otherUser.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser.username}</h3>
          {conversation.product && (
            <p className="text-sm text-muted-foreground">
              About: {conversation.product.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.senderId === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && typingUser && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {typingUser} is typing...
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};