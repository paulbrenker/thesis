import { uncompiledRules } from './config'

export function decide(rule: string): string {
  if (isIncompatibleVersion(rule)) {
    return 'a'
  }
  if (isSingleTrigger(rule)) {
    return 'b'
  }
  return ''
}

function isIncompatibleVersion(rule: string): boolean {
  const invalidFormats = ['oas2', 'oas3_1']
  return uncompiledRules[rule].formats.filter(element =>
    invalidFormats.includes(element)
  ).length > 0
    ? false
    : true
}

function isSingleTrigger(rule: string): boolean {
  return uncompiledRules[rule].triggers === 1
}
