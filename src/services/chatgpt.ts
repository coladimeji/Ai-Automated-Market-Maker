// src/services/chatgpt.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Type definitions
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletion {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Configuration
const CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  responses: {
    error: "I apologize, but I encountered an error. Please try again.",
    rateLimit: "I'm receiving too many requests right now. Please try again in a moment.",
    timeout: "The request took too long to process. Please try again.",
  },
  systemContext: `You are an AI assistant specialized in Automated Market Maker (AMM) operations. 
    You help users understand:
    - Token swapping mechanisms
    - Liquidity pool management
    - Price impact calculations
    - Impermanent loss
    - Trading fees and rewards
    Please provide clear, concise explanations and include relevant examples when appropriate.`
};

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Helper function to create a timeout promise
const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Main ChatGPT response function
export const getChatGPTResponse = async (prompt: string, retryCount = 0): Promise<string> => {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: CONFIG.systemContext },
      { role: 'user', content: prompt }
    ];

    const response = await Promise.race([
      openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.2,
      }),
      createTimeout(CONFIG.timeout)
    ]) as ChatCompletion;

    const content = response?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Invalid response format');
    
    return content;

  } catch (error) {
    console.error('Error calling ChatGPT:', error);

    if (error instanceof Error) {
      if (error.message === 'Request timeout') {
        return CONFIG.responses.timeout;
      }

      // Type guard for rate limit error
      if ('response' in error && (error as any).response?.status === 429) {
        return CONFIG.responses.rateLimit;
      }
    }

    // Implement retry logic
    if (retryCount < CONFIG.maxRetries) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
      return getChatGPTResponse(prompt, retryCount + 1);
    }

    return CONFIG.responses.error;
  }
};

// AMM-specific functions
export const getAMMExplanation = async (topic: string): Promise<string> => {
  const prompt = `
    Explain ${topic} in the context of Automated Market Makers (AMM).
    Include:
    - Basic concept explanation
    - Practical examples
    - Best practices
    - Common pitfalls to avoid
  `;
  return getChatGPTResponse(prompt);
};

export const explainPriceImpact = async (
  tokenAmount: number, 
  poolSize: number
): Promise<string> => {
  const prompt = `
    Calculate and explain the price impact for a trade of ${tokenAmount} tokens 
    in a liquidity pool with ${poolSize} tokens.
    Include:
    - Price impact calculation formula
    - Numerical example with given values
    - Risk assessment
    - Recommendations for minimizing impact
  `;
  return getChatGPTResponse(prompt);
};

export const getTradingAdvice = async (
  tokenPair: string,
  tradeSize: number
): Promise<string> => {
  const prompt = `
    Provide comprehensive trading analysis for a ${tradeSize} size trade on the ${tokenPair} pair.
    Include:
    - Price impact analysis
    - Optimal slippage tolerance
    - Risk factors and mitigation strategies
    - Market depth considerations
    - Timing recommendations
  `;
  return getChatGPTResponse(prompt);
};

// Additional utility functions
export const validateAPIKey = async (): Promise<boolean> => {
  try {
    const response = await getChatGPTResponse('Test connection');
    return response !== CONFIG.responses.error;
  } catch (error) {
    console.error('API Key validation failed:', error);
    return false;
  }
};

export const getPoolAnalysis = async (
  poolAddress: string,
  tokenPair: string
): Promise<string> => {
  const prompt = `
    Analyze the liquidity pool for ${tokenPair} at address ${poolAddress}.
    Include:
    - Pool composition
    - Current TVL analysis
    - Historical performance
    - Risk assessment
    - Impermanent loss potential
  `;
  return getChatGPTResponse(prompt);
};

export const getMarketAnalysis = async (token: string): Promise<string> => {
  const prompt = `
    Provide market analysis for ${token}.
    Include:
    - Current market conditions
    - Trading volume analysis
    - Liquidity depth
    - Recent price trends
    - Key metrics to watch
  `;
  return getChatGPTResponse(prompt);
};