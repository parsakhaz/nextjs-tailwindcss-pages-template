// Import Statements
import Head from 'next/head';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RoughNotation } from 'react-rough-notation';

// Home Component
export default function Home() {
	const { ref: headerRef, inView: headerInView } = useInView({ triggerOnce: true });
	const { ref: mainContentRef, inView: mainContentInView } = useInView({ triggerOnce: true });
	const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true });
	const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true });
	const { ref: footerRef, inView: footerInView } = useInView({ triggerOnce: true });

	const fadeInVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 4 } },
	};

	return (
		<>
			<Head>
				<title>Next.js Template - Build Powerful Web Applications | Your Project Name</title>
				<meta
					name='description'
					content='Accelerate your web development with our powerful Next.js template. Build scalable, efficient, and SEO-friendly applications quickly and easily.'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
				<link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />
				<meta property='og:title' content='Next.js Template - Build Powerful Web Applications | Your Project Name' />
				<meta
					property='og:description'
					content='Accelerate your web development with our powerful Next.js template. Build scalable, efficient, and SEO-friendly applications quickly and easily.'
				/>
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://yourproject.com' />
				<meta property='og:image' content='https://yourproject.com/og-image.jpg' />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content='Next.js Template - Build Powerful Web Applications | Your Project Name' />
				<meta
					name='twitter:description'
					content='Accelerate your web development with our powerful Next.js template. Build scalable, efficient, and SEO-friendly applications quickly and easily.'
				/>
				<meta name='twitter:image' content='https://yourproject.com/twitter-image.jpg' />
			</Head>

			<div className='min-h-screen flex flex-col bg-black text-white'>
				{/* Header */}
				<motion.header
					ref={headerRef}
					initial='hidden'
					animate={headerInView ? 'visible' : 'hidden'}
					variants={fadeInVariants}
					className='w-full py-8 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4'
				>
					<div className='hidden md:flex justify-center md:justify-start'>
						<Link href='/' aria-label='Home'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='80'
								height='50'
								viewBox='0 0 24 24'
								fill='none'
								stroke='#FFFFFF'
								strokeWidth='1'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'
							>
								<circle cx='12' cy='12' r='3'></circle>
								<path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
							</svg>
						</Link>
					</div>
					<div className='flex justify-center items-center'>
						<Link href='#' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-300 flex items-center'>
							<span className='hidden md:inline'>@yourproject</span>
							<span className='md:hidden'>@yourproject</span>
						</Link>
					</div>
					<div className='flex justify-center md:justify-end'>
						<Button className='px-4 py-2 md:px-8 md:py-4 bg-white outline outline-1 text-black rounded-full text-l md:text-xl hover:bg-white hover:text-black font-semilight'>
							<Link href='#' target='_blank' rel='noopener noreferrer' className='text-black font-flyhead'>
								CONTACT US
							</Link>
						</Button>
					</div>
				</motion.header>

				{/* Main Content */}
				<motion.main
					ref={mainContentRef}
					initial='hidden'
					animate={mainContentInView ? 'visible' : 'hidden'}
					variants={fadeInVariants}
					className='flex flex-col px-4 items-center justify-center w-full max-w-xl md:max-w-4xl py-8 pb-48 font-medium mx-auto'
				>
					<div className='relative w-full max-w-full md:max-w-4xl bg-black rounded-lg shadow-lg py-32'>
						<div className='py-16'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='150'
								height='150'
								viewBox='0 0 24 24'
								fill='none'
								stroke='#FFFFFF'
								strokeWidth='1'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='mx-auto'
								aria-hidden='true'
							>
								<circle cx='12' cy='12' r='3'></circle>
								<path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
							</svg>
						</div>
						<div className='text-center'>
							<h1 className='px-4 font-poppins text-3xl md:text-4xl text-medium text-center !leading-relaxed text-white'>
								Your Next.js <span className='text-[#0096f8] font-bold'>Template</span>: Build with <span className='text-[#0096f8] font-bold'>Confidence</span>
							</h1>
							<Link href='#'>
								<Button className='px-8 py-4 bg-black outline outline-1 md:py-8 md:px-16 text-white rounded-full text-md md:text-xl font-medium hover:bg-white hover:text-black font-flyhead mt-8'>
									GET STARTED
								</Button>
							</Link>
						</div>
					</div>
				</motion.main>

				{/* Features Section */}
				<motion.div
					ref={featuresRef}
					initial='hidden'
					animate={featuresInView ? 'visible' : 'hidden'}
					variants={fadeInVariants}
					className='flex flex-col md:flex-row items-start justify-center md:space-x-12 max-w-2xl px-8 py-8 md:max-w-6xl mx-auto text-gray-200'
				>
					<div className='flex-1 flex flex-col font-light text-lg items-center justify-center space-y-6 max-w-sm md:max-w-2xl'>
						<h2 className='text-3xl font-bold font-flyhead-bold text-[#0096f8]'>Key Features</h2>
						<p>Our Next.js template offers a range of powerful features to accelerate your development process.</p>
						<p className='font-bold text-[#0096f8]'>Leverage our proven systems and processes to build scalable and efficient web applications.</p>
						<p>
							With our template, you can <strong className='text-[#0096f8] font-bold'>QUICKLY</strong> create robust and performant websites, focusing on what matters most - your
							unique content and functionality.
						</p>
					</div>
				</motion.div>

				{/* CTA Section */}
				<motion.div
					ref={ctaRef}
					initial='hidden'
					animate={ctaInView ? 'visible' : 'hidden'}
					variants={fadeInVariants}
					className='relative flex flex-col items-center justify-center min-h-[30rem] py-12 bg-black overflow-hidden'
				>
					<h2 className='px-4 font-poppins text-3xl text-white mx-auto text-center py-12 font-medium'>Ready to start building your next project?</h2>

					<Button
						className='px-8 py-4 bg-white md:px-16 md:py-8 text-black rounded-full text-md md:text-xl font-bold hover:bg-gray-200 hover:text-black z-10 font-flyhead-bold mt-8 transition duration-300'
						onClick={() => window.open('#', '_blank')}
					>
						GET STARTED
					</Button>
				</motion.div>

				{/* Footer */}
				<motion.footer ref={footerRef} initial='hidden' animate={footerInView ? 'visible' : 'hidden'} variants={fadeInVariants} className='w-full py-4 text-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='40'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#FFFFFF'
						strokeWidth='1'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='mx-auto py-4'
						aria-hidden='true'
					>
						<circle cx='12' cy='12' r='3'></circle>
						<path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
					</svg>

					<p className='py-1 text-sm text-white font-medium font-poppins'>contact@yourproject.com</p>
					<p className='py-1 text-sm text-gray-600 italic'>&copy; {new Date().getFullYear()} Your Project Name. All rights reserved.</p>
				</motion.footer>
			</div>
		</>
	);
}
