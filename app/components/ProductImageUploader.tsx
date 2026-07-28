"use client"

import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import type { FilePondFile } from 'filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export function ProductImageUploader() {
  const [files, setFiles] = useState<FilePondFile[]>([])

  return (
    <div className="w-full">
      <FilePond
        onupdatefiles={setFiles}
        allowMultiple
        maxFiles={3}
        server="/api"
        name="files"
        labelIdle='Seret & Lepas file Anda atau <span class="filepond--label-action">Telusuri</span>'
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {files.length > 0 ? `${files.length} file dipilih` : 'Belum ada file yang dipilih'}
      </p>
    </div>
  )
}
