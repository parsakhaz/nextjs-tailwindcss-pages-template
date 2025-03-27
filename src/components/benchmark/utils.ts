import { ModelData } from './BenchmarkTable';

/**
 * Benchmark Score Calculation:
 * 1. Scale numbers between 0-1 range by 100x to match other benchmarks
 * 2. Average all benchmark scores
 */
export const calculateBenchmarkScore = (model: string, modelData: ModelData[]): number => {
  const includedBenchmarks = [
    'ChartQA',
    'TextVQA',
    'DocVQA',
    'RealWorldQA',
    'CountBenchQA',
    'TallyQA',
    'POPE'
  ];
  
  const scores = modelData
    .filter(row => includedBenchmarks.includes(row.metric))
    .map(row => {
      const value = row[model];
      if (typeof value === 'string' || value === undefined) return 0;
      
      // Only scale if the value is between 0 and 1
      // This handles cases where some metrics might have both normalized (0-1) 
      // and non-normalized values in the same benchmark
      if (value > 0 && value < 1) {
        return value * 100;
      }
      return value;
    }).filter(score => score > 0);
  
  // Average all scores
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};