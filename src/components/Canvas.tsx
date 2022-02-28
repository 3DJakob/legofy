import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { lab, LabColor } from 'd3-color'
// @ts-expect-error
import { differenceEuclideanLab } from 'd3-color-difference'
// @ts-expect-error
import colors from '../colors.csv'
import * as d3 from 'd3'

const Painting = styled.canvas`
  img {
    position: absolute;
    top: 0;
    left: 0;
  }
  background-color: black;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const PaintingsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Canvas: React.FC = () => {
  const inputEl = useRef<HTMLCanvasElement>(null)
  const paintingEl = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [numberOfLego, setNumberOfLego] = useState(40)
  const [legoColors, setLegoColors] = useState<LabColor[]>()

  const [h, setH] = useState(1)
  const [w, setW] = useState(1)

  const findColor = (a: LabColor): LabColor | null => {
    if (legoColors != undefined) {
      let smallestDist = differenceEuclideanLab(a, legoColors[0])
      let smallestIndex = 0
      for (let i = 1; i < legoColors.length; i++) {
        const dist = differenceEuclideanLab(a, legoColors[i])
        if (dist < smallestDist) {
          smallestDist = dist
          smallestIndex = i
        }
      }
      return legoColors[smallestIndex]
    }
    return null
  }

  const loadColors = async () => {
    const res: LabColor[] = []
    // @ts-expect-error
    await d3.csv(colors, function (data: any) {
      if (data.is_trans === 'f') {
        res.push(lab('#' + data.rgb))
      }
    })
    setLegoColors(res)
  }

  useEffect(() => {
    const image = new Image();
    image.src = "http://localhost:3000/skyrim.jpeg";
    image.onload = () => {
      const context = inputEl?.current?.getContext('2d');
      if (context != null && inputEl?.current) {
        const w = window.innerWidth / 2
        const h = (window.innerWidth / 2) / (image.width / image.height)
        setH(h)
        setW(w)
        const ratio = window.devicePixelRatio
        context.scale(ratio, ratio)
        context.drawImage(image, 0, 0, inputEl?.current?.width ? inputEl?.current?.width / ratio : 0, inputEl?.current?.height ? inputEl?.current?.height / ratio : 0)
      }
    }
    loadColors().then(() => setLoaded(true))
  }, [])

  const delay = async (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const getColor = (x: number, y: number): Uint8ClampedArray | undefined => {
    const context = inputEl?.current?.getContext('2d')
    if (context != null && inputEl?.current) {
      const p = context.getImageData(x, y, 1, 1).data
      return p
    }
  }

  const getSampleColor = (x: number, y: number): string => {
    // TODO calculate LEGO piece color
    const color = getColor(x, y)
    if (color != undefined) {
      return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')'
    }
    console.log('error')
    return '#fff'
  }

  const addLegoPiece = (color: string, x: number, y: number, blockSize: number) => {
    const context = paintingEl?.current?.getContext('2d')
    const labColor = lab(color)
    const closestLabColor = findColor(labColor)

    if (closestLabColor != null) {
      if (context != null && paintingEl?.current) {
        context.translate(x + blockSize / 2, y + blockSize / 2)
        context.rotate(Math.random() / 10 - 0.05)
        context.translate(-x - blockSize / 2, -y - blockSize / 2)
        context.beginPath()
        context.fillStyle = closestLabColor.brighter(-0.15).formatHex()
        context.rect(x, y, blockSize, blockSize)
        context.fill()
        context.closePath()
        context.resetTransform()

        context.beginPath()
        context.fillStyle = closestLabColor.brighter(-0.3).formatHex()
        context.arc(x + blockSize / 2 + 2, y + blockSize / 2 + 2, blockSize * 0.57 / 2, 0, 2 * Math.PI)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = closestLabColor.brighter(0.15).formatHex()
        context.arc(x + blockSize / 2, y + blockSize / 2, blockSize * 0.57 / 2, 0, 2 * Math.PI)
        context.fill()
        context.closePath()
      }
    }
  }

  const generateLegos = async (): Promise<void> => {
    const canvasElement = inputEl?.current
    if (canvasElement != null) {
      const blockSize = Math.round((w) / numberOfLego)
      const numberHorizontalLegos = Math.round(w / blockSize)
      const numberVerticalLegos = Math.round(h / blockSize)
      for (let y = 0; y < numberVerticalLegos; y++) {
        for (let x = 0; x < numberHorizontalLegos; x++) {
          const posX = x * blockSize
          const posY = y * blockSize
          // Paint!
          addLegoPiece(getSampleColor(posX, posY), posX, posY, blockSize)
          // await delay(1)
        }
      }
    }
  }

  const clearCanvas = () => {
    const context = paintingEl?.current?.getContext('2d')
    if (context != null && paintingEl?.current) {
      context.clearRect(0, 0, w, h);
    }
  }

  useEffect(() => {
    if (loaded && w > 1 && h > 1) {
      clearCanvas()
      generateLegos()
    }
  }, [loaded, w, h, numberOfLego])

  return (
    <Container>
      <PaintingsContainer>
        {/* <img src={img} width={200} style={{ marginLeft: 20 }}></img> */}
        <Painting ref={inputEl} width={w} height={h}>
        </Painting>
        <Painting ref={paintingEl} width={w} height={h} >
        </Painting>
      </PaintingsContainer>

      <input type="range" value={numberOfLego} onChange={e => setNumberOfLego(e?.target?.value ? Number(e.target.value) : 0)}
        min="2" max="200" />
      <label >Number of LEGO pieces {numberOfLego}</label>
    </Container>
  )
}

export default Canvas
