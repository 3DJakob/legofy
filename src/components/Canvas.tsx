import React, { createElement, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { lab, LabColor } from 'd3-color'
import { initiateVideo } from '../utils/video'
import Title from './Title'
// @ts-expect-error
import Switch from 'react-ios-switch'
import { useDropzone } from 'react-dropzone'
import Button from './Button'

interface Lab {
  l: number
  a: number
  b: number
}

const allLegoColors = [
  { l: 27, a: 30, b: -72 }, { l: 5, a: -2, b: -9 }, { l: 37, a: 13, b: -63 }, { l: 44, a: -36, b: 23 }, { l: 54, a: -30, b: -16 }, { l: 44, a: 65, b: 56 }, { l: 59, a: 40, b: -10 }, { l: 27, a: 13, b: 17 }, { l: 66, a: -3, b: 1 }, { l: 46, a: -3, b: 10 }, { l: 82, a: -8, b: -12 }, { l: 59, a: -40, b: 36 }, { l: 63, a: -23, b: -13 }, { l: 63, a: 50, b: 35 }, { l: 74, a: 41, b: 6 }, { l: 84, a: 3, b: 74 }, { l: 100, a: 0, b: 0 }, { l: 85, a: -13, b: 14 }, { l: 92, a: -1, b: 42 }, { l: 83, a: 3, b: 27 }, { l: 82, a: 3, b: -12 }, { l: 85, a: -2, b: 6 }, { l: 30, a: 56, b: -33 }, { l: 27, a: 32, b: -70 }, { l: 70, a: 41, b: 72 }, { l: 39, a: 44, b: -17 }, { l: 87, a: -33, b: 82 }, { l: 58, a: 1, b: 14 }, { l: 77, a: 24, b: -6 }, { l: 58, a: 30, b: -27 }, { l: 87, a: 8, b: -10 }, { l: 39, a: 2, b: 10 }, { l: 60, a: -7, b: -26 }, { l: 65, a: -46, b: 24 }, { l: 47, a: 45, b: -18 }, { l: 16, a: -4, b: -9 }, { l: 85, a: 8, b: 31 }, { l: 56, a: 48, b: -9 }, { l: 23, a: 20, b: 25 }, { l: 67, a: -1, b: -3 }, { l: 46, a: -2, b: 3 }, { l: 59, a: -3, b: -43 }, { l: 80, a: -42, b: 19 }, { l: 5, a: -2, b: -9 }, { l: 46, a: -2, b: 3 }, { l: 87, a: 19, b: 6 }, { l: 88, a: 7, b: 22 }, { l: 100, a: 0, b: 0 }, { l: 69, a: 0, b: -6 }, { l: 61, a: -14, b: 29 }, { l: 73, a: 10, b: 64 }, { l: 56, a: 14, b: 29 }, { l: 28, a: 25, b: -50 }, { l: 39, a: 17, b: 21 }, { l: 45, a: 23, b: -66 }, { l: 66, a: 21, b: 32 }, { l: 82, a: 26, b: 9 }, { l: 38, a: 13, b: -46 }, { l: 51, a: 13, b: -47 }, { l: 81, a: -17, b: 68 }, { l: 83, a: -13, b: -1 }, { l: 89, a: -11, b: 29 }, { l: 80, a: 17, b: 53 }, { l: 5, a: -2, b: -9 }, { l: 5, a: -2, b: -9 }, { l: 56, a: 18, b: 27 }, { l: 67, a: -2, b: -4 }, { l: 56, a: -1, b: -15 }, { l: 78, a: 6, b: 34 }, { l: 37, a: -1, b: 0 }, { l: 71, a: -1, b: 0 }, { l: 90, a: 1, b: 2 }, { l: 92, a: -14, b: 34 }, { l: 59, a: 15, b: 33 }, { l: 57, a: 1, b: 0 }, { l: 96, a: 0, b: 0 }, { l: 80, a: 15, b: 68 }, { l: 77, a: -6, b: -23 }, { l: 39, a: 60, b: 52 }, { l: 94, a: -8, b: 82 }, { l: 74, a: -16, b: -22 }, { l: 21, a: 1, b: -32 }, { l: 26, a: -21, b: 7 }, { l: 56, a: 11, b: 49 }, { l: 15, a: 7, b: 22 }, { l: 57, a: -16, b: -34 }, { l: 24, a: 42, b: 30 }, { l: 54, a: -14, b: -42 }, { l: 65, a: -30, b: -19 }, { l: 77, a: -8, b: -1 }, { l: 63, a: -7, b: 34 }, { l: 68, a: 0, b: 55 }, { l: 61, a: 38, b: 19 }, { l: 70, a: 48, b: -3 }, { l: 73, a: 30, b: 73 }, { l: 45, a: 21, b: -15 }, { l: 74, a: -12, b: 5 }, { l: 49, a: 1, b: -27 }, { l: 89, a: 0, b: 0 }, { l: 57, a: 20, b: 33 }, { l: 76, a: 27, b: 78 }, { l: 46, a: 32, b: 55 }, { l: 90, a: 0, b: 5 }, { l: 87, a: 0, b: 0 }, { l: 63, a: 16, b: -42 }, { l: 45, a: 32, b: -26 }, { l: 59, a: -26, b: -27 }, { l: 36, a: -32, b: 30 }, { l: 44, a: 64, b: 56 }, { l: 81, a: 8, b: 81 }, { l: 69, a: 31, b: 68 }, { l: 96, a: 0, b: 0 }, { l: 74, a: 1, b: -10 }, { l: 64, a: 0, b: 0 }, { l: 39, a: -1, b: -2 }, { l: 40, a: 7, b: 3 }, { l: 33, a: 1, b: -3 }, { l: 7, a: 26, b: 11 }, { l: 35, a: 1, b: 21 }, { l: 51, a: 8, b: 24 }, { l: 81, a: 4, b: 24 }, { l: 41, a: 55, b: 42 }, { l: 60, a: 58, b: 48 }, { l: 65, a: 44, b: 60 }, { l: 77, a: 23, b: 49 }, { l: 91, a: 0, b: 58 }, { l: 87, a: 5, b: 65 }, { l: 77, a: -17, b: 73 }, { l: 68, a: -34, b: 54 }, { l: 57, a: -15, b: 31 }, { l: 50, a: -30, b: -4 }, { l: 45, a: -11, b: -15 }, { l: 36, a: 3, b: -50 }, { l: 69, a: -7, b: -48 }, { l: 67, a: -16, b: -24 }, { l: 59, a: 26, b: 6 }, { l: 70, a: 48, b: -3 }, { l: 100, a: 0, b: 0 }, { l: 39, a: -1, b: -2 }, { l: 64, a: 0, b: 0 }, { l: 36, a: -40, b: 41 }, { l: 68, a: -34, b: 54 }, { l: 36, a: 3, b: -50 }, { l: 67, a: -16, b: -24 }, { l: 20, a: 47, b: -54 }, { l: 29, a: 51, b: 43 }, { l: 87, a: 5, b: 65 }, { l: 77, a: 23, b: 49 }, { l: 65, a: 60, b: 10 }, { l: 74, a: -27, b: -21 }, { l: 86, a: -6, b: 84 }, { l: 52, a: 26, b: 60 }, { l: 68, a: 46, b: 72 }, { l: 58, a: 12, b: 38 }, { l: 69, a: 20, b: 62 }, { l: 50, a: 29, b: 33 }, { l: 58, a: 59, b: 51 }, { l: 46, a: 71, b: 46 }, { l: 37, a: 0, b: -47 }, { l: 51, a: -48, b: 34 }, { l: 27, a: 12, b: 14 }, { l: 6, a: 2, b: -15 }, { l: 60, a: -23, b: -35 }, { l: 58, a: -19, b: -25 }, { l: 94, a: -9, b: 85 }, { l: 89, a: -57, b: 51 }, { l: 52, a: -30, b: 16 }, { l: 69, a: -40, b: 26 }, { l: 84, a: 9, b: 38 }, { l: 32, a: 39, b: 35 }, { l: 68, a: 56, b: -4 }, { l: 43, a: 28, b: 18 }, { l: 51, a: 25, b: 37 }, { l: 48, a: 0, b: 1 }, { l: 49, a: -13, b: 27 }, { l: 71, a: 48, b: 11 }, { l: 5, a: -2, b: -9 }
]

let legoColors: Lab[] = JSON.parse(JSON.stringify(allLegoColors))


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
  background-color: #ddd;
  margin: 20px 0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  const [colorLimit, setColorLimit] = useState(177)
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
          worker.postMessage({ color: lab(getSampleColor(posX, posY)), legoColors: legoColors, posX, posY, });
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

  const calcDistToAll = (a: Lab) => {
    let smallest = 0
    legoColors.forEach(b => {
      if (b != null) {
        const res = Math.pow(a.l - b.l, 2) + Math.pow(a.a - b.a, 2) + Math.pow(a.b - b.b, 2)
        if (smallest > res) {
          smallest = res
        }
      }
    })
    return smallest
  }

  const limit = (limit: number) => {
    const res: (Lab | null)[] = JSON.parse(JSON.stringify(allLegoColors))

    let smallest: number | null = null
    let smallestIndex: number | null = null

    let removed = 0

    while (res.length - removed > limit) {
      console.log(res.length - removed)
      res.forEach((color, i) => {
        if (color !== null) {
          const current = calcDistToAll(color)
          if (smallest == null || current < smallest) {
            smallestIndex = i
            smallest = current
          }
        }
      })
      if (smallestIndex == null) {
        alert('ERROR')
      } else {
        res[smallestIndex] = null
      }
      smallest = null
      smallestIndex = null
      removed++
    }

    legoColors = res.filter(item => item != null) as Lab[]
    clearCanvas()
    generateLegos()
  }

  useEffect(() => {
    if (colorLimit !== legoColors.length) {
      limit(colorLimit)
    }
  }, [colorLimit])

  function saveImage() {
    const canvas = paintingEl?.current

    if (canvas) {
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      const link = document.createElement('a')
      link.setAttribute('download', 'LEGO.png')
      link.setAttribute('href', image)
      link.click()
    }
  }

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
        <label >Number of LEGO colors {colorLimit}</label>
        <input type="range" value={colorLimit} onChange={e => setColorLimit(e?.target?.value ? Number(e.target.value) : 0)}
          min="0" max="177" />
        <Row>
          <Switch
            checked={usingWebcam}
            onChange={() => {
              setUsingWebCam(!usingWebcam)
              usingWebcamGlobal = !usingWebcam
            }}
          />
          <p style={{ marginLeft: 10 }}>Use webcamera</p>
        </Row>


        <DropContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </DropContainer>
        <Button onClick={saveImage}>Save image</Button>
      </Controls>
    </Container>
  )
}

export default Canvas
