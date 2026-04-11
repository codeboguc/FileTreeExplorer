import { useState } from 'react'
import { getSampleTreeUrl, loadSampleTreeJson } from '../../../services/loadSampleTreeJson'
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
  }
}
