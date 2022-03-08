interface Crop {
  x: number,
  y: number,
  w: number,
  h: number
}

interface VideoAndCrop {
  element: HTMLVideoElement,
  crop: Crop
}

export const initiateVideo = async (inputEl: React.RefObject<HTMLCanvasElement>): Promise<HTMLVideoElement> => {
  // Grab elements, create settings, etc.
  try {
    const context = inputEl?.current?.getContext('2d');
    const canvas = inputEl?.current
    if (canvas == null) throw new Error("error")

    const navigator = window.navigator
    // we don't need to append the video to the document
    const video = document.createElement("video")
    const videoObj = {
      video: {
        width: { min: 1280, max: 1280 },
        height: { min: 720, max: 720 },
      }
    }

    // create a crop object that will be calculated on load of the video
    var crop: Crop
    // create a variable that will enable us to stop the loop.
    var raf: number;

    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // Put video listeners into place

    const stream = await navigator.mediaDevices.getUserMedia(videoObj);
    /* use the stream */
    video.srcObject = stream;
    // video.play();
    return video
  } catch (err) {
    /* handle the error */
    throw new Error("error")
  }
}