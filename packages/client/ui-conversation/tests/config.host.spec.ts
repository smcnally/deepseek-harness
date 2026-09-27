import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import * as HostPlugin from '../src/index.ts'
import { liveConfig, omitsGeneratedPage } from '../../../settings/settings/tests/live-config.ts'
import { plainConfig } from '../../../settings/settings/src/schema.ts'
import {
  DEFAULT_BUSY_ENTER_BEHAVIOR, DEFAULT_NEWLINE_ENTER, Config, apply,
} from '@deepseek-ai/dsh-client-ui-conversation'


describe('ui-conversation host', () => {
  it('registers, validates, and disposes the durable Enter preferences', async () => {
    const ctx = new Context()
    const configuration = await liveConfig(ctx, { Config, apply })
    const { fiber } = configuration
    expect(plainConfig(configuration.fiber.config))
      .toEqual({ busyEnter: DEFAULT_BUSY_ENTER_BEHAVIOR, newlineEnter: DEFAULT_NEWLINE_ENTER })
    await configuration.update({ busyEnter: 'steer' })
    expect(plainConfig(configuration.fiber.config))
      .toEqual({ busyEnter: 'steer', newlineEnter: DEFAULT_NEWLINE_ENTER })
    await configuration.update({ newlineEnter: true })
    expect(plainConfig(configuration.fiber.config)).toEqual({ busyEnter: 'steer', newlineEnter: true })
    await expect(configuration.update({ busyEnter: 'invalid' })).rejects.toThrow()
    await expect(configuration.update({ newlineEnter: 'yes' })).rejects.toThrow()
    await fiber.dispose()
  })
})

it('keeps its own instance off the generated Settings pages', () => omitsGeneratedPage(ctx => ctx.plugin(HostPlugin)))
