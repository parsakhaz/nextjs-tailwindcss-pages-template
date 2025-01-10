// Import Statements
import Head from 'next/head';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RoughNotation } from 'react-rough-notation';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer, Area } from 'recharts';

// Home Component
export default function Home() {
	const { ref: tableRef, inView: tableInView } = useInView({ triggerOnce: true });
	const { ref: chartRef, inView: chartInView } = useInView({ triggerOnce: true });

	interface ModelData {
		metric: string;
		dream: number | string;
		deepseek: number;
		smolvm: number;
		pali: number;
		internvl: number;
		qwen2b: number;
		[key: string]: number | string;
	}

	const modelData: ModelData[] = [
		{ metric: 'Average', dream: 73.1, deepseek: 58.6, internvl: 70.7, smolvm: 63.8, pali: 65.8, qwen2b: 76.7 },
		{ metric: 'ChartQA', dream: 72.2, deepseek: 47.6, internvl: 71.5, smolvm: 27.8, pali: 33.6, qwen2b: 73.4 },
		{ metric: 'TextVQA', dream: 73.4, deepseek: 57.7, internvl: 73.3, smolvm: 70.2, pali: 70.1, qwen2b: 79.9 },
		{ metric: 'DocVQA', dream: 75.9, deepseek: 35.7, internvl: 86.1, smolvm: 68.9, pali: 73.9, qwen2b: 89.2 },
		{ metric: 'RealWorldQA', dream: 0.6, deepseek: 0.5, internvl: 0.6, smolvm: 0.5, pali: 0.6, qwen2b: 0.6 },
		{ metric: 'CountBenchQA', dream: 0.8, deepseek: 0.8, internvl: 0.6, smolvm: 0.8, pali: 0.8, qwen2b: 0.8 },
		{ metric: 'TallyQA', dream: 0.8, deepseek: 0.7, internvl: 0.7, smolvm: 0.7, pali: 0.8, qwen2b: 0.8 },
		{ metric: 'POPE', dream: 89.8, deepseek: 85.8, internvl: 85.3, smolvm: 84.0, pali: 87.5, qwen2b: 88.0 },
		{ metric: 'SeedBench2+', dream: 55.7, deepseek: 43.7, internvl: 59.9, smolvm: 57.2, pali: 49.8, qwen2b: 61.2 }
	];

	/**
	 * Benchmark Score Calculation:
	 * 1. Scale 0-1 range benchmarks by 100x to match other benchmarks
	 * 2. Average all benchmark scores
	 */
	const calculateBenchmarkScore = (model: string) => {
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
				// Scale benchmarks that are in 0-1 range by 100x to match other benchmarks
				if (row.metric === 'RealWorldQA' || row.metric === 'CountBenchQA' || row.metric === 'TallyQA') {
					return value * 100;
				}
				return value;
			}).filter(score => score > 0);
		
		// Average all scores
		return scores.reduce((sum, score) => sum + score, 0) / scores.length;
	};

	// RAM usage mapping
	const ramUsage = {
		dream: 4.4,      // Moondream
		qwen2b: 7.3,     // QWEN
		smolvm: 5.9,     // smolvlm
		deepseek: 5.1,   // deepseek
		pali: 6.5,       // paligemma
		internvl: 5.8,   // InternVL2-2B
	};

	// Generate chart data programmatically
	const chartData = [
		{ name: 'moondream 1.9b', x: ramUsage.dream, y: calculateBenchmarkScore('dream') },
		{ name: 'SmolVLM 2b', x: ramUsage.smolvm, y: calculateBenchmarkScore('smolvm') },
		{ name: 'PaLiGemma 3b', x: ramUsage.pali, y: calculateBenchmarkScore('pali') },
		{ name: 'deepseek 1.3b (actual: 2b)', x: ramUsage.deepseek, y: calculateBenchmarkScore('deepseek') },
		{ name: 'InternVL2 2b', x: ramUsage.internvl, y: calculateBenchmarkScore('internvl') },
		{ name: 'Qwen2b Instruct', x: ramUsage.qwen2b, y: calculateBenchmarkScore('qwen2b') },
	];

	// Add curve data points
	const curveData = [
		{ x: 4, y: 50 },  // 2GB, 50%
		{ x: 5.1, y: calculateBenchmarkScore('deepseek') },  // deepseek 1.3b
		{ x: 5.8, y: calculateBenchmarkScore('internvl') },  // internvl2
		{ x: 7.3, y: calculateBenchmarkScore('qwen2b') },   // qwen2b
		{ x: 8, y: 80 }, // 8GB, 80%
	];

	// Function to format numbers to 1 decimal place
	const formatNumber = (num: number | string, metric: string) => {
		if (typeof num === 'string') return num;
		// Convert 0-1 range to percentage for specific benchmarks
		if (metric === 'RealWorldQA' || metric === 'CountBenchQA' || metric === 'TallyQA') {
			return (num * 100).toFixed(1);
		}
		return num.toFixed(1);
	};

	interface ScatterProps {
		cx: number;
		cy: number;
		payload: {
			name: string;
			x: number;
			y: number;
		};
	}

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
		<div className='min-h-screen bg-[#fafaf8]'>
			<Head>
				<title>Model Comparison</title>
				<meta name='description' content='AI Model Comparison Table' />
			</Head>

			<main className='container mx-auto px-4 py-16'>
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
										domain={[4, 8]}
										ticks={[4, 5, 6, 7, 8]}
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
										content={({ payload }) => {
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
									<defs>
										<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
											<stop offset='5%' stopColor='#93c5fd' stopOpacity={0.2} />
											<stop offset='95%' stopColor='#93c5fd' stopOpacity={0.1} />
										</linearGradient>
									</defs>

									<Area type='monotone' dataKey='y' data={curveData} stroke='none' fill='url(#colorUv)' fillOpacity={1} isAnimationActive={false} />

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
										<th className='px-4 py-3 text-left font-semibold text-black bg-slate-50/80 font-geist border-r border-[#eaeaea] border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20'>
											<div className='flex flex-col'>
												<div className='text-[10px] text-red-500 font-medium -mb-1'>New</div>
												<span className='text-[13px] tracking-tight'>moondream 1.9b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>4.4 GB</span>
											</div>
										</th>
										
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>InternVL2 2b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>5.8 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>SmolVLM 2b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>5.9 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>PaLiGemma 3b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>6.5 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>Qwen2b Instruct</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>7.3 GB</span>
											</div>
										</th>
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
											<td className={`px-4 py-3 text-left text-[13px] text-black font-mono bg-slate-50/80 border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20 ${row.metric === 'Average' ? 'font-bold' : ''}`}>{formatNumber(row.dream, row.metric)}</td>
											<td className={`px-4 py-3 text-left text-[13px] text-black font-mono ${row.metric === 'Average' ? 'font-bold' : ''}`}>{formatNumber(row.internvl, row.metric)}</td>
											<td className={`px-4 py-3 text-left text-[13px] text-black font-mono ${row.metric === 'Average' ? 'font-bold' : ''}`}>{formatNumber(row.smolvm, row.metric)}</td>
											<td className={`px-4 py-3 text-left text-[13px] text-black font-mono ${row.metric === 'Average' ? 'font-bold' : ''}`}>{formatNumber(row.pali, row.metric)}</td>
											<td className={`px-4 py-3 text-left text-[13px] text-black font-mono ${row.metric === 'Average' ? 'font-bold' : ''}`}>{formatNumber(row.qwen2b, row.metric)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</motion.div>

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
