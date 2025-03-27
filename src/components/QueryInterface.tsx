import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

export interface QueryInterfaceProps {
  defaultQuery?: string;
  defaultImageSrc?: string;
  defaultResponse?: string;
  onSubmit?: (query: string, imageSrc: string, response: string) => void;
  style?: 'terminal' | 'light' | 'minimal' | 'soft' | 'sharp';
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({
  defaultQuery = 'Give me the Moondream 2B int4 row in JSON',
  defaultImageSrc = '/github-markdown.webp',
  defaultResponse = '{\n  "Model": "Moondream 2B",\n  "Precision": "int4",\n  "Download Size": "1,167 MiB",\n  "Memory Usage": "2,002 MiB",\n  "Download Link": "Download"\n}',
  onSubmit,
  style = 'terminal'
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [imageSrc, setImageSrc] = useState(defaultImageSrc);
  const [response, setResponse] = useState(defaultResponse);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };
  
  const handleResponseChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponse(event.target.value);
  };

  const handleSubmit = () => {
    // Just update the display with the current values
    if (onSubmit) {
      onSubmit(query, imageSrc, response);
    }
  };

  // Render the interface based on style prop
  if (style === 'terminal') {
    return (
      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className='w-full'
      >
        <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Interactive Query Interface</h2>
            
            <div className='space-y-4 mb-6'>
              <div>
                <label htmlFor='query' className='block text-sm font-medium text-gray-700 mb-1'>Query</label>
                <textarea 
                  id='query'
                  value={query}
                  onChange={handleQueryChange}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor='image' className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                <input 
                  type='file' 
                  id='image' 
                  accept='image/*'
                  onChange={handleFileChange}
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                />
              </div>

              <div className='flex justify-center'>
                {imageSrc && <img src={imageSrc} alt='Query image' className='max-h-60 object-contain' />}
              </div>

              <div>
                <label htmlFor='response' className='block text-sm font-medium text-gray-700 mb-1'>Expected Response</label>
                <textarea 
                  id='response'
                  value={response}
                  onChange={handleResponseChange}
                  className='w-full p-2 border border-gray-300 rounded-md font-mono text-sm'
                  rows={5}
                />
              </div>
              
              <div className='flex justify-center mt-4'>
                <Button onClick={handleSubmit}>Update Display</Button>
              </div>
            </div>
            
            <div className='bg-[#1E1E1E] rounded-lg overflow-hidden'>
              {/* Terminal Header */}
              <div className='flex items-center justify-between px-4 py-2 bg-[#2D2D2D]'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-[#FF5F56]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#FFBD2E]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#27C93F]'></div>
                </div>
                <div className='text-gray-400 text-xs font-medium font-geist'>moondream2-2025-01-09</div>
                <div className='w-16'></div>
              </div>

              {/* Terminal Content */}
              <div className='p-6 font-mono text-sm space-y-6'>
                {/* Query */}
                <div className='space-y-3'>
                  <div className='flex items-center text-gray-400'>
                    <span className='text-[#27C93F]'>user@moondream</span>
                    <span className='mx-2 text-gray-600'>$</span>
                    <span className='text-gray-300'>/query: {query}</span>
                  </div>
                  <div className='pl-6'>
                    <div className='text-gray-500 text-sm mb-2'>Selected image:</div>
                    <div className='flex justify-center my-4'>
                      <img src={imageSrc} alt='Processing' className='max-h-60 object-contain' />
                    </div>
                    <div className='text-blue-400'>response:</div>
                    <div className='mt-2 text-[#E4E4E4] bg-black/20 p-4 rounded-lg'>
                      <pre className='text-sm whitespace-pre'>{response}</pre>
                    </div>
                  </div>
                </div>

                {/* Command Prompt */}
                <div className='flex items-center text-gray-400'>
                  <span className='text-[#27C93F]'>user@moondream</span>
                  <span className='mx-2 text-gray-600'>$</span>
                  <span className='w-2 h-4 bg-gray-400 animate-pulse'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (style === 'light') {
    return (
      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className='w-full'
      >
        <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Light Mode Interface</h2>
            
            <div className='space-y-4 mb-6'>
              <div>
                <label htmlFor='query-light' className='block text-sm font-medium text-gray-700 mb-1'>Query</label>
                <textarea 
                  id='query-light'
                  value={query}
                  onChange={handleQueryChange}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor='image-light' className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                <input 
                  type='file' 
                  id='image-light' 
                  accept='image/*'
                  onChange={handleFileChange}
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                />
              </div>

              <div className='flex justify-center'>
                {imageSrc && <img src={imageSrc} alt='Query image' className='max-h-60 object-contain' />}
              </div>

              <div>
                <label htmlFor='response-light' className='block text-sm font-medium text-gray-700 mb-1'>Expected Response</label>
                <textarea 
                  id='response-light'
                  value={response}
                  onChange={handleResponseChange}
                  className='w-full p-2 border border-gray-300 rounded-md font-mono text-sm'
                  rows={5}
                />
              </div>
              
              <div className='flex justify-center mt-4'>
                <Button onClick={handleSubmit}>Update Display</Button>
              </div>
            </div>

            <div className='bg-[#FFFFFF] rounded-lg overflow-hidden border border-[#eaeaea]'>
              {/* Terminal Header */}
              <div className='flex items-center justify-between px-4 py-2 bg-[#f5f5f5] border-b border-[#eaeaea]'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-[#FF5F56]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#FFBD2E]'></div>
                  <div className='w-3 h-3 rounded-full bg-[#27C93F]'></div>
                </div>
                <div className='text-gray-600 text-xs font-medium font-geist'>moondream2-2025-01-09</div>
                <div className='w-16'></div>
              </div>

              {/* Terminal Content */}
              <div className='p-6 font-mono text-sm space-y-6'>
                {/* JSON Query */}
                <div className='space-y-3'>
                  <div className='flex items-center text-gray-600'>
                    <span className='text-[#27C93F]'>user@moondream</span>
                    <span className='mx-2 text-gray-400'>$</span>
                    <span className='text-gray-800'>/query: {query}</span>
                  </div>
                  <div className='pl-6'>
                    <div className='text-gray-500 text-sm mb-2'>Selected image:</div>
                    <div className='flex justify-center my-4'>
                      <img src={imageSrc} alt='Processing' className='max-h-60 object-contain' />
                    </div>
                    <div className='text-blue-600'>response:</div>
                    <div className='mt-2 bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
                      <pre className='text-sm whitespace-pre'>{response}</pre>
                    </div>
                  </div>
                </div>

                {/* Command Prompt */}
                <div className='flex items-center text-gray-600'>
                  <span className='text-[#27C93F]'>user@moondream</span>
                  <span className='mx-2 text-gray-400'>$</span>
                  <span className='w-2 h-4 bg-gray-400 animate-pulse'></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (style === 'minimal') {
    return (
      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className='w-full'
      >
        <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface</h2>
            
            <div className='space-y-4 mb-6'>
              <div>
                <label htmlFor='query-minimal' className='block text-sm font-medium text-gray-700 mb-1'>Query</label>
                <textarea 
                  id='query-minimal'
                  value={query}
                  onChange={handleQueryChange}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor='image-minimal' className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                <input 
                  type='file' 
                  id='image-minimal' 
                  accept='image/*'
                  onChange={handleFileChange}
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                />
              </div>

              <div className='flex justify-center'>
                {imageSrc && <img src={imageSrc} alt='Query image' className='max-h-60 object-contain' />}
              </div>

              <div>
                <label htmlFor='response-minimal' className='block text-sm font-medium text-gray-700 mb-1'>Expected Response</label>
                <textarea 
                  id='response-minimal'
                  value={response}
                  onChange={handleResponseChange}
                  className='w-full p-2 border border-gray-300 rounded-md font-mono text-sm'
                  rows={5}
                />
              </div>
              
              <div className='flex justify-center mt-4'>
                <Button onClick={handleSubmit}>Update Display</Button>
              </div>
            </div>

            <div className='bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#eaeaea] p-8'>
              {/* Query */}
              <div className='space-y-8'>
                <div className='space-y-3'>
                  <div className='text-sm text-gray-500 font-geist'>Query</div>
                  <div className='text-[15px] text-gray-900 font-geist tracking-tight'>{query}</div>
                </div>

                {/* Image */}
                <div className='space-y-3'>
                  <div className='text-sm text-gray-500 font-geist'>Input Image</div>
                  <div className='flex justify-center bg-[#fafafa] rounded-lg p-6'>
                    <img src={imageSrc} alt='Processing' className='max-h-60 object-contain' />
                  </div>
                </div>

                {/* Response */}
                <div className='space-y-3'>
                  <div className='text-sm text-gray-500 font-geist'>Response</div>
                  <div className='bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
                    <pre className='text-[13px] leading-6 whitespace-pre'>{response}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (style === 'soft') {
    return (
      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
        className='w-full'
      >
        <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Soft</h2>
            
            <div className='space-y-4 mb-6'>
              <div>
                <label htmlFor='query-soft' className='block text-sm font-medium text-gray-700 mb-1'>Query</label>
                <textarea 
                  id='query-soft'
                  value={query}
                  onChange={handleQueryChange}
                  className='w-full p-2 border border-gray-300 rounded-md'
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor='image-soft' className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                <input 
                  type='file' 
                  id='image-soft' 
                  accept='image/*'
                  onChange={handleFileChange}
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                />
              </div>

              <div className='flex justify-center'>
                {imageSrc && <img src={imageSrc} alt='Query image' className='max-h-60 object-contain' />}
              </div>

              <div>
                <label htmlFor='response-soft' className='block text-sm font-medium text-gray-700 mb-1'>Expected Response</label>
                <textarea 
                  id='response-soft'
                  value={response}
                  onChange={handleResponseChange}
                  className='w-full p-2 border border-gray-300 rounded-md font-mono text-sm'
                  rows={5}
                />
              </div>
              
              <div className='flex justify-center mt-4'>
                <Button onClick={handleSubmit}>Update Display</Button>
              </div>
            </div>

            <div className='bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#eaeaea] p-10'>
              {/* Query */}
              <div className='space-y-10'>
                <div className='space-y-2.5'>
                  <div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Query</div>
                  <div className='text-[15px] text-gray-900 font-geist tracking-tight'>{query}</div>
                </div>

                {/* Image */}
                <div className='space-y-2.5'>
                  <div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Input Image</div>
                  <div className='flex justify-center bg-[#fcfcfc] rounded-2xl p-8 border border-[#f0f0f0]'>
                    <img src={imageSrc} alt='Processing' className='max-h-60 object-contain' />
                  </div>
                </div>

                {/* Response */}
                <div className='space-y-2.5'>
                  <div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Response</div>
                  <div className='bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
                    <pre className='text-[13px] leading-6 whitespace-pre'>{response}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default to 'sharp' style
  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className='w-full'
    >
      <div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>
          
          <div className='space-y-4 mb-6'>
            <div>
              <label htmlFor='query-sharp' className='block text-sm font-medium text-gray-700 mb-1'>Query</label>
              <textarea 
                id='query-sharp'
                value={query}
                onChange={handleQueryChange}
                className='w-full p-2 border border-gray-300 rounded-md'
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor='image-sharp' className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
              <input 
                type='file' 
                id='image-sharp' 
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              />
            </div>

            <div className='flex justify-center'>
              {imageSrc && <img src={imageSrc} alt='Query image' className='max-h-60 object-contain' />}
            </div>

            <div>
              <label htmlFor='response-sharp' className='block text-sm font-medium text-gray-700 mb-1'>Expected Response</label>
              <textarea 
                id='response-sharp'
                value={response}
                onChange={handleResponseChange}
                className='w-full p-2 border border-gray-300 rounded-md font-mono text-sm'
                rows={5}
              />
            </div>
            
            <div className='flex justify-center mt-4'>
              <Button onClick={handleSubmit}>Update Display</Button>
            </div>
          </div>

          <div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
            {/* Query */}
            <div className='space-y-6'>
              <div className='space-y-2'>
                <div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
                <div className='text-[15px] text-gray-900 font-geist tracking-tight'>{query}</div>
              </div>

              {/* Image */}
              <div className='space-y-2'>
                <div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
                <div className='flex justify-center bg-[#fafafa] p-4'>
                  <img src={imageSrc} alt='Processing' className='max-h-60 object-contain' />
                </div>
              </div>

              {/* Response */}
              <div className='space-y-2'>
                <div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
                <div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
                  <pre className='text-[13px] leading-6 whitespace-pre'>{response}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryInterface;