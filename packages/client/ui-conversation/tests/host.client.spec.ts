import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { SettingsProvider, type SettingsNamespace } from '@deepseek-ai/dsh-settings'
import {
  CONVERSATION_SETTINGS_NAMESPACE, DEFAULT_BUSY_ENTER_BEHAVIOR, DEFAULT_NEWLINE_ENTER, apply,
} from '@deepseek-ai/dsh-client-ui-conversation'

class MemorySettings extends SettingsProvider {
  readonly writable = true
  protected load(): Promise<Record<string, unknown>> { return Promise.resolve({}) }
  protected persist(_ns: SettingsNamespace, _section: Record<string, unknown>): Promise<void> {
    return Promise.resolve()
  }
}

describe('ui-conversation host', () => {
  it('registers, validates, and disposes the durable Enter preferences', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettings).await()
    const fiber = ctx.plugin({ apply })
    await fiber.await()
    const ns = CONVERSATION_SETTINGS_NAMESPACE
    expect(ctx.settings.get(ns)).toEqual({ busyEnter: DEFAULT_BUSY_ENTER_BEHAVIOR, newlineEnter: DEFAULT_NEWLINE_ENTER })
    await ctx.settings.update(ns, { busyEnter: 'steer' })
    expect(ctx.settings.get(ns)).toEqual({ busyEnter: 'steer', newlineEnter: DEFAULT_NEWLINE_ENTER })
    await ctx.settings.update(ns, { newlineEnter: true })
    expect(ctx.settings.get(ns)).toEqual({ busyEnter: 'steer', newlineEnter: true })
    await expect(ctx.settings.update(ns, { busyEnter: 'invalid' })).rejects.toThrow()
    await expect(ctx.settings.update(ns, { newlineEnter: 'yes' })).rejects.toThrow()
    await fiber.dispose()
    expect(ctx.settings.describe().map(row => row.ns)).not.toContain(ns)
  })
})
