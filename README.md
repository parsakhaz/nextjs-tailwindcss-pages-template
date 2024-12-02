# Moondream Interactive Demo

An elegant, interactive demonstration of Moondream's vision capabilities. This demo showcases the model's core functionalities through a seamless, automated presentation.

## Features

### Core Capabilities
- **Object Detection**: Live demonstration of object detection with before/after video comparisons
- **Visual Q&A**: Interactive questions and answers about image content
- **Image Captioning**: Automated scene description and captioning

### Technical Implementation
- Seamless transitions between states using Framer Motion
- Real-time typewriter effect for prompts
- Smooth loading states and animations
- Automatic progression through demo sequences
- Adaptive media handling for both videos and images

## Visual Experience

- Clean, minimal interface with focus on content
- Smooth transitions between all states
- Real-time command display
- Progress indicators and visual feedback
- Consistent visual hierarchy

## Project Structure

```
src/
├── pages/
│   └── index.tsx    # Main demo component
├── styles/
│   └── globals.css  # Global styles and animations
└── public/
    ├── cars.mp4         # Original car detection video
    ├── cars_detect.mp4  # Detection result video
    ├── trucks.mp4       # Original truck detection video
    ├── trucks_detect.mp4# Detection result video
    └── cyclist.jpg      # Sample image for Q&A and captioning
```

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Required Assets

Place the following media files in the `public` directory:
- `cars.mp4` - Original video for car detection
- `cars_detect.mp4` - Video showing car detection results
- `trucks.mp4` - Original video for truck detection
- `trucks_detect.mp4` - Video showing truck detection results
- `cyclist.jpg` - Sample image for Q&A and captioning demos

## Demo Flow

1. **Object Detection**
   - Shows original video while typing prompt
   - Displays loading animation
   - Transitions to detection results
   - Progresses automatically

2. **Visual Q&A**
   - Displays image immediately
   - Types question over the image
   - Shows model's response
   - Smooth transition to next item

3. **Image Captioning**
   - Similar flow to Visual Q&A
   - Focuses on descriptive capabilities
   - Demonstrates different caption styles

## Technical Details

- Built with Next.js and TypeScript
- Framer Motion for seamless animations
- Tailwind CSS for styling
- Inter font for clean typography
- Responsive design principles

## Development

The demo is designed to be:
- Fully automated
- Seamless between transitions
- Maintainable and extensible
- Easy to update with new content

## License

MIT License - Feel free to use this demo as a template for your own ML model demonstrations.

---

Created for demonstrating Moondream - an efficient vision language model.