# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **校园社交训练模拟应用** (Campus Social Training Simulation Application) - a React-based web application built with Vite. It's designed as a social training simulator for campus environments, featuring multiple scenes with interactive NPCs.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4.1.3
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks (useState)
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Charts**: Recharts

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx            # React entry point
├── index.css           # Global Tailwind styles
├── Attributions.md     # License attributions
└── components/
    ├── ui/             # shadcn/ui components (40+ components)
    └── figma/          # Figma-specific components
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Key Features

- Multiple interactive scenes (classroom, playground, cafeteria, etc.)
- NPC characters with personalities and dialogue topics
- Social interaction simulation
- Responsive UI built with shadcn/ui components
- Image fallback handling

## Development Notes

- The app uses Vite with React SWC plugin for fast development
- Port 3000 is configured for development server
- Build output goes to `build/` directory
- All UI components are located in `src/components/ui/`
- The main application logic is in `src/App.tsx`

## Component Architecture

The application uses a comprehensive set of shadcn/ui components including:
- Card, Button, Badge, Dialog for UI elements
- Form components with React Hook Form integration
- Navigation components (Tabs, Menubar)
- Data display components (Table, Chart)
- Interactive components (Slider, Toggle, Switch)

No testing or linting scripts are currently configured in package.json.