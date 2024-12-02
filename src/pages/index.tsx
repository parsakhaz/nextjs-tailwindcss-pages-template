import Head from 'next/head';
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Configuration for the Moondream demo
 */
const defaultConfig = {
  interactiveTypewriter: {
    categories: [
      {
        id: "detection",
        name: "Object Detection",
		items: [
			{ 
			  id: "cars",
			  display: "Find all cars",
			  command: "detect: car",
			  initialSrc: "/vehicles.mp4",
			  resultSrc: "/cars_detect.mp4"
			},
			{ 
			  id: "trucks",
			  display: "Locate all trucks",
			  command: "detect: truck",
			  initialSrc: "/vehicles.mp4",
			  resultSrc: "/trucks_detect.mp4"
			},
		  ]
      },
      {
        id: "vqa",
        name: "Visual Q&A",
        items: [
          { 
            id: "1",
            display: "What color is the cyclist in the front?",
            command: "The cyclist in the front is wearing blue.",
            initialSrc: "@cyclist.jpg",
            resultSrc: "@cyclist.jpg"
          },
          { 
            id: "2",
            display: "How many cyclists are there?",
            command: "There are four cyclists in the image.",
            initialSrc: "@cyclist.jpg",
            resultSrc: "@cyclist.jpg"
          },
        ]
      },
      {
        id: "caption",
        name: "Image Captioning",
        items: [
          { 
            id: "1",
            display: "Describe this image (short)",
            command: "A shelf holds six wine bottles, including Merryvale, Napa Valley Sauvignon Blanc, and Chateau Dorado, with a cluster of grapes and a warm, inviting glow.",
            initialSrc: "@merry.avif",
            resultSrc: "@merry.avif"
          },
          { 
            id: "2",
            display: "Describe this image (long)",
            command: `The image shows a collection of wine bottles arranged on a dark brown wooden shelf. The bottles are predominantly dark green and black, with some white labels. The central bottle is labeled "Merryvale" and "Porch Nap" and is a 2014 Pinot Noir from the Carnero Vineyard in Napa Valley. To the right of the central bottle is a bottle of "Duckhorn Vineyards" Sauvignon Blanc from Napa Valley, and to the far right is a bottle of "Chateau Horace" Chardonnay from Napa Valley. The shelf is decorated with a small bunch of grapes and a wicker basket, adding a rustic touch to the scene. `,
            initialSrc: "@merry.avif",
            resultSrc: "@merry.avif"
          },
        ]
      }
    ],
    animations: {
      typingSpeed: 55,
      progressDuration: 5500
    }
  }
};

/**
 * Progress bar component that shows time until next demo
 * Uses Framer Motion for smooth width animation
 */
const ProgressBar = ({ duration }: { duration: number }) => (
  <motion.div 
    className="absolute bottom-0 left-0 h-1 bg-[#5899f7]"
    initial={{ width: "0%" }}
    animate={{ width: "100%" }}
    transition={{ duration: duration / 1000, ease: "linear" }}
  />
);

/**
 * Tab component for category selection
 * Shows active state and completion status
 * Includes animation for hover and completion badge
 */
const Tab = ({ 
  category, 
  isActive, 
  isComplete,
  onClick 
}: { 
  category: typeof defaultConfig.interactiveTypewriter.categories[0],
  isActive: boolean,
  isComplete: boolean,
  onClick: () => void
}) => (
  <motion.button
    layout
    onClick={onClick}
    className={`relative px-6 py-3 rounded-lg font-inter text-sm font-medium ${
      isActive ? 'bg-[#5899f7] text-white' : 
      isComplete ? 'bg-[#E8E8E8] text-gray-600' : 
      'bg-[#F3F3F3] text-gray-500'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.span layout>{category.name}</motion.span>
    {isComplete && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-[#5899f7] rounded-full flex items-center justify-center"
      >
        <span className="text-white text-xs">✓</span>
      </motion.div>
    )}
  </motion.button>
);

/**
 * Media player component that handles both videos and images
 */
const MediaPlayer = ({ src, isResult = false }: { src: string, isResult?: boolean }) => {
  const isVideo = !src.startsWith('@');
  const imageSrc = src.startsWith('@') ? src.slice(1) : '';

  return (
    <motion.div
      initial={false}
      className="absolute inset-0"
    >
      {isVideo ? (
        <video
          key={src}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{ borderRadius: 8 }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageSrc}
          alt="Scene for analysis"
          className="w-full h-full object-cover rounded-lg"
        />
      )}
    </motion.div>
  );
};

/**
 * Container component for main content area
 * Maintains consistent dimensions and styling
 */
const ContentContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    layout
    className="relative w-full h-[360px] bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm"
  >
    {children}
  </motion.div>
);

/**
 * Main TypewriterMenu component
 * Handles the automated demo progression and UI state
 */
function TypewriterMenu() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);

  const categories = defaultConfig.interactiveTypewriter.categories;
  const currentCategory = categories[currentCategoryIndex];
  const items = currentCategory?.items || [];
  const currentItem = items[currentItemIndex];

  // Reset states when changing items
  useEffect(() => {
    setShowVideo(true);
    setShowResult(false);
    setIsTyping(true);
    setDisplayText("");
    setIsLoading(false);
    setShowProgress(false);
  }, [currentItem]);

  // Handle typing and transitions
  useEffect(() => {
    if (!currentItem) return;

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
      typingInterval = setInterval(() => {
        if (currentIndex <= currentItem.display.length) {
          setDisplayText(currentItem.display.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          setIsLoading(true);
          
          setTimeout(() => {
            setIsLoading(false);
            setShowResult(true);
            setShowProgress(true);
            setTimeout(progressToNext, defaultConfig.interactiveTypewriter.animations.progressDuration);
          }, 1500);
        }
      }, defaultConfig.interactiveTypewriter.animations.typingSpeed);
    }

    return () => clearInterval(typingInterval);
  }, [currentItem, isTyping]);

  const progressToNext = useCallback(() => {
    // Mark current category as completed if moving to next category
    if (currentItemIndex === items.length - 1) {
      setCompletedCategories(prev => [...prev, currentCategory.id]);
    }

    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentItemIndex(0);
    }
  }, [currentItemIndex, items.length, currentCategoryIndex, categories.length, currentCategory.id]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div layout className="space-y-4">
        {/* Category tabs */}
        <div className="flex space-x-2">
          {categories.map((category, index) => (
            <Tab
              key={category.id}
              category={category}
              isActive={index === currentCategoryIndex}
              isComplete={completedCategories.includes(category.id)}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Main content area */}
        <ContentContainer>
          <div className="absolute inset-0">
            {showVideo && (
              <MediaPlayer 
                src={showResult ? currentItem.resultSrc : currentItem.initialSrc}
                isResult={showResult}
              />
            )}
          </div>
          <motion.div
            layout
            className="absolute inset-0 p-6 z-10"
          >
            <motion.div layout className="font-inter text-2xl font-medium">
              {isTyping ? (
                <div className="bg-black/90 px-4 py-2 rounded-lg inline-block">
                  {displayText}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-0.5 text-[#5899f7]"
                  >
                    |
                  </motion.span>
                </div>
              ) : (
                <div className="relative inline-block">
                  <span className="relative z-10 px-4 py-3 bg-black/80 rounded-lg backdrop-blur-sm flex flex-col gap-2">
                    <span>{displayText}</span>
                    {!isLoading && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-mono text-[#5899f7]/80 border-t border-white/10 pt-2"
                      >
                        {'>'} {currentItem.command}
                      </motion.div>
                    )}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-t-2 border-[#5899f7] rounded-full"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-[#5899f7] font-inter text-sm font-medium"
                  >
                    Analyzing with Moondream...
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {showProgress && (
            <ProgressBar duration={defaultConfig.interactiveTypewriter.animations.progressDuration} />
          )}
        </ContentContainer>
      </motion.div>
    </div>
  );
}

/**
 * Main page component
 * Sets up the demo environment and styling
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Moondream Demo</title>
        <meta name="description" content="Interactive demo for Moondream, an open vision language model" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white text-white py-8">
        <TypewriterMenu />
      </div>
    </>
  );
} 