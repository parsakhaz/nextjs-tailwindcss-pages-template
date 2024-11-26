import Head from 'next/head';
import { motion } from 'framer-motion';
import DocsLayout from '@/components/DocsLayout';
import { DocsSidebar } from '@/components/DocsSidebar';
import { useComponents } from '@/context/ComponentsContext';
import { demos } from '@/components/demos';
import { ConfigEditor } from '@/components/ConfigEditor';
import { useState } from 'react';

const getConfigId = (title: string): 'terminal' | 'codeEditor' | 'commandPalette' | 'notificationStack' => {
	console.log('Component Title:', title);
	
	const mapping: Record<string, 'terminal' | 'codeEditor' | 'commandPalette' | 'notificationStack'> = {
		'Terminal Animation': 'terminal',
		'Animated Code Editor': 'codeEditor',
		'Command Palette': 'commandPalette',
		'Notification Stack': 'notificationStack'
	};
	
	const configId = mapping[title];
	if (!configId) {
		console.warn(`No config mapping found for component: ${title}`);
	}
	return configId;
};

export default function Home() {
	const { activeComponents } = useComponents();
	const [resetKey, setResetKey] = useState(0);

	return (
		<>
			<Head>
				<title>Moondream Video Component Library</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='description' content='A collection of animated UI components for video production' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<DocsLayout
				sidebar={<DocsSidebar currentPath="/" />}
				main={
					<div>
						<div className="flex flex-col items-center">
							{demos.map((Component, index) => (
								activeComponents[Component.title] ? (
									<motion.section
										key={`${index}-${resetKey}`}
										className="mb-32 last:mb-0 w-full max-w-4xl"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6 }}
									>
										<div className="text-center mb-12">
											<div className="flex items-center justify-center space-x-4 mb-4">
												<h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
													{Component.title}
												</h2>
												<ConfigEditor componentId={getConfigId(Component.title)} />
											</div>
											<div className="w-20 h-1 bg-white/20 mx-auto rounded-full" />
										</div>

										<Component key={resetKey} />
									</motion.section>
								) : null
							))}
						</div>
					</div>
				}
			/>
		</>
	);
}
