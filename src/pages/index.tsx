import { useState, useRef } from 'react';
import Head from 'next/head';
import { Button } from '../components/ui/button';
import { themes, createSVG } from '../lib/diff-generator';
import { toPng } from 'html-to-image';

export default function Home() {
	const svgRef = useRef<HTMLDivElement>(null);
	const [oldCode, setOldCode] = useState('');
	const [newCode, setNewCode] = useState('');
	const [filename, setFilename] = useState('example.py');
	const [lightSVG, setLightSVG] = useState('');
	const [darkSVG, setDarkSVG] = useState('');
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	const generateDiff = () => {
		const diffData = {
			filename,
			oldLines: oldCode.split('\n'),
			newLines: newCode.split('\n')
		};

		const lightResult = createSVG('light', diffData);
		const darkResult = createSVG('dark', diffData);

		setLightSVG(lightResult);
		setDarkSVG(darkResult);
	};

	const downloadSVG = (svg: string, theme: string) => {
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `diff-${theme}.svg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const downloadPNG = async () => {
		if (!svgRef.current) return;

		try {
			const dataUrl = await toPng(svgRef.current, {
				quality: 1.0,
				pixelRatio: 3,
				backgroundColor: theme === 'light' ? '#ffffff' : '#0d1117'
			});

			const link = document.createElement('a');
			link.download = `diff-${theme}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error('Error generating PNG:', err);
		}
	};

	return (
		<>
			<Head>
				<title>Python Diff Generator</title>
				<meta name="description" content="Generate beautiful SVG diffs for your Python code" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<main className="container mx-auto px-4 py-8">
					<h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
						Python Diff Generator
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Original Code
							</label>
							<textarea
								className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 dark:text-white"
								value={oldCode}
								onChange={(e) => setOldCode(e.target.value)}
								placeholder="Paste your original Python code here..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Modified Code
							</label>
							<textarea
								className="w-full h-64 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 dark:text-white"
								value={newCode}
								onChange={(e) => setNewCode(e.target.value)}
								placeholder="Paste your modified Python code here..."
							/>
						</div>
					</div>

					<div className="flex justify-center gap-4 mb-8">
						<input
							type="text"
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
							placeholder="Filename (e.g. example.py)"
							className="px-4 py-2 border rounded-lg"
						/>
						<Button onClick={generateDiff}>
							Generate Diff
						</Button>
					</div>

					{(lightSVG || darkSVG) && (
						<div className="space-y-8">
							<div className="flex justify-center gap-4 mb-4">
								<Button onClick={() => setTheme('light')}>Light Theme</Button>
								<Button onClick={() => setTheme('dark')}>Dark Theme</Button>
							</div>

							<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
								<div className="mb-4 flex justify-end gap-4">
									<Button
										onClick={() => downloadSVG(theme === 'light' ? lightSVG : darkSVG, theme)}
									>
										Download SVG
									</Button>
									<Button onClick={downloadPNG}>
										Download PNG
									</Button>
								</div>

								<div 
									ref={svgRef}
									dangerouslySetInnerHTML={{ 
										__html: theme === 'light' ? lightSVG : darkSVG 
									}} 
									className="w-full overflow-x-auto"
								/>
							</div>
						</div>
					)}
				</main>
			</div>
		</>
	);
}
