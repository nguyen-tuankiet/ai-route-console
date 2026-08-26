import "./lib/error-capture";

import { extractStyle } from "@ant-design/cssinjs";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { antdCache } from "./lib/antdCache";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// AntD's cssinjs never touches `document` on the server, so the SSR render
// that just happened inside handler.fetch() registered its styles into
// antdCache but emitted zero <style> tags. Extract the accumulated CSS from
// that same cache now and splice it into <head> so the page isn't unstyled
// on first paint (see antdCache.tsx). `response.text()` only resolves once
// the SSR render is fully done producing output, so the cache is guaranteed
// populated by the time we read it here — true whether the underlying
// response was streamed or buffered.
async function injectAntdStyles(response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status >= 300 || !contentType.includes("text/html")) return response;

  const html = await response.text();
  const css = extractStyle(antdCache, true);
  const styled = html.includes("</head>")
    ? html.replace("</head>", `<style data-ant-cssinjs>${css}</style></head>`)
    : html;

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(styled, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await injectAntdStyles(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
