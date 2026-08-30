export type DetectionItem = {
  className: string
  confidence: number
  box: number[]
}

export type DetectResult = {
  image: string
  detections: DetectionItem[]
  message: string
}
