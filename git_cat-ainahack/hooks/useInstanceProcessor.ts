// hooks/useInstanceProcessor.ts
import { useState, useEffect } from 'react';
import { getInstanceData } from '@/prompts/instanceTypes';

export const useInstanceProcessor = (instanceType: string) => {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstanceData = () => {
      try {
        const instanceData = getInstanceData(instanceType);
        const processableData = Array.isArray(instanceData) ? instanceData : [instanceData];
        console.log('✅ Loaded data:', processableData.length, 'items');
        setData(processableData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        console.error('❌ Error:', errorMessage);
        setError(errorMessage);
      }
    };

    loadInstanceData();
  }, [instanceType]);

  return {
    data,
    error,
    isReady: !!data && !error
  };
};