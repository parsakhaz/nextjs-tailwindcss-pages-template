import Head from 'next/head';
import { useState, useEffect, useCallback } from "react";

const defaultConfig = {
  interactiveTypewriter: {
    categories: [
      {
        id: "detection",
        name: "Detection",
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
            id: "gauge",
            display: "What temperature does the gauge read?",
            command: "The gauge reads 53 °C.",
            initialSrc: "@gauge.png",
            resultSrc: "@gauge.png"
          },
          { 
            id: "cyclist_color",
            display: "What color is the cyclist in the front?",
            command: "The cyclist in the front is wearing blue.",
            initialSrc: "@cyclist.jpg",
            resultSrc: "@cyclist.jpg"
          },
          { 
            id: "cyclist_count",
            display: "How many cyclists are there?",
            command: "There are four cyclists in the image.",
            initialSrc: "@cyclist.jpg",
            resultSrc: "@cyclist.jpg"
          },
        ]
      },
      {
        id: "caption",
        name: "Captioning",
        items: [
          { 
            id: "1",
            display: "Describe this image (short)",
            command: "A shelf holds six wine bottles, including Merryvale, Napa Valley Sauvignon Blanc, and Chateau Dorado, with a cluster of grapes and a warm, inviting glow.",
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

const ProgressBar = ({ duration }: { duration: number }) => (
  <div 
    className="absolute bottom-0 left-0 right-0 h-1 bg-[#4B96FF]"
  />
);

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
  <button
    onClick={onClick}
    className={`relative px-4 py-1.5 font-geist-sans text-md font-medium rounded-full ${
      isActive ? 'bg-[#4B96FF] text-white' : 
      isComplete ? 'bg-gray-600 text-white' : 
      'bg-gray-700 text-gray-300'
    }`}
  >
    <span>{category.name}</span>
    <div className="absolute -top-1 -right-1 w-4 h-4">
      <div className={`absolute inset-0 rounded-full ${
        isComplete ? 'bg-[#4BC66D]' : 
        isActive ? 'bg-[#4B96FF]' : 
        'bg-gray-600'
      }`} />
      
      {isActive && !isComplete && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            className="stroke-white"
            fill="none"
            strokeWidth={2}
            cx="8"
            cy="8"
            r="7"
            strokeDasharray={44}
            strokeDashoffset={44 * (1 - (totalItems > 0 ? (currentItemIndex + 1) / totalItems : 0))}
          />
        </svg>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <span className="text-[10px] transform translate-y-[-1px]">✓</span>
      </div>
    </div>
  </button>
);

const MediaPlayer = ({ src }: { src: string }) => {
  const isVideo = !src.startsWith('@');
  const imageSrc = src.startsWith('@') ? src.slice(1) : '';

  return (
    <>
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
    </>
  );
};

// Static Pills Component
const CategoryPills = ({ 
  categories, 
  currentCategoryIndex, 
  currentItemIndex,
  completedCategories 
}: { 
  categories: typeof defaultConfig.interactiveTypewriter.categories,
  currentCategoryIndex: number,
  currentItemIndex: number,
  completedCategories: string[]
}) => (
  <div className="flex justify-center gap-2">
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
);

// Static Video Component
const VideoContainer = ({ 
  src, 
  showProgress, 
  duration,
  isLoading 
}: { 
  src: string, 
  showProgress: boolean,
  duration: number,
  isLoading: boolean
}) => (
  <div className="w-full bg-gray-800/50">
    <div className="aspect-video relative">
      <div className="absolute inset-0">
        <MediaPlayer src={src} />
      </div>
      {/* Loading overlay and indicator */}
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-geist-mono text-white/50 text-sm"
            >
              ⋯
            </span>
          </div>
        </>
      )}
      {showProgress && (
        <div className="absolute bottom-0 left-0 right-0">
          <ProgressBar duration={duration} />
        </div>
      )}
    </div>
  </div>
);

// Typewriter Component
const TypewriterContent = ({
  isTyping,
  displayText,
  isLoading,
  command
}: {
  isTyping: boolean,
  displayText: string,
  isLoading: boolean,
  command: string
}) => (
  <div className="relative">
    {isLoading && <div className="absolute inset-0 bg-black/20 z-10" />}
    <div className="font-geist-sans text-2xl font-medium text-white">
      {isTyping ? (
        <div className="bg-black/80 px-4 py-2">
          {displayText}
          <span
            className="ml-0.5 text-[#6a98f7]"
          >
            |
          </span>
        </div>
      ) : (
        <div className="bg-black/80 px-4 py-3 backdrop-blur-sm">
          <div>{displayText}</div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="font-geist-mono text-base text-[#6a98f7]">
              <span className="select-none">{'>'}</span>
              <span className="ml-2">
                {isLoading ? (
                  <span
                  >
                    ⋯
                  </span>
                ) : (
                  command
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

function MobileTypewriterMenu() {
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

  useEffect(() => {
    setShowVideo(true);
    setShowResult(false);
    setIsTyping(true);
    setDisplayText("");
    setIsLoading(false);
    setShowProgress(false);
  }, [currentItem]);

  useEffect(() => {
    if (!currentItem) return;

    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
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
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Static Pills */}
      <div className="h-[52px] flex items-center">
        <CategoryPills
          categories={categories}
          currentCategoryIndex={currentCategoryIndex}
          currentItemIndex={currentItemIndex}
          completedCategories={completedCategories}
        />
      </div>

      {/* Container for video and typewriter */}
      <div style={{ height: 'calc(56.25vw + 200px)', maxHeight: 'calc(360px + 200px)' }} className="relative">
        {/* Static Video */}
        <div>
          {showVideo && (
            <VideoContainer
              src={showResult ? currentItem.resultSrc : currentItem.initialSrc}
              showProgress={showProgress}
              duration={defaultConfig.interactiveTypewriter.animations.progressDuration}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Fixed position Typewriter */}
        <div 
          className="absolute left-0 right-0" 
          style={{ 
            top: 'calc(56.25vw + 1rem)',
            maxHeight: 'calc(360px + 1rem)' 
          }}
        >
          <TypewriterContent
            isTyping={isTyping}
            displayText={displayText}
            isLoading={isLoading}
            command={currentItem?.command || ''}
          />
        </div>
      </div>
    </div>
  );
}

export default function MobilePage() {
  return (
    <>
      <Head>
        <title>Moondream Demo</title>
        <meta name="description" content="Interactive demo for Moondream, an open vision language model" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-white text-white py-8">
        <MobileTypewriterMenu />
      </div>
    </>
  );
} 