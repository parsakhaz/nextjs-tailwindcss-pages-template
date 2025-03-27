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
import QueryInterface from '../components/QueryInterface';
import { useState } from 'react';

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

	// State to track active interface style
	const [interfaceStyle, setInterfaceStyle] = useState<'terminal' | 'light' | 'minimal' | 'soft' | 'sharp'>('sharp');

	return (
		<div className='min-h-screen bg-[#fafaf8]'>
			<Head>
				<title>Model Comparison</title>
				<meta name='description' content='AI Model Comparison Table' />
			</Head>

			<main className='container mx-auto px-4 py-16'>
				<ModelVisualization modelData={modelData} modelConfig={modelConfig} />
				<BenchmarkTable modelData={modelData} modelConfig={modelConfig} />

				{/* Interface Style Selector */}
				<div className='mt-16 mb-6 max-w-3xl mx-auto'>
					<h2 className='text-2xl font-semibold mb-4 font-geist text-center tracking-tight'>Interface Styles</h2>
					<div className='flex flex-wrap justify-center gap-3'>
						<Button 
							variant={interfaceStyle === 'terminal' ? 'default' : 'outline'} 
							onClick={() => setInterfaceStyle('terminal')}
						>
							Terminal
						</Button>
						<Button 
							variant={interfaceStyle === 'light' ? 'default' : 'outline'} 
							onClick={() => setInterfaceStyle('light')}
						>
							Light
						</Button>
						<Button 
							variant={interfaceStyle === 'minimal' ? 'default' : 'outline'} 
							onClick={() => setInterfaceStyle('minimal')}
						>
							Minimal
						</Button>
						<Button 
							variant={interfaceStyle === 'soft' ? 'default' : 'outline'} 
							onClick={() => setInterfaceStyle('soft')}
						>
							Soft
						</Button>
						<Button 
							variant={interfaceStyle === 'sharp' ? 'default' : 'outline'} 
							onClick={() => setInterfaceStyle('sharp')}
						>
							Sharp
						</Button>
					</div>
				</div>

				{/* Interactive Query Interface */}
				<QueryInterface 
					style={interfaceStyle}
					defaultQuery="Give me the Moondream 2B int4 row in JSON"
					defaultImageSrc="/github-markdown.webp"
					defaultResponse={`{
  "Model": "Moondream 2B",
  "Precision": "int4", 
  "Download Size": "1,167 MiB",
  "Memory Usage": "2,002 MiB",
  "Download Link": "Download"
}`}
				/>
			</main>
		</div>
	);
}