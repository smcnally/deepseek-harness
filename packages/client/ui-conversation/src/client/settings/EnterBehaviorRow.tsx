/** General Settings rows for the Composer's Enter preferences. */
import { useState } from 'react'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import type { BusyEnterBehavior } from '../contract/composer-submission.ts'
import type { ConversationKey } from '../locales.ts'
import css from './EnterBehaviorRow.module.css'

/** Registration-side preference face. */
export interface EnterBehaviorRowInjected {
  hooks: {
    /** Persisted busy-state preference bound as useBusyEnter. */
    busyEnter: SnapshotStore<BusyEnterBehavior>
    /** Persisted newline-Enter preference bound as useNewlineEnter. */
    newlineEnter: SnapshotStore<boolean>
  }
  /** Change the busy-state plain-Enter behavior. */
  setBusyEnter: (behavior: BusyEnterBehavior) => void
  /** Change whether plain Enter inserts a newline instead of submitting. */
  setNewlineEnter: (enabled: boolean) => void
}

/** Full Settings-row props. */
export type EnterBehaviorRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<'conversation'>
  & InjectFace<EnterBehaviorRowInjected>

const OPTIONS: readonly {
  id: BusyEnterBehavior
  label: ConversationKey
}[] = [
  { id: 'queue', label: 'settings.enter.queue' },
  { id: 'steer', label: 'settings.enter.steer' },
]

const NEWLINE_OPTIONS: readonly {
  id: 'send' | 'newline'
  label: ConversationKey
}[] = [
  { id: 'send', label: 'settings.enter.newline.send' },
  { id: 'newline', label: 'settings.enter.newline.newline' },
]

/**
 * Render the composer Enter preference rows: the busy-state delivery mode and
 * whether plain Enter submits or inserts a newline.
 * @param props - composed Settings slot props.
 * @returns the preference rows.
 */
export function EnterBehaviorRow({ useBusyEnter, useNewlineEnter, setBusyEnter, setNewlineEnter, t }: EnterBehaviorRowProps) {
  const behavior = useBusyEnter(value => value)
  const newline = useNewlineEnter(value => value)
  const [open, setOpen] = useState(false)
  const [newlineOpen, setNewlineOpen] = useState(false)
  const selectedLabel = behavior === 'queue' ? 'settings.enter.queue' : 'settings.enter.steer'
  const newlineLabel = newline ? 'settings.enter.newline.newline' : 'settings.enter.newline.send'

  return (
    <>
      <div className={css.row}>
        <div className={css.rowText}>
          <div className={css.title}>{t('settings.enter.title')}</div>
          <div className={css.desc}>{t('settings.enter.description')}</div>
        </div>
        <Menu
          open={open}
          onClose={() => { setOpen(false) }}
          items={OPTIONS.map(option => ({ id: option.id, label: t(option.label) }))}
          selectedId={behavior}
          onSelect={(id) => {
            setOpen(false)
            setBusyEnter(id as BusyEnterBehavior)
          }}
          align="end"
          portal
          anchor={(
            <button
              type="button"
              className={css.selector}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => { setOpen(value => !value) }}
            >
              {t(selectedLabel)}
              <IconChevronDownOutline14 className={css.chevron} />
            </button>
          )}
        />
      </div>
      <div className={css.row}>
        <div className={css.rowText}>
          <div className={css.title}>{t('settings.enter.newline.title')}</div>
          <div className={css.desc}>{t('settings.enter.newline.description')}</div>
        </div>
        <Menu
          open={newlineOpen}
          onClose={() => { setNewlineOpen(false) }}
          items={NEWLINE_OPTIONS.map(option => ({ id: option.id, label: t(option.label) }))}
          selectedId={newline ? 'newline' : 'send'}
          onSelect={(id) => {
            setNewlineOpen(false)
            setNewlineEnter(id === 'newline')
          }}
          align="end"
          portal
          anchor={(
            <button
              type="button"
              className={css.selector}
              aria-haspopup="menu"
              aria-expanded={newlineOpen}
              onClick={() => { setNewlineOpen(value => !value) }}
            >
              {t(newlineLabel)}
              <IconChevronDownOutline14 className={css.chevron} />
            </button>
          )}
        />
      </div>
    </>
  )
}
