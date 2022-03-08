import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { lab, LabColor } from 'd3-color'
import { initiateVideo } from '../utils/video'
import Title from './Title'
// @ts-expect-error
import Switch from 'react-ios-switch'
import { useDropzone } from 'react-dropzone'


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

const Controls = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`

const DropContainer = styled.div`
  padding: 20px;
  background-color: #ccc;
  margin: 20px 0;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

let usingWebcamGlobal = false

const Canvas: React.FC = () => {
  const inputEl = useRef<HTMLCanvasElement>(null)
  const paintingEl = useRef<HTMLCanvasElement>(null)
  const [numberOfLego, setNumberOfLego] = useState(37)
  const [imgURL, setImgURL] = useState(window.location.href + '/sample.jpg')
  const [usingWebcam, setUsingWebCam] = useState(false)
  const worker: Worker = new Worker('./worker.js')

  const [h, setH] = useState(1)
  const [w, setW] = useState(1)
  const blockSize = Math.round((w) / numberOfLego)

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImgURL(URL.createObjectURL(img))
    }
  }

  const drawImage = async () => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = imgURL
      image.onload = () => {
        const context = inputEl?.current?.getContext('2d');
        if (context != null && inputEl?.current) {
          const w = window.innerWidth / 2
          const h = (window.innerWidth / 2) / (image.width / image.height)
          setH(h)
          setW(w)
          // const ratio = window.devicePixelRatio
          // context.scale(ratio, ratio)
          const ratio = 1
          context.drawImage(image, 0, 0, inputEl?.current?.width ? inputEl?.current?.width / ratio : 0, inputEl?.current?.height ? inputEl?.current?.height / ratio : 0)
          resolve(1)
        }
      }
    })
  }

  useEffect(() => {
    drawImage()
  }, [imgURL])

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
    const color = getColor(x, y)
    if (color != undefined) {
      return 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')'
    }
    console.log('error')
    return '#fff'
  }

  useEffect(() => {
    worker.onmessage = ($event: MessageEvent) => {
      if ($event && $event.data) {
        const resColor = $event.data.color
        addLegoPiece(lab(resColor.l, resColor.a, resColor.b), $event.data.posX, $event.data.posY)
      }
    }
  }, [worker])

  useEffect(() => {
    const context = inputEl?.current?.getContext('2d')
    if (context != null) {
      const ratio = window.devicePixelRatio
      context.scale(ratio, ratio)
    }
  }, [])

  // console.log(JSON.stringify(legoColors?.map(c => {return  {l: Math.round(c.l), a: Math.round(c.a), b: Math.round(c.b)}})))

  const addLegoPiece = (color: LabColor, x: number, y: number) => {
    const context = paintingEl?.current?.getContext('2d')

    if (color != null) {
      if (context != null && paintingEl?.current) {
        context.translate(x + blockSize / 2, y + blockSize / 2)
        context.rotate(Math.random() / 10 - 0.05)
        context.translate(-x - blockSize / 2, -y - blockSize / 2)
        context.beginPath()
        context.fillStyle = color.brighter(-0.15).formatHex()
        context.rect(x, y, blockSize, blockSize)
        context.fill()
        context.closePath()
        context.resetTransform()

        context.beginPath()
        context.fillStyle = color.brighter(-0.3).formatHex()
        context.arc(x + blockSize / 2 + 2, y + blockSize / 2 + 2, blockSize * 0.57 / 2, 0, 2 * Math.PI)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = color.brighter(0.15).formatHex()
        context.arc(x + blockSize / 2, y + blockSize / 2, blockSize * 0.57 / 2, 0, 2 * Math.PI)
        context.fill()
        context.closePath()
      }
    }
  }

  const generateLegos = () => {
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
          worker.postMessage({ color: lab(getSampleColor(posX, posY)), posX, posY, });
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
    if (w > 1 && h > 1 && usingWebcamGlobal === false) {
      drawImage().then(() => {
        clearCanvas()
        generateLegos()
      })
    }
  }, [w, h, numberOfLego])

  const loopGenerate = async () => {
    while (usingWebcamGlobal) {
      generateLegos()
      // TODO wait untill all workers are done then loop
      await delay(10)
      // clearCanvas()
    }
  }

  const InitiateWebcam = async () => {
    const w = window.innerWidth / 2
    const h = (window.innerWidth / 2) / (16 / 9)
    setH(h)
    setW(w)
    console.log(h, w)
    const video = await initiateVideo(inputEl)

    const context = inputEl?.current?.getContext('2d');
    const canvas = inputEl?.current


    let crop: {
      x: number,
      y: number,
      w: number,
      h: number
    }

    video.onplaying = function () {
      if (canvas) {
        crop = { w: video.videoWidth, h: video.videoHeight, x: 0, y: 0 };
        // call our loop only when the video is playing
        requestAnimationFrame(loop);
      }
    }
    video.play()


    function loop() {
      if (context && canvas && usingWebcamGlobal) {
        context.drawImage(video, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height);
        if (usingWebcamGlobal) {
          requestAnimationFrame(loop)
        }
      }
    }
  }

  useEffect(() => {
    if (usingWebcam) {
      InitiateWebcam()
    } else {
      drawImage().then(() => {
        if (w > 1 && h > 1) {
          clearCanvas()
          generateLegos()
        }
      })
    }
    loopGenerate()
  }, [usingWebcam])

  const onDrop = useCallback(acceptedFiles => {
    setImgURL(URL.createObjectURL(acceptedFiles[0]))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Container>
      <PaintingsContainer>
        <Painting ref={inputEl} width={w} height={h}>
        </Painting>
        <Painting ref={paintingEl} width={w} height={h} >
        </Painting>
      </PaintingsContainer>

      <Controls>
        <Title>LEGOFY your images or webcam!</Title>

        <label >Number of LEGO pieces {numberOfLego}</label>
        <input type="range" value={numberOfLego} onChange={e => setNumberOfLego(e?.target?.value ? Number(e.target.value) : 0)}
          min="2" max="200" />
        <Row>       
          <Switch
          checked={usingWebcam}
          onChange={() => {
            setUsingWebCam(!usingWebcam)
            usingWebcamGlobal = !usingWebcam
          }}
        />
        <p style={{marginLeft: 10}}>Use webcamera</p>
        </Row>


        <DropContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </DropContainer>
      </Controls>
    </Container>
  )
}

export default Canvas
