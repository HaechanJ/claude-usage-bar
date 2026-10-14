export type Meter = { label: string; percent: number; resetsAt?: string }
export type Usage = { meters: Meter[]; costUsd?: number }

declare module 'claude-code' {
  interface PluginState {
    'usage-bar': { usage: Usage | null }
  }
}
