import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer, Area } from 'recharts';
import { ModelData } from './BenchmarkTable';
import { calculateBenchmarkScore } from './utils';

interface ModelConfig {
  id: string;
  name: string;
  ram: number;
  isNew: boolean;
}

interface ModelVisualizationProps {
  modelData: ModelData[];
  modelConfig: {
    models: ModelConfig[];
    benchmarks: string[];
  };
}

interface ScatterProps {
  cx: number;
  cy: number;
  payload: {
    name: string;
    x: number;
    y: number;
  };
}

export const ModelVisualization: React.FC<ModelVisualizationProps> = ({ modelData, modelConfig }) => {
  const { ref: chartRef, inView: chartInView } = useInView({ triggerOnce: true });
  const [chartData, setChartData] = useState<Array<{name: string; x: number; y: number;}>>([]);
  // Removed curve data state

  useEffect(() => {
    // Generate chart data programmatically
    const data = modelConfig.models.map(model => ({
      name: model.name,
      x: model.ram,
      y: calculateBenchmarkScore(model.id, modelData),
    }));
    setChartData(data);

    // Curve data points removed
  }, [modelData, modelConfig]);

  const renderShape = (props: unknown): JSX.Element => {
    const { cx, cy, payload } = props as ScatterProps;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#000"
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#000"
          className="text-sm font-geist"
          >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      ref={chartRef}
      initial='hidden'
      animate={chartInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className='w-full mb-8'
    >
      <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
        <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Small Vision Language Model Ecosystem</h2>
        <div className='w-full h-[600px] relative'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart margin={{ top: 20, right: 40, bottom: 40, left: 40 }}>
              <defs>
                <marker id='arrowhead' markerWidth='10' markerHeight='7' refX='9' refY='3.5' orient='auto'>
                  <polygon points='0 0, 10 3.5, 0 7' fill='#666' />
                </marker>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#eaeaea' />
              <XAxis
                type='number'
                dataKey='x'
                name='RAM Usage'
                unit=' GB'
                domain={[2, 8]}
                ticks={[2, 3, 4, 5, 6, 7, 8]}
                tickFormatter={(value) => `${value}`}
                stroke='#666'
              >
                <Label value='RAM Usage (GB)' offset={-30} position='insideBottom' style={{ fontFamily: 'Geist', fontSize: '18px' }} />
                <Label
                  value='← less is cheaper/faster'
                  position='bottom'
                  offset={15}
                  style={{
                    fontFamily: 'Geist',
                    fontSize: '12px',
                    fill: '#16a34a',
                    opacity: 0.5,
                    transform: 'translateY(-20px) translateX(-330px)',
                  }}
                />
              </XAxis>
              <YAxis
                type='number'
                dataKey='y'
                name='Average Benchmark Score'
                unit='%'
                domain={[50, 90]}
                ticks={[50, 55, 60, 65, 70, 75, 80, 85, 90]}
                tickFormatter={(value) => `${value}`}
                label={{ 
                  value: 'Average Benchmark Score (%)', 
                  angle: -90, 
                  offset: -10, // position options: 
                  style: { fontFamily: 'Geist', fontSize: '18px' },
                  position: 'insideLeft',
                }}
                stroke='#666'
              >
                <Label
                  value='↑ higher is better'
                  position='top'
                  offset={10}
                  style={{
                    fontFamily: 'Geist',
                    fontSize: '12px',
                    fill: '#16a34a',
                    opacity: 0.5,
                    textAnchor: 'start',
                  }}
                />
              </YAxis>
              <Tooltip
                cursor={false}
                content={(props: any) => {
                  const { payload } = props;
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className='bg-white p-3 border border-[#eaeaea] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] rounded-lg font-geist'>
                        <p className='font-medium text-sm mb-1'>{data.name}</p>
                        <p className='text-xs text-gray-600'>RAM: {data.x} GB</p>
                        <p className='text-xs text-gray-600'>Average Benchmark Score: {data.y.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Area visualization removed */}

              <Scatter
                name='Models'
                data={chartData}
                fill='#000'
                shape={renderShape}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className='absolute left-[580px] top-[420px] transform -translate-y-1/2 bg-white/95 p-4 rounded-lg border border-[#eaeaea] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)]'>
            <p className='text-sm font-medium font-geist mb-2 tracking-tight'>Average Benchmark Score Methodology</p>
            <p className='text-xs text-gray-600 font-geist leading-relaxed'>
              For each benchmark:
              <br />
              1. Rank models by score
              <br />
              2. Convert to percentile (0-100%)
              <br />
              3. Average all percentiles
            </p>
            <p className='text-[11px] text-gray-400 font-geist mt-2 leading-relaxed'>*We squeezed the Y-axis to improve chart readability.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};