import { useState, useCallback } from 'react';
import useTextInstructModel from '@/hooks/useTextInstructModel';
import {
  STAGE2_2_PROMPT_START,
  STAGE2_2_PROMPT_QUESTION
} from '@/prompts/stage2_2Prompt';

type ProcessingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ProcessingState {
  step: ProcessingStep;
  results: {
    [key in ProcessingStep]?: any;
  };
}

export const useItemProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [state, setState] = useState<ProcessingState>({
    step: 2, // Starting with step 2 for now
    results: {}
  });

  const textInstruct = useTextInstructModel();

  const assemblePrompt = (item: any) => {
    return `${STAGE2_2_PROMPT_START}${item.question || ''}` +
           `${STAGE2_2_PROMPT_QUESTION}`;
  };

  const processItem = useCallback(async (item: any) => {
    setIsProcessing(true);
    try {
      console.log(`🔄 Processing item - Step ${state.step}/7:`, item);
      
      switch (state.step) {
        case 2:
          console.log('Step 2: Generating procedure guide');
          const prompt = assemblePrompt(item);
          console.log('Generated prompt:', prompt);
          
          const response = await textInstruct.query({ 
            inputs: prompt, 
            parameters: { max_new_tokens: 15 } 
          }, prompt);

          setState(prev => ({
            step: 3,
            results: {
              ...prev.results,
              2: response
            }
          }));

          console.log(response);
          
          return response;
      }
    } catch (err) {
      console.error('❌ Processing error:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [state.step, textInstruct]);

  return {
    isProcessing,
    currentResult,
    processItem,
    currentStep: state.step,
    stepResults: state.results,
    isModelLoading: textInstruct.loading
  };
};