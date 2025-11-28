import { baseURL } from "@/baseUrl";

/**
 * ChatGPT SDK Bootstrap Component
 *
 * Injects the necessary scripts and patches browser APIs to make the app
 * work correctly within ChatGPT's iframe environment.
 *
 * This script runs immediately before React hydration to ensure all
 * patches are in place before any component code executes.
 */
export function ChatGPTSDKBootstrap() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (() => {
            const baseUrl = ${JSON.stringify(baseURL)};
            window.innerBaseUrl = baseUrl;
            window.__isChatGptApp = typeof window.openai !== "undefined";
            
            // Set base href
            let base = document.querySelector("base");
            if (!base) {
              base = document.createElement("base");
              document.head.insertBefore(base, document.head.firstChild);
            }
            base.href = baseUrl;
            
            const htmlElement = document.documentElement;
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (
                  mutation.type === "attributes" &&
                  mutation.target === htmlElement
                ) {
                  const attrName = mutation.attributeName;
                  if (attrName && attrName !== "suppresshydrationwarning") {
                    htmlElement.removeAttribute(attrName);
                  }
                }
              });
            });
            observer.observe(htmlElement, {
              attributes: true,
              attributeOldValue: true,
            });

            const originalReplaceState = history.replaceState;
            history.replaceState = (s, unused, url) => {
              const u = new URL(url ?? "", window.location.href);
              const href = u.pathname + u.search + u.hash;
              originalReplaceState.call(history, unused, href);
            };

            const originalPushState = history.pushState;
            history.pushState = (s, unused, url) => {
              const u = new URL(url ?? "", window.location.href);
              const href = u.pathname + u.search + u.hash;
              originalPushState.call(history, unused, href);
            };

            const appOrigin = new URL(baseUrl).origin;
            const isInIframe = window.self !== window.top;

            window.addEventListener(
              "click",
              (e) => {
                const a = (e?.target || e.target)?.closest("a");
                if (!a || !a.href) return;
                const url = new URL(a.href, window.location.href);
                if (
                  url.origin !== window.location.origin &&
                  url.origin != appOrigin
                ) {
                  try {
                    if (window.openai) {
                      window.openai?.openExternal({ href: a.href });
                      e.preventDefault();
                    }
                  } catch {
                    console.warn(
                      "openExternal failed, likely not in OpenAI client"
                    );
                  }
                }
              },
              true
            );

            if (isInIframe && window.location.origin !== appOrigin) {
              const originalFetch = window.fetch;

              window.fetch = (input, init) => {
                let url;
                if (typeof input === "string" || input instanceof URL) {
                  url = new URL(input, window.location.href);
                } else {
                  url = new URL(input.url, window.location.href);
                }

                if (url.origin === appOrigin) {
                  if (typeof input === "string" || input instanceof URL) {
                    input = url.toString();
                  } else {
                    input = new Request(url.toString(), input);
                  }

                  return originalFetch.call(window, input, {
                    ...init,
                    mode: "cors",
                  });
                }

                if (url.origin === window.location.origin) {
                  const newUrl = new URL(baseUrl);
                  newUrl.pathname = url.pathname;
                  newUrl.search = url.search;
                  newUrl.hash = url.hash;
                  url = newUrl;

                  if (typeof input === "string" || input instanceof URL) {
                    input = url.toString();
                  } else {
                    input = new Request(url.toString(), input);
                  }

                  return originalFetch.call(window, input, {
                    ...init,
                    mode: "cors",
                  });
                }

                return originalFetch.call(window, input, init);
              };
            }
          })();
        `,
      }}
    />
  );
}
