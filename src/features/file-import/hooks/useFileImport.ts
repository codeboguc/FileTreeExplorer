import type { ImportState } from '@/features/file-import/types'
import { parseAndValidateTree } from '@/features/file-import/utils/parseAndValidateTree'
import { getSampleTreeUrl, loadSampleTreeJson } from '@/services/loadSampleTreeJson'
import {
  clearPersistedImportedTree,
  persistImportedTree,
  readPersistedImportedTree,
} from '@/services/workspaceTreeLocalStorage'
import { useState } from 'react'

const initialStatusMessage =
  'Import a JSON file to validate and render the file explorer.'

const initialState: ImportState = {
  selectedFileName: null,
  statusMessage: initialStatusMessage,
  statusType: 'idle',
  treeRoot: null,
}

function buildInitialImportState(): ImportState {
  const persisted = readPersistedImportedTree()
  if (!persisted) {
    return initialState
  }

  const parsedResult = parseAndValidateTree(persisted.sourceName, persisted.rawText)
  if (parsedResult.ok === false) {
    clearPersistedImportedTree()
    return initialState
  }

  return {
    selectedFileName: persisted.sourceName,
    statusMessage: `Restored "${persisted.sourceName}" from browser storage.`,
    statusType: 'success',
    treeRoot: parsedResult.tree,
  }
}

export const useFileImport = () => {
  const [state, setState] = useState<ImportState>(buildInitialImportState)
  /** Increments only after a successful parse in this session (not on localStorage hydrate). */
  const [importSuccessTick, setImportSuccessTick] = useState(0)

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

    persistImportedTree(sourceName, text)

    setImportSuccessTick((t) => t + 1)
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
    const samplePath = getSampleTreeUrl()

    void (async () => {
      try {
        const { text, filename } = await loadSampleTreeJson()
        setState((prev) => ({ ...prev, selectedFileName: filename }))
        applyJsonText(filename, text)
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
    importSuccessTick,
  }
}
