import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { INSTANCIA_DATA_MAP } from '@/prompts/instanceTypes';

const TestScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test with a known instance type
  const testInstanceKey = "INSTÀNCIA GENÈRICA";

  useEffect(() => {
    const loadInstanceData = async () => {
      setIsLoading(true);
      try {
        const filePath = "/prompts/instanceData/" + INSTANCIA_DATA_MAP[testInstanceKey];
        if (!filePath) {
          throw new Error('Invalid instance type key');
        }

        // Assuming the JSON files are in the public directory
        const response = await fetch(filePath);
        const data = await response.json();
        console.log('Instance Data:', JSON.stringify(data, null, 2));
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