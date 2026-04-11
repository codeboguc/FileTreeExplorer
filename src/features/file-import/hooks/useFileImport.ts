import { IMPORT_SOURCE_PASTED_LABEL } from '@/features/file-import/importSourceLabels'
import type { ImportState } from '@/features/file-import/types'
import { parseAndValidateTree } from '@/features/file-import/utils/parseAndValidateTree'
import i18n from '@/i18n/config'
import { getSampleTreeUrl, loadSampleTreeJson } from '@/services/loadSampleTreeJson'
import {
  clearPersistedImportedTree,
  persistImportedTree,
  readPersistedImportedTree,
} from '@/services/workspaceTreeLocalStorage'
import { useState } from 'react'

function buildInitialImportState(): ImportState {
  const idleMessage = i18n.t('import.idleHint')
  const initial: ImportState = {
    selectedFileName: null,
    statusMessage: idleMessage,
    statusType: 'idle',
    treeRoot: null,
  }

  const persisted = readPersistedImportedTree()
  if (!persisted) {
    return initial
  }

  const parsedResult = parseAndValidateTree(persisted.sourceName, persisted.rawText)
  if (parsedResult.ok === false) {
    clearPersistedImportedTree()
    return initial
  }

  return {
    selectedFileName: persisted.sourceName,
    statusMessage: i18n.t('import.restored', { name: persisted.sourceName }),
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
      selectedFileName: sourceName,
      statusType: 'success',
      statusMessage: i18n.t('import.loadedOk', { name: sourceName }),
      treeRoot: parsedResult.tree,
    }))
  }

  const handleImportPastedJson = (text: string) => {
    const trimmed = text.trim()
    setState((prev) => ({ ...prev, selectedFileName: IMPORT_SOURCE_PASTED_LABEL }))
    applyJsonText(IMPORT_SOURCE_PASTED_LABEL, trimmed)
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
          statusMessage: i18n.t('import.readFileFailed', { name: file.name }),
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
          statusMessage: i18n.t('import.sampleLoadFailed', { path: samplePath }),
          treeRoot: null,
        }))
      }
    })()
  }

  return {
    state,
    handleFileSelect,
    handleImportPastedJson,
    handleLoadSample,
    importSuccessTick,
  }
}
