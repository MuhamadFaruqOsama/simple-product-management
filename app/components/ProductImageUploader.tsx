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

type ProductImageUploaderProps = {
  value: File | null;
  onChange: (file: File | null) => void
}

export function ProductImageUploader({
  value,
  onChange
}: ProductImageUploaderProps) {
    const handleUpdateFiles = (fileItems: FilePondFile[]) => {
      const file = fileItems[0]?.file;
      onChange(file instanceof File ? file : null);
    };

  return (
    <div className="w-full">
      <FilePond
        files={value ? [value] : []}
        onupdatefiles={handleUpdateFiles}
        maxFiles={1}
        name="thumbnail"
        acceptedFileTypes={[
            "image/jpeg",
            "image/png"
        ]}
        labelIdle='Seret & Lepas file Anda atau <span class="filepond--label-action">Telusuri</span>'
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {value ? `${value} file dipilih` : 'Belum ada file yang dipilih'}
      </p>
    </div>
  )
}
