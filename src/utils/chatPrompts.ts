// src/utils/chatPrompts.ts
export const predefinedPrompts = {
    swapExplanation: 'Can you explain how token swapping works in an AMM?',
    liquidityProvision: 'How does providing liquidity work and what are the risks?',
    impermanentLoss: 'What is impermanent loss?',
    fees: 'How are fees calculated in this AMM?',
  };
  
  export const formatPrompt = (type: keyof typeof predefinedPrompts) => {
    return predefinedPrompts[type];
  
    

};