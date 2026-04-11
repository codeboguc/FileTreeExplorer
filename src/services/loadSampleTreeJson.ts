const SAMPLE_PATH = '/file-tree-sample.json'

export type SampleTreeLoadResult = {
  text: string
  filename: string
}

export async function loadSampleTreeJson(): Promise<SampleTreeLoadResult> {
  const response = await fetch(SAMPLE_PATH)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const text = await response.text()
  return { text, filename: 'file-tree-sample.json' }
}

export function getSampleTreeUrl(): string {
  return SAMPLE_PATH
}
