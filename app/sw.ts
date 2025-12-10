/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: Array<{ url: string; revision: string | null }>
}

export const manifest = self.__SW_MANIFEST = []