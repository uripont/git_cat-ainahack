import { create } from 'zustand';
import { Message, MessageType, ConversationState } from '@/types/conversation';

interface ConversationStore {
  // State
  conversation: ConversationState;
  
  // Actions
  addMessage: (step: number, type: MessageType, content: string) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  reset: () => void;
  
  // Selectors
  getCurrentStep: () => number;
  getStepMessages: (step: number) => Message[];
  isStepCompleted: (step: number) => boolean;
}

const initialState: ConversationState = {
  currentStep: 2,
  steps: {}
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversation: initialState,

  addMessage: (step, type, content) => set((state) => ({
    conversation: {
      ...state.conversation,
      steps: {
        ...state.conversation.steps,
        [step]: {
          messages: [
            ...(state.conversation.steps[step]?.messages || []),
            { type, content, timestamp: Date.now() }
          ],
          completed: state.conversation.steps[step]?.completed || false
        }
      }
    }
  })),

  setCurrentStep: (step) => set((state) => ({
    conversation: {
      ...state.conversation,
      currentStep: step
    }
  })),

  completeStep: (step) => set((state) => ({
    conversation: {
      ...state.conversation,
      steps: {
        ...state.conversation.steps,
        [step]: {
          ...state.conversation.steps[step],
          completed: true
        }
      }
    }
  })),

  reset: () => set({ conversation: initialState }),

  // Selectors
  getCurrentStep: () => get().conversation.currentStep,
  getStepMessages: (step) => get().conversation.steps[step]?.messages || [],
  isStepCompleted: (step) => get().conversation.steps[step]?.completed || false
}));