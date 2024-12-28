// src/components/ChatGPT/ChatAssistant.tsx
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  getChatGPTResponse, 
  explainPriceImpact, 
  getTradingAdvice,
  getAMMExplanation 
} from '../../services/chatgpt';

// Styled Components
const ChatToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
  transition: all 0.3s ease;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledChatContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: ${({ $isOpen }) => ($isOpen ? 'auto' : '0')};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(20px)')};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledChatHeader = styled.div`
  background: ${({ theme }) => theme.gradients.primary};
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledChatBody = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 15px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
  }
`;

const StyledMessage = styled.div<{ isUser: boolean }>`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  ${({ isUser }) => isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
  background: ${({ isUser }) => 
    isUser ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const StyledInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
`;

const StyledInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 10px;
  color: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }
`;

const StyledSendButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledQuickMenu = styled.div`
  padding: 10px 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StyledQuickButton = styled.button`
  background: rgba(0, 242, 254, 0.1);
  border: none;
  border-radius: 15px;
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 242, 254, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 3px;
  padding: 5px 10px;
  
  span {
    width: 5px;
    height: 5px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: typing 1s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  @keyframes typing {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

// Interfaces
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  type?: 'error' | 'success' | 'info';
  isTyping?: boolean;
}

interface QuickQuestion {
  text: string;
  action: () => Promise<string>;
}

// Quick Questions Configuration
const quickQuestions: QuickQuestion[] = [
  {
    text: 'How does swapping work?',
    action: () => getAMMExplanation('token swapping mechanism')
  },
  {
    text: 'What are the fees?',
    action: () => getAMMExplanation('AMM trading fees and rewards')
  },
  {
    text: 'Explain liquidity pools',
    action: () => getAMMExplanation('liquidity pools and providing liquidity')
  },
  {
    text: 'Show price impact',
    action: () => explainPriceImpact(1000, 100000)
  },
  {
    text: 'Trading advice ETH/USDT',
    action: () => getTradingAdvice('ETH/USDT', 1000)
  },
  {
    text: 'Impermanent Loss',
    action: () => getAMMExplanation('impermanent loss calculation and risks')
  }
];

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const addMessage = (content: string, isUser: boolean, type?: 'error' | 'success' | 'info') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: Date.now(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleError = (error: unknown) => {
    console.error('Chat error:', error);
    addMessage(
      'Sorry, I encountered an error. Please try again.',
      false,
      'error'
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    addMessage(userMessage, true);

    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      isUser: false,
      timestamp: Date.now(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await getChatGPTResponse(userMessage);
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      addMessage(response || 'No response', false, 'success');
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: QuickQuestion) => {
    if (isLoading) return;

    setIsLoading(true);
    addMessage(question.text, true);

    try {
      const response = await question.action();
      addMessage(response, false, 'success');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  if (!isOpen) {
    return (
      <ChatToggleButton onClick={() => setIsOpen(true)}>
        💬
      </ChatToggleButton>
    );
  }

  return (
    <StyledChatContainer $isOpen={isOpen}>
      <StyledChatHeader>
        <h3>AI Assistant</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isLoading && <TypingIndicator><span/><span/><span/></TypingIndicator>}
          <HeaderButton onClick={clearChat}>🗑️</HeaderButton>
          <HeaderButton onClick={() => setIsOpen(false)}>✕</HeaderButton>
        </div>
      </StyledChatHeader>

      <StyledQuickMenu>
        {quickQuestions.map((question, index) => (
          <StyledQuickButton
            key={index}
            onClick={() => handleQuickQuestion(question)}
            disabled={isLoading}
          >
            {question.text}
          </StyledQuickButton>
        ))}
      </StyledQuickMenu>
      
      <StyledChatBody>
        {messages.map((message, index) => (
          <StyledMessage 
            key={index} 
            isUser={message.isUser}
            style={{
              backgroundColor: message.type === 'error' ? 'rgba(255,0,0,0.1)' :
                             message.type === 'success' ? 'rgba(0,255,0,0.1)' :
                             message.type === 'info' ? 'rgba(0,0,255,0.1)' :
                             message.isUser ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {message.content}
            <small style={{ display: 'block', marginTop: '5px', opacity: 0.7 }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </small>
          </StyledMessage>
        ))}
        <div ref={messagesEndRef} />
      </StyledChatBody>

      <StyledInputContainer>
        <StyledInput
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about AMM..."
          disabled={isLoading}
        />
        <StyledSendButton onClick={handleSend} disabled={isLoading}>
          Send
        </StyledSendButton>
      </StyledInputContainer>
    </StyledChatContainer>
  );
};