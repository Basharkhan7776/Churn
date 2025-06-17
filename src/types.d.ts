declare module 'prompts' {
  interface PromptObject {
    type: string;
    name: string;
    message: string;
    initial?: any;
    choices?: Array<{ title: string; value: any }>;
    validate?: (value: any) => boolean | string;
    active?: string;
    inactive?: string;
  }

  function prompts(prompts: PromptObject[]): Promise<any>;
  export default prompts;
} 