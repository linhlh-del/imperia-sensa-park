import { rememberAttribution } from "./lib/attribution";
import { initInteractionAnalytics } from "./lib/analytics";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/park-template.css";
import { initCmsTracker } from "./lib/cmsTracker";
import { initCtaFx } from "./lib/ctaFx";

/* tracker analytics cho dashboard CMS (chỉ chạy khi build có VITE_CMS_COLLECT_URL) */
rememberAttribution();
initInteractionAnalytics();
initCmsTracker({ clicks: true });
initCtaFx();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
