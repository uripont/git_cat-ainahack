export type MessageType = 'user' | 'system' | 'output';

export interface Message {
  type: MessageType;
  content: string;
  timestamp: number;
}

export interface ConversationStep {
  messages: Message[];
  completed: boolean;
}

export interface ConversationState {
  currentStep: number;
  steps: Record<number, ConversationStep>;
}