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

        context.drawImage(image, 0, 0, inputEl?.current?.width ? inputEl?.current?.width / ratio : 0, inputEl?.current?.height ? inputEl?.current?.height / ratio : 0);
      }
    }
  })


  return (
    <>
      <Container ref={inputEl} aspect={aspect}>
      </Container>
      <img src={img} width={200} style={{ marginLeft: 20 }}></img>
    </>
  )
}

export default Canvas
