import "../../global.css";
import { Href, Redirect } from "expo-router";
import { useState } from "react";
import { LandingScreen } from "../screens/LandingScreen";

export default function App() {
  const [enterLibrary, setEnterLibrary] = useState(false);
  if (enterLibrary) return <Redirect href={"/library" as unknown as Href} />;
  return <LandingScreen onLogin={() => setEnterLibrary(true)} />;
}
