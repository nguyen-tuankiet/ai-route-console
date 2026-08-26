import { createCache } from "@ant-design/cssinjs";

/**
 * Module-level singleton so the exact same cache instance is used both when
 * `<StyleProvider cache={antdCache}>` registers component styles during SSR
 * render (in __root.tsx), and when server.ts extracts + injects them into the
 * response HTML afterward. AntD's cssinjs never touches `document` on the
 * server — without wiring this cache through, the server-rendered HTML ships
 * with zero AntD CSS, so every page flashes unstyled until client hydration
 * finishes and re-registers the same styles in the browser.
 */
export const antdCache = createCache();
