// src/types/global.d.ts
declare global {
    interface Window {
      ethereum: any;
      Buffer: typeof Buffer;
      process: NodeJS.Process;
    }
  
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        REACT_APP_OPENAI_API_KEY: string;
      }
    }
  }
  
  export {};