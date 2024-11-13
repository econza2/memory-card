import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MemoryCard from "./MemoryCard";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MemoryCard />
  </StrictMode>
);
