// src/app/page.tsx

import EventScene from "./components/Timer";
import SpinTheWheel from "./components/SpinTheWheel";

export default function Home() {
  return (
    <main>
      <EventScene />
      <SpinTheWheel />
    </main>
  );
}