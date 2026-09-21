import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles/global.css";

const container = document.getElementById("root");

if (!container) {
    throw new Error(
        'Root element #root not found. Check that index.html contains <div id="root"></div>.',
    );
}

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>,
);