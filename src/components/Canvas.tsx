import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Painting = styled.canvas`
  img {
    position: absolute;
    top: 0;
    left: 0;
  }
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
  const [legoImg, setLegoImg] = useState<[string[]]>()

  const [h, setH] = useState(1)
  const [w, setW] = useState(1)

  useEffect(() => {
    const image = new Image();
    image.src = "http://localhost:3001/skyrim.jpeg";
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
        setLoaded(true)
      }
    }
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
    if (context != null && paintingEl?.current) {
      context.beginPath()
      context.fillStyle = color
      context.rect(x, y, blockSize, blockSize)
      context.fill()
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
          console.log('draw')
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
