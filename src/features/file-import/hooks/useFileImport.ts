import { useState } from 'react'
import type { ImportState } from '../types'
import { parseAndValidateTree } from '../utils/parseAndValidateTree'

const initialStatusMessage =
  'Import a JSON file to validate and render the file explorer.'

const initialState: ImportState = {
  selectedFileName: null,
  statusMessage: initialStatusMessage,
  statusType: 'idle',
  treeRoot: null,
}

export const useFileImport = () => {
  const [state, setState] = useState<ImportState>(initialState)

  const applyJsonText = (sourceName: string, text: string) => {
    const parsedResult = parseAndValidateTree(sourceName, text)

    if (parsedResult.ok === false) {
      setState((prev) => ({
        ...prev,
        statusType: 'error',
        statusMessage: parsedResult.error,
        treeRoot: null,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      statusType: 'success',
      statusMessage: `"${sourceName}" is valid and loaded successfully.`,
      treeRoot: parsedResult.tree,
    }))
  }

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      return
    }

    setState((prev) => ({ ...prev, selectedFileName: file.name }))

    void file
      .text()
      .then((fileContent) => {
        applyJsonText(file.name, fileContent)
      })
      .catch(() => {
        setState((prev) => ({
          ...prev,
          statusType: 'error',
          statusMessage: `Failed to read file "${file.name}".`,
          treeRoot: null,
        }))
      })
  }

  const handleLoadSample = () => {
    const samplePath = '/file-tree-sample.json'

    void (async () => {
      try {
        const response = await fetch(samplePath)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const sampleText = await response.text()
        setState((prev) => ({ ...prev, selectedFileName: 'file-tree-sample.json' }))
        applyJsonText('file-tree-sample.json', sampleText)
      } catch {
        setState((prev) => ({
          ...prev,
          statusType: 'error',
          statusMessage: `Failed to load sample file from "${samplePath}".`,
          treeRoot: null,
        }))
      }
    })()
  }

  return {
    state,
    handleFileSelect,
    handleLoadSample,
  }
}
