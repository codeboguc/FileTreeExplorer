export enum FileIconKind {
  Generic = 'generic',
  Code = 'code',
  Json = 'json',
  Text = 'text',
  Sheet = 'sheet',
  Image = 'image',
  Archive = 'archive',
  Audio = 'audio',
  Video = 'video',
}

export enum KnownFileExtension {
  Ts = 'ts',
  Tsx = 'tsx',
  Js = 'js',
  Jsx = 'jsx',
  Css = 'css',
  Scss = 'scss',
  Html = 'html',
  Json = 'json',
  Md = 'md',
  Txt = 'txt',
  Yml = 'yml',
  Yaml = 'yaml',
  Csv = 'csv',
  Png = 'png',
  Jpg = 'jpg',
  Jpeg = 'jpeg',
  Gif = 'gif',
  Webp = 'webp',
  Svg = 'svg',
  Zip = 'zip',
  Gz = 'gz',
  Mp3 = 'mp3',
  Wav = 'wav',
  Mp4 = 'mp4',
  Webm = 'webm',
}

export enum FileExtensionKind {
  Known = 'known',
  Unknown = 'unknown',
}

type FileExtensionMatch =
  | { kind: FileExtensionKind.Known; extension: KnownFileExtension }
  | { kind: FileExtensionKind.Unknown; extension: 'unknown' }

const fileIconByExtension: Record<KnownFileExtension, FileIconKind> = {
  [KnownFileExtension.Ts]: FileIconKind.Code,
  [KnownFileExtension.Tsx]: FileIconKind.Code,
  [KnownFileExtension.Js]: FileIconKind.Code,
  [KnownFileExtension.Jsx]: FileIconKind.Code,
  [KnownFileExtension.Css]: FileIconKind.Code,
  [KnownFileExtension.Scss]: FileIconKind.Code,
  [KnownFileExtension.Html]: FileIconKind.Code,
  [KnownFileExtension.Json]: FileIconKind.Json,
  [KnownFileExtension.Md]: FileIconKind.Text,
  [KnownFileExtension.Txt]: FileIconKind.Text,
  [KnownFileExtension.Yml]: FileIconKind.Text,
  [KnownFileExtension.Yaml]: FileIconKind.Text,
  [KnownFileExtension.Csv]: FileIconKind.Sheet,
  [KnownFileExtension.Png]: FileIconKind.Image,
  [KnownFileExtension.Jpg]: FileIconKind.Image,
  [KnownFileExtension.Jpeg]: FileIconKind.Image,
  [KnownFileExtension.Gif]: FileIconKind.Image,
  [KnownFileExtension.Webp]: FileIconKind.Image,
  [KnownFileExtension.Svg]: FileIconKind.Image,
  [KnownFileExtension.Zip]: FileIconKind.Archive,
  [KnownFileExtension.Gz]: FileIconKind.Archive,
  [KnownFileExtension.Mp3]: FileIconKind.Audio,
  [KnownFileExtension.Wav]: FileIconKind.Audio,
  [KnownFileExtension.Mp4]: FileIconKind.Video,
  [KnownFileExtension.Webm]: FileIconKind.Video,
}

const knownExtensions = new Set<string>(Object.values(KnownFileExtension))

const getFileExtension = (name: string): string | null => {
  const extension = name.split('.').pop()?.toLowerCase()
  if (!extension || extension === name.toLowerCase()) {
    return null
  }
  return extension
}

export const getFileExtensionMatch = (name: string): FileExtensionMatch => {
  const extension = getFileExtension(name)
  if (!extension || !knownExtensions.has(extension)) {
    return { kind: FileExtensionKind.Unknown, extension: 'unknown' }
  }

  return {
    kind: FileExtensionKind.Known,
    extension: extension as KnownFileExtension,
  }
}

export const getFileIconKind = (name: string): FileIconKind => {
  const match = getFileExtensionMatch(name)
  if (match.kind === FileExtensionKind.Unknown) {
    return FileIconKind.Generic
  }
  return fileIconByExtension[match.extension]
}
