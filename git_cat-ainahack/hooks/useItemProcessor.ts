import { useState, useCallback } from 'react';

export const useItemProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  const processItem = useCallback(async (item: any) => {
    setIsProcessing(true);
    try {
      // For now, just stringify the item
      console.log('🔄 Processing item:', item);
      const result = JSON.stringify(item, null, 2);
      setCurrentResult(result);
      return result;
    } catch (err) {
      console.error('❌ Processing error:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    currentResult,
    processItem
  };
};