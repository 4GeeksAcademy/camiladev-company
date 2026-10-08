"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/api";
import type { LoadState } from "@/types/candidates";

export function useResource<T>(loader: (key: string, signal: AbortSignal) => Promise<T>, key: string) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setState({ status: "loading" });
      try {
        const data = await loader(key, controller.signal);
        if (!controller.signal.aborted) setState({ status: "success", data });
      } catch (error) {
        if (!controller.signal.aborted) setState({ status: "error", message: errorMessage(error) });
      }
    }
    void load();
    return () => controller.abort();
  }, [loader, key, revision]);

  return { state, setState, reload: () => setRevision((value) => value + 1) };
}