// import { LibraryScreen } from "@/src/FEATURES/LIBRARY";
import "../../global.css";

import { useState } from "react";
import { OpeningScreen } from "../screens/OpeningScreen";
import { LandingScreen } from "../screens/LandingScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <OpeningScreen onFinish={() => setShowSplash(false)} />;
  }
  return <LandingScreen />;
}