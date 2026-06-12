'use client'

import { Download } from 'lucide-react'
import { useRef } from 'react'
import Barcode from 'react-barcode'

import { Button } from '@/components/ui/button'

interface BarcodeDisplayProps {
  value: string
  fileName: string
  downloadLabel: string
  previewLabel: string
}

export function BarcodeDisplay({ value, fileName, downloadLabel, previewLabel }: BarcodeDisplayProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleDownload = (): void => {
    const svg = containerRef.current?.querySelector('svg')

    if (!svg) {
      return
    }

    if (!containerRef.current) {
      return
    }

    const computedStyle = window.getComputedStyle(containerRef.current)
    
    // Scale factor for high definition (e.g., 4x)
    const scale = 4
    const attrWidth = svg.getAttribute('width')
    const attrHeight = svg.getAttribute('height')
    
    const parsedWidth = attrWidth ? parseFloat(attrWidth) : NaN
    const parsedHeight = attrHeight ? parseFloat(attrHeight) : NaN
    
    const intrinsicWidth = isNaN(parsedWidth) ? svg.getBoundingClientRect().width : parsedWidth
    const intrinsicHeight = isNaN(parsedHeight) ? svg.getBoundingClientRect().height : parsedHeight
    
    const width = Math.ceil(intrinsicWidth * scale)
    const height = Math.ceil(intrinsicHeight * scale)

    const clonedSvg = svg.cloneNode(true) as SVGElement
    clonedSvg.setAttribute('color', computedStyle.color)
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clonedSvg.style.backgroundColor = computedStyle.backgroundColor
    clonedSvg.setAttribute('width', width.toString())
    clonedSvg.setAttribute('height', height.toString())
    
    if (!clonedSvg.getAttribute('viewBox')) {
      clonedSvg.setAttribute('viewBox', `0 0 ${intrinsicWidth} ${intrinsicHeight}`)
    }

    const serializedSvg = new XMLSerializer().serializeToString(clonedSvg)
    const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' })
    const objectUrl = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = (): void => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')

      if (!context) {
        URL.revokeObjectURL(objectUrl)
        return
      }

      context.drawImage(image, 0, 0, width, height)
      URL.revokeObjectURL(objectUrl)

      const downloadUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${fileName}.png`
      link.click()
    }

    image.src = objectUrl
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        aria-label={previewLabel}
        className="bg-card text-foreground inline-flex max-w-[190px] items-center justify-center overflow-hidden rounded-lg border p-2 [&_svg]:h-auto [&_svg]:max-w-full"
      >
        <Barcode
          value={value}
          format="CODE128"
          renderer="svg"
          width={1.25}
          height={42}
          margin={4}
          fontSize={12}
          lineColor="currentColor"
          background="transparent"
        />
      </div>
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleDownload}>
        <Download className="h-4 w-4" />
        {downloadLabel}
      </Button>
    </div>
  )
}
