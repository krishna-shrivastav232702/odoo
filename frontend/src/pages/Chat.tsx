import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Conversation, Message } from '@/types';
import { chatAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { socket } = useSocket();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && user) {
      // Join user's room for real-time updates
      socket.emit('join', user.id);
      
      // Listen for new messages
      socket.on('newMessage', handleNewMessage);
      
      // Listen for conversation updates
      socket.on('conversationUpdate', handleConversationUpdate);
      
      return () => {
        socket.off('newMessage');
        socket.off('conversationUpdate');
      };
    }
  }, [socket, user, selectedConversation]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getConversations();
      const conversationsData = response.data.conversations || response.data || [];
      setConversations(conversationsData);
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await chatAPI.getConversation(conversationId.toString());
      // Fix: Extract messages from conversation object
      const conversation = response.data.conversation || response.data;
      const messagesData = conversation?.messages || [];
      setMessages(messagesData);
      
      // Join the conversation room for real-time updates
      if (socket) {
        socket.emit('join_conversation', conversationId);
      }
      
      // Mark messages as read
      await chatAPI.markAsRead(conversationId);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX
    setIsSending(true);
    
    try {
      const response = await chatAPI.sendMessage({
        conversationId: selectedConversation.id,
        content: messageContent,
        messageType: 'text'
      });
      
      const newMsg = response.data.message || response.data;
      setMessages(prev => [...prev, newMsg]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent); // Restore message on error
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedConversation && message.conversationId === selectedConversation.id) {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    }
    
    // Update conversations list to show latest message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === message.conversationId
          ? { ...conv, messages: [message] }
          : conv
      )
    );
  };

  const handleConversationUpdate = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.buyer?.id === user?.id 
      ? conversation.seller 
      : conversation.buyer;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Messages
        </h1>
        <p className="text-muted-foreground">
          Connect with buyers and sellers
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversations ({conversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting with sellers!</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);
                    const lastMessage = conversation.messages?.[0];
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {otherUser?.username?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">
                                {otherUser?.username || 'Unknown User'}
                              </p>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(lastMessage.createdAt)}
                                </span>
                              )}
                            </div>
                            {conversation.product && (
                              <p className="text-sm text-muted-foreground truncate">
                                About: {conversation.product.title}
                              </p>
                            )}
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Avatar>
                    <AvatarFallback>
                      {getOtherUser(selectedConversation)?.username?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {getOtherUser(selectedConversation)?.username || 'Unknown User'}
                    </h3>
                    {selectedConversation.product && (
                      <p className="text-sm text-muted-foreground">
                        About: {selectedConversation.product.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-[500px]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.senderId === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user?.id
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isSending}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim() || isSending}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Choose a conversation to start chatting
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;