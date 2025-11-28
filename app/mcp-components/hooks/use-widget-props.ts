/**
 * Source: https://github.com/openai/openai-apps-sdk-examples/tree/main/src
 */

import { useOpenAIGlobal } from "./use-openai-global";

/**
 * Hook to get widget props (tool output) from ChatGPT.
 *
 * @param defaultState - Default value or function to compute it if tool output is not available
 * @returns An object with `data` (the tool output props or the default fallback) and `isLoading` (true if tool output is not available)
 *
 * @example
 * ```tsx
 * const { data: props, isLoading } = useWidgetProps({ userId: "123", name: "John" });
 * if (isLoading) return <Skeleton />;
 * ```
 */
export function useWidgetProps<T extends Record<string, unknown>>(
  defaultState?: T | (() => T)
): { data: T; isLoading: boolean } {
  const toolOutput = useOpenAIGlobal("toolOutput") as T | null;

  const fallback =
    typeof defaultState === "function"
      ? (defaultState as () => T | null)()
      : defaultState ?? null;

  const isLoading = toolOutput === null;
  const data = toolOutput ?? (fallback as T);

  return { data, isLoading };
}
