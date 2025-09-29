Of course! A good README.md file is essential for any project. It acts as the front page, explaining what your project does and how to use it.

Here is a comprehensive README.md file tailored specifically for your "Interactive Event Kiosk" application. You can copy and paste this directly into a README.md file in the root of your GitHub repository.

Home Credit Interactive Event Kiosk

This is a dynamic and engaging web application designed to run on a kiosk at promotional events. It features two main interactive experiences: a customizable "Spin the Wheel" prize game and a "Buzzwire Challenge" countdown timer. The entire application is built with Next.js, React, and Tailwind CSS for a modern, responsive, and visually appealing user experience.

(Feel free to replace this image with your own screenshot or a GIF of the app in action!)

Table of Contents

Key Features

Live Demo

Technology Stack

Getting Started

Prerequisites

Installation

Project Structure

Configuration & Customization

Spin the Wheel Prizes

Buzzwire Timer

License

Key Features
Spin the Wheel Game

Fully Interactive Wheel: A smooth, spinning prize wheel built with react-custom-roulette.

Real-Time Customization: An on-screen configuration panel allows event staff to add, remove, or edit prizes (both text and images) on the fly without touching any code.

Dynamic Image & Text Rendering: Supports both simple text prizes and prizes with images. It dynamically generates wheel segments by drawing images and text onto a canvas for a clean look.

Engaging UI: Housed within a sleek "tablet" frame with a dedicated "TV" screen to display the winning prize, creating an immersive experience.

Responsive Design: Looks great on a variety of screen sizes, from tablets to large kiosk displays.

Buzzwire Challenge Timer

Thematic Countdown: A 60-second countdown timer designed to look like a glowing digital display, perfect for a high-pressure challenge game.

Simple Controls: Easy-to-use "Start" and "Restart" buttons for managing the game.

Event-Themed Stands: The components are presented on virtual "stands" to simulate a real-life event floor.

Live Demo

(Optional) Link to your live deployment:

View the live demo here!

Technology Stack

Framework: Next.js 14 (with App Router)

Language: TypeScript

Styling: Tailwind CSS

Core Library: React

Wheel Component: react-custom-roulette

Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

You need to have Node.js (version 18.x or later) and a package manager like npm or yarn installed on your system.

Installation

Clone the repository:

code
Sh
download
content_copy
expand_less
git clone https://github.com/your-username/your-repository-name.git

Navigate to the project directory:

code
Sh
download
content_copy
expand_less
cd your-repository-name

Install the dependencies:

code
Sh
download
content_copy
expand_less
npm install
# or
yarn install

Run the development server:

code
Sh
download
content_copy
expand_less
npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

Project Structure

The project follows a standard Next.js App Router structure:

code
Code
download
content_copy
expand_less
.
├── app/
│   ├── spin-the-wheel/page.tsx   # Contains the SpinTheWheel component
│   ├── buzzwire/page.tsx         # Contains the EventScene (Buzzwire Timer) component
│   └── layout.tsx
├── components/
│   ├── SpinTheWheel.tsx          # Main component for the wheel game
│   ├── EventScene.tsx            # Main component for the buzzwire timer scene
│   └── configurations.tsx        # The on-screen panel for customizing wheel items
├── public/
│   └── assets/                   # Static images and logos
└── ... (other config files)
Configuration & Customization

The application is designed to be easily configurable.

Spin the Wheel Prizes

There are two ways to configure the prizes:

Default Prizes (Code):
To change the default prizes that load initially, modify the initialWheelItems array inside app/spin-the-wheel/page.tsx. You can specify a name (text-only prize) or a name and an imageUrl.

code
TypeScript
download
content_copy
expand_less
const initialWheelItems: WheelItem[] = [
  { name: "iPhone 17 Pro Max" }, // Text-only prize
  { name: "Smart Watch", imageUrl: "/assets/smart-watch.png" }, // Prize with an image
  { name: "Try Again" },
  // ...add more prizes here
];

Live Prizes (On-Screen Panel):
For live events, the most powerful feature is the on-screen configuration panel. Event staff can use this interface to:

Add new prizes with text.

Add new prizes by uploading an image.

Remove existing prizes.
These changes are reflected on the wheel instantly without needing to restart the application.

Buzzwire Timer

To change the duration of the countdown timer:

Navigate to the EventScene component (app/buzzwire/page.tsx or its component file).

Find the TimerDisplay sub-component within it.

Change the initialTime constant. The value is in seconds.

code
TypeScript
download
content_copy
expand_less
// Inside the TimerDisplay component
const initialTime = 60; // Change this value to 90 for 90 seconds, etc.
License

This project is licensed under the MIT License - see the LICENSE file for details.
