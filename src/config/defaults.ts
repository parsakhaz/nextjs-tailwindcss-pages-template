import type { Config } from '@/context/ConfigContext';

export const defaultConfig = {
  terminal: {
    commands: [
      'detect: "trucks"',
      'detect: "cars"',
      'detect: "faces"',
      'detect: "bicycles"',
    ],
    prompt: '$',
    typingSpeed: 75,
    deleteSpeed: 50,
  },
  codeEditor: {
    code: `function animate() {
  const element = document.querySelector('.box');
  element.style.transform = 'rotate(360deg)';
  element.style.transition = 'all 0.5s ease';
}

// Call the animation function
animate();`,
    language: 'javascript',
    theme: 'dark',
  },
  commandPalette: {
    placeholder: "Type a command or search...",
    commands: [
      { 
        id: "1", 
        title: "New File", 
        icon: "📄", 
        shortcut: "⌘N" 
      },
      { 
        id: "2", 
        title: "Open Project", 
        icon: "📁", 
        shortcut: "⌘O" 
      }
    ],
    animations: {
      searchInputDelay: 0.2,
      itemStaggerDelay: 0.05,
      hoverTransitionDuration: 0.2,
      slideInDistance: 20
    },
    style: {
      maxHeight: '400px',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      textColor: 'rgba(255, 255, 255, 0.8)'
    }
  },
  notificationStack: {
    notifications: [
      {
        id: "1",
        type: "success",
        title: "Deployment Successful",
        message: "Your changes are now live",
        duration: 3000
      }
    ],
    position: 'top-right',
    maxNotifications: 3,
    animations: {
      enterDuration: 0.3,
      exitDuration: 0.2,
      staggerDelay: 0.1,
      slideDistance: 100
    },
    style: {
      spacing: 8,
      maxWidth: '384px',
      opacity: 0.95,
      blur: '8px'
    }
  },
  macWindow: {
    variant: 'default',
    customCursor: false,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      titleBarColor: 'rgba(0, 0, 0, 0.9)',
      buttonStyle: 'default',
      borderRadius: '0.75rem',
      shadow: 'lg'
    },
    animations: {
      mount: true,
      hover: true,
      buttonHover: true
    },
    title: '',
    showTitle: false
  }
} as const; 

// Add debug logging
console.log('Default Config Loaded:', defaultConfig); 

// Add type for variant styles
type MacWindowVariantStyle = {
  backgroundColor: string;
  borderColor: string;
  titleBarColor: string;
  buttonStyle: 'default' | 'minimal' | 'hidden';
};

export const macWindowVariants: Record<Config['macWindow']['variant'], MacWindowVariantStyle> = {
  default: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    titleBarColor: 'rgba(0, 0, 0, 0.9)',
    buttonStyle: 'default'
  },
  minimal: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'transparent',
    titleBarColor: 'transparent',
    buttonStyle: 'minimal'
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    titleBarColor: 'rgba(0, 0, 0, 1)',
    buttonStyle: 'default'
  },
  gradient: {
    backgroundColor: 'linear-gradient(135deg, rgba(45,45,45,0.9) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,1) 100%)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    titleBarColor: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(20,20,20,0.9))',
    buttonStyle: 'default'
  },
  glassmorphic: {
    backgroundColor: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    titleBarColor: 'rgba(255, 255, 255, 0.05)',
    buttonStyle: 'minimal'
  }
} as const; 