import { validateTreeJson, type TreeNode } from '../../../lib/fileTree'

type ParseResult = { ok: true; tree: TreeNode } | { ok: false; error: string }

export const parseAndValidateTree = (sourceName: string, text: string): ParseResult => {
  let parsed: unknown

  try {
    parsed = JSON.parse(text) as unknown
  } catch {
    return { ok: false, error: `"${sourceName}" is not a valid JSON file.` }
  }

  const result = validateTreeJson(parsed)
  if (result.ok === false) {
    return { ok: false, error: result.error }
  }

  return { ok: true, tree: result.data }
}
