import type { Routine } from '@/types'
import agentsConfig from '@/data/agents-config.json'

export function getRoutines(): Routine[] {
  return agentsConfig as Routine[]
}
