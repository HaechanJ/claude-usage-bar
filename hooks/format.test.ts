import { test, expect } from 'claude-code/testing'
import { bar, toUsage } from './format'

test('collects context, rate limits and cost', () => {
  expect(
    toUsage({
      context: { window: 200000, tokens: 68000, percent: 34 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: 62, resetsAt: '2026-10-14T07:10:00Z' },
        { kind: 'seven_day', percentUsed: 18 },
      ],
      cost: { usd: 1.23 },
    }),
  ).toEqual({
    meters: [
      { label: 'ctx', percent: 34 },
      { label: '5h', percent: 62, resetsAt: '2026-10-14T07:10:00Z' },
      { label: '7d', percent: 18, resetsAt: undefined },
    ],
    costUsd: 1.23,
  })
})

test('nothing known yet hides the band', () => {
  expect(toUsage({ context: { window: 200000 }, rateLimits: [] })).toBe(null)
})

test('bar colors by threshold', () => {
  expect(bar(34)).toEqual({ filled: '███', empty: '░░░░░░░', color: 'success' })
  expect(bar(62).color).toBe('warning')
  expect(bar(85).color).toBe('error')
})
