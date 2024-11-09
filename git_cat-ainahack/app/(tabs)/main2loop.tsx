import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Button, ScrollView, StyleSheet } from 'react-native';
import { useInstanceProcessor } from '@/hooks/useInstanceProcessor';
import { useItemProcessor } from '@/hooks/useItemProcessor';

const Main2Loop = () => {
  const testInstanceKey = "INSTÀNCIA GENÈRICA";
  const { data, error, isReady } = useInstanceProcessor(testInstanceKey);
  const { isProcessing, currentResult, processItem } = useItemProcessor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedItems, setProcessedItems] = useState<string[]>([]);

  const processNextItem = async () => {
    if (!data || currentIndex >= data.length) return;
    
    const item = data[currentIndex];
    try {
      const result = await processItem(item);
      setProcessedItems(prev => [...prev, result]);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Failed to process item:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instance Processor Test</Text>
      <Text style={styles.subtitle}>Processing: {testInstanceKey}</Text>

      {!isReady && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      
      {isReady && data && (
        <>
          <Button 
            title={`Process Item ${currentIndex + 1}/${data.length}`}
            onPress={processNextItem}
            disabled={currentIndex >= data.length || isProcessing}
          />
          <ScrollView style={styles.results}>
            {processedItems.map((item, idx) => (
              <Text key={idx} style={styles.resultItem}>
                Item {idx + 1}:{'\n'}{item}
              </Text>
            ))}
          </ScrollView>
        </>
      )}

      {isProcessing && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  results: {
    flex: 1,
    marginTop: 20,
  },
  resultItem: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 5,
  }
});

export default Main2Loop;