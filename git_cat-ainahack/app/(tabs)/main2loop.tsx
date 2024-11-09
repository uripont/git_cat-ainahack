import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getInstanceData } from '@/prompts/instanceTypes';

const TestScreen = () => {
    const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test with a known instance type
  const testInstanceKey = "INSTÀNCIA GENÈRICA";

  useEffect(() => {
    const loadInstanceData = () => {
      setIsLoading(true);
      try {
        const instanceData = getInstanceData(testInstanceKey);
        setData(instanceData);
        console.log('Instance Data:', JSON.stringify(instanceData, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load instance data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstanceData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instance Data Test</Text>
      <Text style={styles.subtitle}>Testing: {testInstanceKey}</Text>
      
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  error: {
    color: 'red',
    marginTop: 16,
  }
});

export default TestScreen;