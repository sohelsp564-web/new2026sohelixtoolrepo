import { ViteReactSSG } from "vite-react-ssg";
import "./index.css";
import "./styles/tool-page.css";
import { routes } from "./routes";

export const createRoot = ViteReactSSG({ routes });
