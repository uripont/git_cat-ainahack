// hooks/useItemProcessor.ts
import { useState, useCallback } from 'react';
import useTextInstructModel from '@/hooks/useTextInstructModel';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useConversationStore } from '@/hooks/useConversationStore';
import {
  STAGE2_2_PROMPT_START,
  STAGE2_2_PROMPT_QUESTION
} from '@/prompts/stage2_2Prompt';

export const useItemProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const textInstruct = useTextInstructModel();
  const { speak, stop, isLoading: isSpeaking } = useTextToSpeech();
  const { 
    addMessage, 
    setCurrentStep, 
    getCurrentStep,
    completeStep 
  } = useConversationStore();

  const assemblePrompt = (item: any) => {
    return `${STAGE2_2_PROMPT_START}${item.question || ''}` +
           `${STAGE2_2_PROMPT_QUESTION}`;
  };

  const processItem = useCallback(async (item: any) => {
    setIsProcessing(true);
    try {
      const currentStep = getCurrentStep();
      console.log(`🔄 Processing item - Step ${currentStep}/7`);
      
      switch (currentStep) {
        case 2:
          console.log('Step 2: Generating procedure guide');
          const prompt = assemblePrompt(item);
          console.log('Generated prompt:', prompt);
          
          const response = await textInstruct.query({ 
            inputs: prompt, 
            parameters: { max_new_tokens: 15 } 
          }, prompt);

          if (typeof response === 'string') {
            // Save output message only if it's a string
            addMessage(currentStep, 'output', response);
            completeStep(currentStep);
            setCurrentStep(3);
            return response;
          } else {
            const error = 'Model response was not in expected string format';
            console.error('❌', error);
            addMessage(currentStep, 'system', error);
            throw new Error(error);
          }
      }
    } catch (err) {
      console.error('❌ Processing error:', err);
      addMessage(getCurrentStep(), 'system', `Error:`);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [textInstruct, addMessage, setCurrentStep, getCurrentStep, completeStep]);

  return {
    isProcessing,
    isSpeaking,
    processItem,
    currentStep: getCurrentStep()
  };
};