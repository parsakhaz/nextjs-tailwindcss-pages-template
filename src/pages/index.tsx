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

	const modelData = [
		{ metric: 'ChartQA (test_human)', dream: 54.72, dream2: '--', deepseek: 33.2, smolvm: 20.56, pali: 33.68, internvl: 55.92, qwen2b: 57.6 },
		{ metric: 'ChartQA (test_aug)', dream: 88.88, dream2: '--', deepseek: 62.0, smolvm: 35.04, pali: 33.52, internvl: 87.04, qwen2b: 89.2 },
		{ metric: 'ChartQA (overall)', dream: 71.8, dream2: '--', deepseek: 47.6, smolvm: 27.8, pali: 33.6, internvl: 71.48, qwen2b: 73.4 },
		{ metric: 'TextVQA_VAL', dream: 74.25, dream2: '65.20', deepseek: 57.648, smolvm: 70.19, pali: 70.058, internvl: 73.34, qwen2b: 79.93 },
		{ metric: 'DOCVQA_VAL', dream: 76.69996004, dream2: '70.50', deepseek: 35.67743709, smolvm: 68.92187589, pali: 73.87468989, internvl: 86.09877247, qwen2b: 89.15597740 },
		{ metric: 'RealWorldQA', dream: 0.6039215686, dream2: '--', deepseek: 0.5006535948, smolvm: 0.5424836601, pali: 0.5503267974, internvl: 0.5777777778, qwen2b: 0.6235294118 },
	];

	/**
	 * Methodology for Win Rate Calculation:
	 * 1. For each benchmark, rank models from 1 to N
	 * 2. Convert rank to percentile: (N - (rank-1))/N * 100
	 * 3. Average all percentile ranks across benchmarks
	 */
	const calculateWinRate = (modelKey: string) => {
		// Calculate percentile ranks for each benchmark
		const ranks = modelData.map(benchmark => {
			// Get all scores for this benchmark
			const scores = [
				{ model: 'dream', score: Number(benchmark.dream) },
				{ model: 'smolvm', score: Number(benchmark.smolvm) },
				{ model: 'pali', score: Number(benchmark.pali) },
				{ model: 'deepseek', score: Number(benchmark.deepseek) },
				{ model: 'internvl', score: Number(benchmark.internvl) },
				{ model: 'qwen2b', score: Number(benchmark.qwen2b) }
			].filter(s => !isNaN(s.score));

			// Sort by score descending
			scores.sort((a, b) => b.score - a.score);
			
			// Find rank of our model
			const rank = scores.findIndex(s => s.model === modelKey) + 1;
			
			// Convert to percentile
			return (scores.length - (rank - 1)) / scores.length * 100;
		});

		// Return average of all percentile ranks
		return ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length;
	};

	// RAM usage mapping
	const ramUsage: { [key: string]: number } = {
		dream: 4,
		smolvm: 5,
		pali: 7,
		deepseek: 2,
		internvl: 9,
		qwen2b: 14,
	};

	// Generate chart data programmatically
	const chartData = [
		{ name: 'moondream 1.9b', x: -ramUsage.dream, y: calculateWinRate('dream') },
		{ name: 'SmolVLM', x: -ramUsage.smolvm, y: calculateWinRate('smolvm') },
		{ name: 'PaLiGemma 3B', x: -ramUsage.pali, y: calculateWinRate('pali') },
		{ name: 'deepseek 1.3b (actual: 2b)', x: -ramUsage.deepseek, y: calculateWinRate('deepseek') },
		{ name: 'InternVL2 2B', x: -ramUsage.internvl, y: calculateWinRate('internvl') },
		{ name: 'Qwen2B', x: -ramUsage.qwen2b, y: calculateWinRate('qwen2b') },
	];

	// Add curve data points
	const curveData = [
		{ x: 0, y: 0 },
		{ x: -1, y: 20 },
		{ x: -2, y: calculateWinRate('deepseek') },
		{ x: -5, y: calculateWinRate('deepseek') + 10 },
		{ x: -9, y: calculateWinRate('internvl') },
		{ x: -14, y: calculateWinRate('qwen2b') },
		{ x: -16, y: calculateWinRate('qwen2b') },
	];

	// Function to format numbers to 2 decimal places
	const formatNumber = (num: number | string) => (typeof num === 'string' ? num : num.toFixed(2));

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
										domain={[-16, 0]}
										ticks={[-16, -14, -12, -10, -8, -6, -4, -2, 0]}
										tick={{ 
											fontFamily: 'Geist', 
											fontSize: '12px',
											transform: 'translate(0, 0)'
										}}
										tickFormatter={(value) => Math.abs(value).toString()}
										stroke='#666'
									>
										<Label value='RAM Usage (GB)' offset={-10} position='insideBottom' style={{ fontFamily: 'Geist', fontSize: '18px' }} />
										<Label
											value='less is cheaper/faster →'
											position='bottom'
											offset={15}
											style={{
												fontFamily: 'Geist',
												fontSize: '12px',
												fill: '#16a34a',
												opacity: 0.5,
												transform: 'translateY(-20px) translateX(330px)',
											}}
										/>
									</XAxis>
									<YAxis
										type='number'
										dataKey='y'
										name='Win Rate'
										unit='%'
										domain={[0, 90]}
										ticks={[0, 15, 30, 45, 60, 75, 90]}
										tick={{ fontFamily: 'Geist', fontSize: '12px' }}
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
										<Label value='Win Rate (%)' angle={-90} position='insideLeft' offset={5} style={{ fontFamily: 'Geist', fontSize: '18px' }} />
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
														<p className='text-xs text-gray-600'>Win Rate: {data.y.toFixed(1)}%</p>
													</div>
												);
											}
											return null;
										}}
									/>
									<defs>
										<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#93c5fd" stopOpacity={0.2}/>
											<stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1}/>
										</linearGradient>
									</defs>

									<Area
										type="monotone"
										dataKey="y"
										data={curveData}
										stroke="none"
										fill="url(#colorUv)"
										fillOpacity={1}
										isAnimationActive={false}
									/>

									<Scatter
										name='Models'
										data={chartData}
										fill='#000'
										shape={(props: any) => {
											const { cx, cy, payload } = props;
											if (!cx || !cy || !payload) return null;
											
											// Add moondream logo for the moondream point
											if (payload.name === 'moondream 1.9b') {
												return (
													<g>
														<image
															href="/moondream-nobg.png"
															x={cx - 25}
															y={cy - 75}
															width={50}
															height={50}
															opacity={1}
														/>
														<circle cx={cx} cy={cy} r={3} fill='#000' />
														<text x={cx} y={cy} dy={-10} textAnchor='middle' className='font-geist' style={{ fontSize: '12px', fill: '#000' }}>
															{payload.name}
														</text>
													</g>
												);
											}
											
											return (
												<g>
													<circle cx={cx} cy={cy} r={3} fill='#000' />
													<text x={cx} y={cy} dy={-10} textAnchor='middle' className='font-geist' style={{ fontSize: '12px', fill: '#000' }}>
														{payload.name}
													</text>
												</g>
											);
										}}
									/>
								</ComposedChart>
							</ResponsiveContainer>
							<div className='absolute left-36 top-[400px] transform -translate-y-1/2 bg-white/95 p-4 rounded-lg border border-[#eaeaea] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_6px_rgba(0,0,0,0.03)]'>
								<p className='text-sm font-medium font-geist mb-2 tracking-tight'>Win Rate Methodology</p>
								<p className='text-xs text-gray-600 font-geist leading-relaxed'>
									For each benchmark:<br />
									1. Rank models by score<br />
									2. Convert to percentile (0-100%)<br />
									3. Average all percentiles
								</p>
								<p className='text-[11px] text-gray-400 font-geist mt-2 leading-relaxed'>
									Methodology from SmolVLM @AndiMarafioti
								</p>
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
											<div className='text-[13px] tracking-tight'>Benchmark</div>
											<div className='text-xs text-gray-500 font-normal mt-0.5'>RAM Usage (GB)</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-slate-50/80 font-geist border-r border-[#eaeaea] border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20'>
											<div className='flex flex-col'>
												<div className='text-[10px] text-red-500 font-medium -mb-1'>New</div>
												<div className='flex flex-col'>
													<span className='text-[13px] tracking-tight'>moondream2-</span>
													<span className='text-[13px] tracking-tight'>2025-01-08</span>
													<span className='text-xs text-gray-500 font-normal mt-0.5'>4 GB</span>
												</div>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col pt-[18px]'>
												<span className='text-[13px] tracking-tight'>moondream2-</span>
												<span className='text-[13px] tracking-tight'>2025-08-26</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>--</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>deepseek 1.3b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>2 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>SmolVLM 1.7b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>5 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>Paligemma-3b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>7 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist border-r border-[#eaeaea]'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>InternVL2-2b</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>9 GB</span>
											</div>
										</th>
										<th className='px-4 py-3 text-left font-semibold text-black bg-white font-geist'>
											<div className='flex flex-col'>
												<span className='text-[13px] tracking-tight'>Qwen2b Instruct</span>
												<span className='text-xs text-gray-500 font-normal mt-0.5'>14 GB</span>
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
											<td className="px-4 py-3 whitespace-nowrap font-medium text-[13px] text-black font-geist tracking-tight">{row.metric}</td>
											<td className={`
												px-4 py-3 text-left text-[13px] text-black font-mono
												bg-slate-50/80
												border-l-2 border-r-2 border-l-gray-600/20 border-r-gray-600/20
											`}>{formatNumber(row.dream)}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{row.dream2}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{formatNumber(row.deepseek)}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{formatNumber(row.smolvm)}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{formatNumber(row.pali)}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{formatNumber(row.internvl)}</td>
											<td className="px-4 py-3 text-left text-[13px] text-black font-mono">{formatNumber(row.qwen2b)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);
}
