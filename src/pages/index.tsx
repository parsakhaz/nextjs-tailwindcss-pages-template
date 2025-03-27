// Import Statements
import Head from 'next/head';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RoughNotation } from 'react-rough-notation';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer, Area } from 'recharts';
import { BenchmarkTable, ModelVisualization } from '../components/benchmark';
import { SyntaxCode } from '../components/SyntaxCode';
import modelDataJson from '../data/modelData.json';
import modelConfigJson from '../data/modelConfig.json';

// Home Component
export default function Home() {
	// Type the imported JSON data
	const modelData = modelDataJson as Array<{
		metric: string;
		[key: string]: number | string;
	}>;

	const modelConfig = modelConfigJson as {
		models: Array<{
			id: string;
			name: string;
			ram: number;
			isNew: boolean;
		}>;
		benchmarks: string[];
	};

	return (
		<div className='min-h-screen bg-[#fafaf8]'>
			<Head>
				<title>Model Comparison</title>
				<meta name='description' content='AI Model Comparison Table' />
			</Head>

			<main className='container mx-auto px-4 py-16'>
				<ModelVisualization modelData={modelData} modelConfig={modelConfig} />
				<BenchmarkTable modelData={modelData} modelConfig={modelConfig} />

				{/* Query/Response Visualization: Modern Terminal Style */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-16 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Interactive Query Examples</h2>

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
									{/* JSON Query */}
									<div className='space-y-3'>
										<div className='flex items-center text-gray-400'>
											<span className='text-[#27C93F]'>user@moondream</span>
											<span className='mx-2 text-gray-600'>$</span>
											<span className='text-gray-300'>/query: Give me the Moondream 2B int4 row in JSON</span>
										</div>
										<div className='pl-6'>
											<div className='text-gray-500 text-sm mb-2'>Selected image:</div>
											<div className='flex justify-center my-4'>
												<img src='github-markdown.webp' alt='Processing' />
											</div>
											<div className='text-blue-400'>response:</div>
											<div className='mt-2 text-[#E4E4E4] bg-black/20 p-4 rounded-lg'>
												<pre className='text-sm whitespace-pre'>
													{`{
  `}
													<span className='text-[#79B8FF]'>"Model"</span>
													<span className='text-gray-300'>: </span>
													<span className='text-[#9ECBFF]'>"Moondream 2B"</span>
													<span className='text-gray-300'>,</span>
													{`
  `}
													<span className='text-[#79B8FF]'>"Precision"</span>
													<span className='text-gray-300'>: </span>
													<span className='text-[#9ECBFF]'>"int4"</span>
													<span className='text-gray-300'>,</span>
													{`
  `}
													<span className='text-[#79B8FF]'>"Download Size"</span>
													<span className='text-gray-300'>: </span>
													<span className='text-[#9ECBFF]'>"1,167 MiB"</span>
													<span className='text-gray-300'>,</span>
													{`
  `}
													<span className='text-[#79B8FF]'>"Memory Usage"</span>
													<span className='text-gray-300'>: </span>
													<span className='text-[#9ECBFF]'>"2,002 MiB"</span>
													<span className='text-gray-300'>,</span>
													{`
  `}
													<span className='text-[#79B8FF]'>"Download Link"</span>
													<span className='text-gray-300'>: </span>
													<span className='text-[#9ECBFF]'>"Download"</span>
													{`
}`}
												</pre>
											</div>
										</div>
									</div>

									{/* XML Query
									<div className='space-y-3'>
										<div className='flex items-center text-gray-400'>
											<span className='text-[#27C93F]'>user@moondream</span>
											<span className='mx-2 text-gray-600'>$</span>
											<span className='text-gray-300'>/query: Give me the last row in XML, wrapped in a "row" element</span>
										</div>
										<div className='pl-6'>
											<div className='text-gray-500 text-sm mb-2'>Selected image:</div>
											<div className='flex justify-center my-4'>
												<img src="github-markdown.webp" alt="Processing"/>
											</div>
											<div className='text-blue-400'>response:</div>
											<div className='mt-2 text-[#E4E4E4] bg-black/20 p-4 rounded-lg'>
												<pre className='text-sm whitespace-pre'>{`<`}<span className='text-[#85E89D]'>model</span>{`>
  <`}<span className='text-[#85E89D]'>name</span>{`>`}<span className='text-gray-300'>Moondream 0.5B</span>{`</`}<span className='text-[#85E89D]'>name</span>{`>
  <`}<span className='text-[#85E89D]'>precision</span>{`>`}<span className='text-gray-300'>int4</span>{`</`}<span className='text-[#85E89D]'>precision</span>{`>
  <`}<span className='text-[#85E89D]'>download_size</span>{`>`}<span className='text-gray-300'>422 MiB</span>{`</`}<span className='text-[#85E89D]'>download_size</span>{`>
  <`}<span className='text-[#85E89D]'>memory_usage</span>{`>`}<span className='text-gray-300'>816 MiB</span>{`</`}<span className='text-[#85E89D]'>memory_usage</span>{`>
  <`}<span className='text-[#85E89D]'>download_link</span>{`>`}<span className='text-gray-300'>Download</span>{`</`}<span className='text-[#85E89D]'>download_link</span>{`>
</`}<span className='text-[#85E89D]'>model</span>{`>`}</pre>
											</div>
										</div>
									</div> */}

									{/* Table Query
									<div className='space-y-3'>
										<div className='flex items-center text-gray-400'>
											<span className='text-[#27C93F]'>user@moondream</span>
											<span className='mx-2 text-gray-600'>$</span>
											<span className='text-gray-300'>/query: The Pharmacy Times Journal, Circulation and Comments, in Markdown.</span>
										</div>
										<div className='pl-6'>
											<div className='text-gray-500 text-sm mb-2'>Selected image:</div>
											<div className='flex justify-center my-4'>
												<img src="pharma-table.png" alt="Processing"/>
											</div>
											<div className='text-blue-400'>response:</div>
											<div className='mt-2 text-[#E4E4E4] bg-black/20 p-4 rounded-lg'>
												<pre className='text-sm whitespace-pre'><span className='text-[#79B8FF]'>| Journal | Circulation | Comments |</span>{`
`}<span className='text-[#79B8FF]'>|---|---|---|</span>{`
`}<span className='text-gray-300'>| Pharmacy Times | 100,000 | Monthly |</span></pre>
											</div>
										</div>
									</div> */}

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

				{/* Light Mode Query Interface */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Light Mode Interface</h2>

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
											<span className='text-gray-800'>/query: Give me the Moondream 2B int4 row in JSON</span>
										</div>
										<div className='pl-6'>
											<div className='text-gray-500 text-sm mb-2'>Selected image:</div>
											<div className='flex justify-center my-4'>
												<img src='/github-markdown.webp' alt='Processing' />
											</div>
											<div className='text-blue-600'>response:</div>
											<div className='mt-2 bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
												<pre className='text-sm whitespace-pre'>
													{`{
  `}
													<span className='text-[#0550ae]'>"Model"</span>
													<span className='text-gray-800'>: </span>
													<span className='text-[#1a7f37]'>"Moondream 2B"</span>
													<span className='text-gray-800'>,</span>
													{`
  `}
													<span className='text-[#0550ae]'>"Precision"</span>
													<span className='text-gray-800'>: </span>
													<span className='text-[#1a7f37]'>"int4"</span>
													<span className='text-gray-800'>,</span>
													{`
  `}
													<span className='text-[#0550ae]'>"Download Size"</span>
													<span className='text-gray-800'>: </span>
													<span className='text-[#1a7f37]'>"1,167 MiB"</span>
													<span className='text-gray-800'>,</span>
													{`
  `}
													<span className='text-[#0550ae]'>"Memory Usage"</span>
													<span className='text-gray-800'>: </span>
													<span className='text-[#1a7f37]'>"2,002 MiB"</span>
													<span className='text-gray-800'>,</span>
													{`
  `}
													<span className='text-[#0550ae]'>"Download Link"</span>
													<span className='text-gray-800'>: </span>
													<span className='text-[#1a7f37]'>"Download"</span>
													{`
}`}
												</pre>
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

				{/* Apple-style Minimal Interface */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface</h2>

							<div className='bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#eaeaea] p-8'>
								{/* Query */}
								<div className='space-y-8'>
									<div className='space-y-3'>
										<div className='text-sm text-gray-500 font-geist'>Query</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>Give me the Moondream 2B int4 row in JSON</div>
									</div>

									{/* Image */}
									<div className='space-y-3'>
										<div className='text-sm text-gray-500 font-geist'>Input Image</div>
										<div className='flex justify-center bg-[#fafafa] rounded-lg p-6'>
											<img src='github-markdown.webp' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-3'>
										<div className='text-sm text-gray-500 font-geist'>Response</div>
										<div className='bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>
												{`{
  `}
												<span className='text-[#0550ae]'>"Model"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Moondream 2B"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Precision"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"int4"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Size"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"1,167 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Memory Usage"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"2,002 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Link"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Download"</span>
												{`
}`}
											</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 2 - Softer, More Rounded */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Soft</h2>

							<div className='bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#eaeaea] p-10'>
								{/* Query */}
								<div className='space-y-10'>
									<div className='space-y-2.5'>
										<div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Query</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>Give me the Moondream 2B int4 row in JSON</div>
									</div>

									{/* Image */}
									<div className='space-y-2.5'>
										<div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Input Image</div>
										<div className='flex justify-center bg-[#fcfcfc] rounded-2xl p-8 border border-[#f0f0f0]'>
											<img src='github-markdown.webp' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2.5'>
										<div className='text-[13px] text-gray-400 font-geist uppercase tracking-wider'>Response</div>
										<div className='bg-[#f8f9fa] p-4 rounded-lg border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>
												{`{
  `}
												<span className='text-[#0550ae]'>"Model"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Moondream 2B"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Precision"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"int4"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Size"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"1,167 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Memory Usage"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"2,002 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Link"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Download"</span>
												{`
}`}
											</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 3 - More Compact, Sharp */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>

							<div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
								{/* Query */}
								<div className='space-y-6'>
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>Give me the Moondream 2B int4 row in JSON</div>
									</div>

									{/* Image */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
										<div className='flex justify-center bg-[#fafafa] p-4'>
											<img src='github-markdown.webp' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
										<div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>
												{`{
  `}
												<span className='text-[#0550ae]'>"Model"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Moondream 2B"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Precision"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"int4"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Size"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"1,167 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Memory Usage"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"2,002 MiB"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"Download Link"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Download"</span>
												{`
}`}
											</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 3 - More Compact, Sharp */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>

							<div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
								{/* Query */}
								<div className='space-y-6'>
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>Give me the last row in XML, wrapped in a "row" element</div>
									</div>

									{/* Image */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
										<div className='flex justify-center bg-[#fafafa] p-4'>
											<img src='github-markdown.webp' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
										<div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>
												{`<`}
												<span className='text-[#0550ae]'>row</span>
												{`>
  <`}
												<span className='text-[#0550ae]'>model</span>
												{`>`}
												<span className='text-[#1a7f37]'>Moondream 0.5B</span>
												{`</`}
												<span className='text-[#0550ae]'>model</span>
												{`>
  <`}
												<span className='text-[#0550ae]'>precision</span>
												{`>`}
												<span className='text-[#1a7f37]'>int4</span>
												{`</`}
												<span className='text-[#0550ae]'>precision</span>
												{`>
  <`}
												<span className='text-[#0550ae]'>downloadSize</span>
												{`>`}
												<span className='text-[#1a7f37]'>422 MiB</span>
												{`</`}
												<span className='text-[#0550ae]'>downloadSize</span>
												{`>
  <`}
												<span className='text-[#0550ae]'>memoryUsage</span>
												{`>`}
												<span className='text-[#1a7f37]'>816 MiB</span>
												{`</`}
												<span className='text-[#0550ae]'>memoryUsage</span>
												{`>
  <`}
												<span className='text-[#0550ae]'>downloadLink</span>
												{`>`}
												<span className='text-[#1a7f37]'>Download</span>
												{`</`}
												<span className='text-[#0550ae]'>downloadLink</span>
												{`>
</`}
												<span className='text-[#0550ae]'>row</span>
												{`>`}
											</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 3 - More Compact, Sharp */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>

							<div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
								{/* Query */}
								<div className='space-y-6'>
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>What is the slogan on the billboard? In JSON, with keys text, description, and company.</div>
									</div>

									{/* Image */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
										<div className='flex justify-center bg-[#fafafa] p-4'>
											<img src='chickn.png' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
										<div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>
												{`{
  `}
												<span className='text-[#0550ae]'>"text"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"EAT MOR CHIKIN"</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"description"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"The slogan is written in a stylized, graffiti-like font."</span>
												<span className='text-gray-800'>,</span>
												{`
  `}
												<span className='text-[#0550ae]'>"company"</span>
												<span className='text-gray-800'>: </span>
												<span className='text-[#1a7f37]'>"Chick-fil-A"</span>
												{`
}`}
											</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 3 - More Compact, Sharp */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>

							<div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
								{/* Query */}
								<div className='space-y-6'>
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>Cyberpunk 2077&apos;s RTX 5090 performance?</div>
									</div>

									{/* Image */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
										<div className='flex justify-center bg-[#fafafa] p-4'>
											<img src='gpus.png' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
										<div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'>33</pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Minimal Interface Variation 3 - More Compact, Sharp */}
				<motion.div
					initial='hidden'
					animate='visible'
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
					}}
					className='mt-8 mb-16 w-full'
				>
					<div className='bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)] overflow-hidden border border-[#eaeaea] p-6'>
						<div className='max-w-3xl mx-auto'>
							<h2 className='text-2xl font-semibold mb-8 font-geist text-center tracking-tight'>Minimal Interface - Sharp</h2>

							<div className='bg-[#FFFFFF] rounded-none overflow-hidden border border-[#eaeaea] p-6'>
								{/* Query */}
								<div className='space-y-6'>
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>QUERY</div>
										<div className='text-[15px] text-gray-900 font-geist tracking-tight'>The Pharmacy Times Journal, circulation and comments, in markdown.</div>
									</div>

									{/* Image */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>INPUT IMAGE</div>
										<div className='flex justify-center bg-[#fafafa] p-4'>
											<img src='pharma-table.png' alt='Processing' />
										</div>
									</div>

									{/* Response */}
									<div className='space-y-2'>
										<div className='text-[12px] text-gray-500 font-geist font-medium'>RESPONSE</div>
										<div className='bg-[#f8f9fa] p-4 border border-[#eaeaea]'>
											<pre className='text-[13px] leading-6 whitespace-pre'><span className='text-[#0550ae]'>| Journal | Circulation | Comments |</span>{`
`}<span className='text-[#0550ae]'>|---|---|---|</span>{`
`}<span className='text-[#1a7f37]'>| Pharmacy Times | 100,000 | Monthly |</span></pre>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

			</main>
			</div>
	);
}