import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'
import { bar, resetTime, toUsage } from './format'

const usage = atom({ plugin: 'usage-bar', key: 'usage' } as const, null)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const current = toUsage(await $.session.usage())
    await update($, usage, () => current)
    return result
  })

  on('session.measure', async ($, e, next) => {
    await update($, usage, () => toUsage(e))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const u = await read($, usage)
    if (e.props.hasSurvey || u === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        {u.meters.map((m, i) => {
          const b = bar(m.percent)
          return (
            <Text key={m.label}>
              {i > 0 ? <Text dimColor> │ </Text> : null}
              <Text dimColor>{m.label} </Text>
              <Text color={b.color}>{b.filled}</Text>
              <Text dimColor>{b.empty}</Text>
              <Text> {Math.round(m.percent)}%</Text>
              <Text dimColor>{resetTime(m.resetsAt)}</Text>
            </Text>
          )
        })}
        {u.costUsd !== undefined ? <Text dimColor> │ ${u.costUsd.toFixed(2)}</Text> : null}
      </Box>
    )
  })
}
