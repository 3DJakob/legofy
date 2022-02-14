import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import img from '../skyrim.jpeg'

interface ContainerProps {
  aspect: number
}

const Container = styled.canvas`
  width: 50vw;
  height: ${(props: ContainerProps) => 50 / props.aspect}vw;
`

const Canvas: React.FC = () => {
  const inputEl = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const [numberOfLego, setNumberOfLego] = useState(40)
  const [legoImg, setLegoImg] = useState<[string[]]>()

  useEffect(() => {
    const image = new Image();
    image.src = "http://localhost:3000/skyrim.jpeg";
    image.onload = () => {
      setAspect(image.width / image.height)
      const context = inputEl?.current?.getContext('2d');
      if (context != null && inputEl?.current) {

        const w = window.innerWidth / 2
        const h = (window.innerWidth / 2) / (image.width / image.height)

        const ratio = window.devicePixelRatio;
        inputEl.current.width = w * ratio;
        inputEl.current.height = h * ratio;
        inputEl.current.style.width = w + "px";
        inputEl.current.style.height = h + "px";
        context.scale(ratio, ratio);

        context.drawImage(image, 0, 0, inputEl?.current?.width ? inputEl?.current?.width / ratio : 0, inputEl?.current?.height ? inputEl?.current?.height / ratio : 0)
        setLoaded(true)
      }
    }
  })

  const getColor = (x: number, y: number): Uint8ClampedArray | undefined => {
    const context = inputEl?.current?.getContext('2d');
    if (context != null && inputEl?.current) {
      const p = context.getImageData(x, y, 1, 1).data; 
      return p
    }
  }

  const getSampleColor = (blockSize: number, xBlockIndex: number, yBlockIndex: number): string => {
    // TODO calculate LEGO piece color
    return '#fff'
  }

  const generateLegoImg = () => {
    const canvasElement = inputEl?.current
    if (canvasElement != null) {
      // console.log(getColor(canvasElement.width -1, canvasElement.height-1))
      const blockSize = Math.round((canvasElement.width -1) / numberOfLego)

      const numberHorizontalLegos = Math.round((canvasElement.width -1) / blockSize)
      const numberVerticalLegos = Math.round((canvasElement.height -1) / blockSize)

      const myLegoImg: [string[]] = [[]]

      for (let y = 0; y < numberVerticalLegos; y++) {
        const toAdd: string[] = []
        for (let x = 0; x < numberHorizontalLegos; x++) {
          toAdd[x] = getSampleColor(blockSize, x, y)
        }
        myLegoImg[y] = toAdd
      }
      console.log(myLegoImg)
    }
  }

  useEffect(() => {
    if (loaded) {
      generateLegoImg()
    }
  }, [loaded])

  return (
    <>
      <Container ref={inputEl} aspect={aspect}>
      </Container>
      <img src={img} width={200} style={{ marginLeft: 20 }}></img>
      <input type="range" value={numberOfLego} onChange={e => setNumberOfLego(e?.target?.value ? Number(e.target.value) : 0)}
         min="2" max="200"/>
      <label >Number of LEGO pieces {numberOfLego}</label>
    </>
  )
}

export default Canvas
