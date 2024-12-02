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
			  display: "detect: car",
			  command: "cars detected",
			  initialSrc: "/vehicles.mp4",
			  resultSrc: "/cars_detect.mp4"
			},
			{ 
			  id: "trucks",
			  display: "detect: truck",
			  command: "trucks detected",
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
        //   { 
        //     id: "2",
        //     display: "Describe this image (long)",
        //     command: `The image shows a collection of wine bottles arranged on a dark brown wooden shelf. The bottles are predominantly dark green and black, with some white labels. The central bottle is labeled "Merryvale" and "Porch Nap" and is a 2014 Pinot Noir from the Carnero Vineyard in Napa Valley. To the right of the central bottle is a bottle of "Duckhorn Vineyards" Sauvignon Blanc from Napa Valley, and to the far right is a bottle of "Chateau Horace" Chardonnay from Napa Valley. The shelf is decorated with a small bunch of grapes and a wicker basket, adding a rustic touch to the scene. `,
        //     initialSrc: "@merry.avif",
        //     resultSrc: "@merry.avif"
        //   },
        ]
      }
    ],
    animations: {
      typingSpeed: 55,
      progressDuration: 4500
    }
  }
};

/**
 * Progress bar component that shows time until next demo
 * Uses Framer Motion for smooth width animation
 */
const ProgressBar = ({ duration }: { duration: number }) => (
  <motion.div 
    className="absolute bottom-0 left-0 right-0 h-1 bg-[#4B96FF]"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: duration / 1000, ease: "linear" }}
    style={{ transformOrigin: 'left' }}
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
  onClick,
  currentItemIndex = 0,
  totalItems = 0,
}: { 
  category: typeof defaultConfig.interactiveTypewriter.categories[0],
  isActive: boolean,
  isComplete: boolean,
  onClick: () => void,
  currentItemIndex?: number,
  totalItems?: number,
}) => (
  <motion.button
    layout
    onClick={onClick}
    className={`relative px-4 py-2 font-geist-sans text-sm font-medium ${
      isActive ? 'bg-[#4B96FF] text-white' : 
      isComplete ? 'bg-gray-600 text-white' : 
      'bg-gray-700 text-gray-300'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.span layout>{category.name}</motion.span>
    <div className="absolute -top-1 -right-1 w-4 h-4">
      {/* Background circle */}
      <div className={`absolute inset-0 rounded-full ${
        isComplete ? 'bg-[#4BC66D]' : 
        isActive ? 'bg-[#4B96FF]' : 
        'bg-gray-600'
      }`} />
      
      {/* Circular progress indicator */}
      {isActive && !isComplete && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: totalItems > 0 ? (currentItemIndex + 1) / totalItems + 0.01 : 0 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="stroke-white"
            fill="none"
            strokeWidth={2}
            cx="8"
            cy="8"
            r="7"
          />
        </svg>
      )}
      
      {/* Checkmark */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <span className="text-[10px] transform translate-y-[0px] pt-[1px]">✓</span>
      </div>
    </div>
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
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageSrc}
          alt="Scene for analysis"
          className="w-full h-full object-cover"
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
      // Start progress bar immediately when typing begins
      setShowProgress(true);
      
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
            setTimeout(progressToNext, defaultConfig.interactiveTypewriter.animations.progressDuration - 1500);
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
    <div className="w-full max-w-3xl mx-auto">
      <motion.div layout className="relative">
        {/* Video container that takes up full space */}
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
          {showVideo && (
            <MediaPlayer 
              src={showResult ? currentItem.resultSrc : currentItem.initialSrc}
              isResult={showResult}
            />
          )}
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Progress bar */}
          {showProgress && (
            <ProgressBar duration={defaultConfig.interactiveTypewriter.animations.progressDuration} />
          )}

          {/* Content overlay */}
          <div className="flex-1 p-6">
            <div className="font-inter text-2xl font-medium text-white">
              {isTyping ? (
                <div className="bg-black/40 px-4 py-2 rounded-lg w-full">
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
                <div className="bg-black/40 px-4 py-3 rounded-lg backdrop-blur-sm w-full">
                  <div className="font-geist-sans">{displayText}</div>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="font-geist-mono text-xs text-[#5899f7]/80">
                      <span className="select-none">{'>'}</span>
                      <span className="ml-2">
                        {isLoading ? (
                          <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: [1, 0.5] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          >
                            ⋯
                          </motion.span>
                        ) : (
                          currentItem.command
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs at the bottom with transparent background */}
          <div className="p-4">
            <div className="flex gap-2 justify-center">
              {categories.map((category, index) => (
                <Tab
                  key={category.id}
                  category={category}
                  isActive={index === currentCategoryIndex}
                  isComplete={completedCategories.includes(category.id)}
                  onClick={() => {}}
                  currentItemIndex={index === currentCategoryIndex ? currentItemIndex : 0}
                  totalItems={category.items.length}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TypewriterMenu;