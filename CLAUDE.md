# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **校园社交对话系统** (Campus Social Training Simulation Application) - a React-based web application designed to help children learn and practice social skills through interactive campus scenarios.

## Technology Stack

- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4.1.3
- **UI Components**: Radix UI + shadcn/ui (40+ components)
- **Icons**: Lucide React
- **State Management**: React hooks (useState)
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Charts**: Recharts
- **Image Format**: WebP (optimized for performance)

## Project Structure

```
campus/
├── public/
│   └── images-webp/       # Static WebP resources served by Vite
│       ├── avatar/        # Character avatars (27+角色头像)
│       └── scenes/        # Scene backgrounds
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components (40+基础组件)
│   │   └── figma/        # Custom components
│   ├── styles/           # Style files
│   └── App.tsx           # Main application component
├── images-webp/          # Source WebP images
│   ├── 人物/             # Character images (23+角色头像)
│   └── 场景/             # Scene images (10+场景背景)
└── package.json          # Project configuration
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Convert PNG images to WebP format
node convert-images.js          # Convert all PNGs
node convert-new-images.js      # Convert only new PNGs
node convert-specific.js        # Convert specific images
```

## Key Features

- **10 Interactive Scenes**: Classroom, Playground, Library, Cafeteria, Principal Office, Music Room, Art Room, School Garden, Hallway, Health Room
- **25+ NPC Characters**: Teachers, students, staff with unique personalities and dialogue
- **Social Skill Training**: Greetings, requests, apologies, thanks in various scenarios
- **Responsive Design**: Supports desktop, tablet, and mobile devices
- **WebP Optimization**: All images converted to WebP for faster loading
- **Immersive Experience**: Scene-specific backgrounds and character avatars

## Image Management

- **Source Images**: PNG format in `images/` directory
- **Optimized Images**: WebP format in `images-webp/` directory  
- **Static Serving**: WebP images copied to `public/images-webp/` for Vite serving
- **Conversion Scripts**: Multiple scripts for batch and specific image conversion

## Development Notes

- Uses Vite with React SWC plugin for fast development
- Development server runs on port 3000 with auto-open
- Build output goes to `build/` directory
- All UI components are based on Radix UI primitives
- Main application logic is in `src/App.tsx` with scene and character data
- Background images are managed through CSS and component-level styling
- No testing or linting scripts currently configured

## Recent Updates

- ✅ Complete character avatar system (25+角色专属头像)
- ✅ WebP image optimization for all assets
- ✅ Responsive background image handling
- ✅ Scene-specific visual theming
- ✅ Character consistency across all scenes