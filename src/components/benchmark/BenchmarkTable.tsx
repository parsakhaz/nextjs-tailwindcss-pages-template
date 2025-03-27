import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define the model data interface
export interface ModelData {
  metric: string;
  [key: string]: number | string;
}

interface ModelConfig {
  id: string;
  name: string;
  ram: number;
  isNew: boolean;
}

interface BenchmarkTableProps {
  modelData: ModelData[];
  modelConfig: {
    models: ModelConfig[];
    benchmarks: string[];
  };
}

export const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ modelData, modelConfig }) => {
  const { ref: tableRef, inView: tableInView } = useInView({ triggerOnce: true });

  // Function to format numbers to 1 decimal place
  const formatNumber = (num: number | string, metric: string) => {
    if (typeof num === 'string') return num;
    
    // Check if the value is between 0 and 1, regardless of the metric name
    // This handles cases where the same benchmark might have both normalized and non-normalized values
    if (num > 0 && num < 1) {
      return (num * 100).toFixed(1);
    }
    return num.toFixed(1);
  };

  return (
    <motion.div
      ref={tableRef}
      initial='hidden'
      animate={tableInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className='w-full'
    >
      <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea]'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='border-b border-[#eaeaea]'>
                <th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
                  <div className='flex flex-col'>
                    <div className='text-[13px] tracking-tight'>Benchmark</div>
                    <div className='text-xs text-gray-500 font-normal mt-0.5'>RAM Usage (GB)</div>
                  </div>
                </th>
                {modelConfig.models.map((model, index) => (
                  <th 
                    key={model.id}
                    className={`px-4 py-3 text-left font-semibold text-black 
                      ${model.isNew ? 'bg-slate-50/80 border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20' : 'bg-white'} 
                      font-geist ${index < modelConfig.models.length - 1 ? 'border-r border-[#eaeaea]' : ''}`}
                  >
                    <div className='flex flex-col'>
                      {model.isNew && <div className='text-[10px] text-red-500 font-medium -mb-1'>New</div>}
                      <span className='text-[13px] tracking-tight'>{model.name}</span>
                      <span className='text-xs text-gray-500 font-normal mt-0.5'>{model.ram} GB</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelData.map((row, idx) => (
                <tr
                  key={row.metric}
                  className={`
                    border-b border-[#eaeaea] last:border-b-0
                    hover:bg-[#fafafa] transition-colors duration-150
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                  `}
                >
                  <td className={`px-4 py-3 whitespace-nowrap text-[13px] text-black font-geist tracking-tight ${row.metric === 'Average' ? 'font-bold' : 'font-medium'}`}>{row.metric}</td>
                  {modelConfig.models.map((model, index) => (
                    <td 
                      key={model.id}
                      className={`
                        px-4 py-3 text-left text-[13px] text-black font-mono 
                        ${model.isNew ? 'bg-slate-50/80 border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20' : ''} 
                        ${row.metric === 'Average' ? 'font-bold' : ''}
                      `}
                    >
                      {formatNumber(row[model.id], row.metric)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};