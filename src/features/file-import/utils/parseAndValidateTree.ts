import i18n from '@/i18n/config'
import { validateTreeJson, type TreeNode } from '@/lib/fileTree'

type ParseResult = { ok: true; tree: TreeNode } | { ok: false; error: string }

export const parseAndValidateTree = (sourceName: string, text: string): ParseResult => {
  let parsed: unknown

  try {
    parsed = JSON.parse(text) as unknown
  } catch {
    return {
      ok: false,
      error: i18n.t('import.invalidJsonFile', { name: sourceName }),
    }
  }

  const result = validateTreeJson(parsed)
  if (result.ok === false) {
    return { ok: false, error: result.error }
  }

  return { ok: true, tree: result.data }
}
