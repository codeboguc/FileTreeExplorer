import {
  File,
  FileArchive,
  FileAudio,
  FileCode2,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
} from 'lucide-react'
import { TreeNodeType } from '../../../lib/fileTree'
import { FileIconKind, getFileIconKind } from '../utils/nodeIcons'

type NodeIconProps = {
  type: TreeNodeType
  name: string
  isExpanded?: boolean
  isEmptyFolder?: boolean
}

function EmptyFolderIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="icon-empty-folder"
    >
      <path
        d="M1.5 4.5A1.5 1.5 0 0 1 3 3h2.2c.4 0 .78.16 1.06.44l.3.3c.28.28.66.44 1.06.44H13A1.5 1.5 0 0 1 14.5 5.7v5.8A1.5 1.5 0 0 1 13 13H3A1.5 1.5 0 0 1 1.5 11.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8.7" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function NodeIcon({ type, name, isExpanded, isEmptyFolder }: NodeIconProps) {
  if (type === TreeNodeType.Folder) {
    if (isEmptyFolder) {
      return <EmptyFolderIcon />
    }
    return isExpanded ? (
      <FolderOpen size={16} className="icon-folder" aria-hidden="true" />
    ) : (
      <Folder size={16} className="icon-folder" aria-hidden="true" />
    )
  }

  const fileIconKind = getFileIconKind(name)
  switch (fileIconKind) {
    case FileIconKind.Code:
      return <FileCode2 size={16} className="icon-code" aria-hidden="true" />
    case FileIconKind.Json:
      return <FileJson size={16} className="icon-json" aria-hidden="true" />
    case FileIconKind.Text:
      return <FileText size={16} className="icon-text" aria-hidden="true" />
    case FileIconKind.Sheet:
      return <FileSpreadsheet size={16} className="icon-sheet" aria-hidden="true" />
    case FileIconKind.Image:
      return <FileImage size={16} className="icon-image" aria-hidden="true" />
    case FileIconKind.Archive:
      return <FileArchive size={16} className="icon-archive" aria-hidden="true" />
    case FileIconKind.Audio:
      return <FileAudio size={16} className="icon-audio" aria-hidden="true" />
    case FileIconKind.Video:
      return <FileVideo size={16} className="icon-video" aria-hidden="true" />
    case FileIconKind.Generic:
    default:
      return <File size={16} className="icon-generic" aria-hidden="true" />
  }
}
