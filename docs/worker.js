const euclidean = (a, b) => {
  return Math.pow(a.l - b.l, 2) + Math.pow(a.a - b.a, 2) + Math.pow(a.b - b.b, 2)
}

const findColor = (a, legoColors) => {
  if (legoColors != undefined) {
    let smallestDist = euclidean(a, legoColors[0])
    
    let smallestIndex = 0
    for (let i = 1; i < legoColors.length; i++) {
      const dist = euclidean(a, legoColors[i])
      if (dist < smallestDist) {
        smallestDist = dist
        smallestIndex = i
      }
    }
    return legoColors[smallestIndex]
  }
  return null
}

self.onmessage = ($event) => {
  const data = $event.data
  const answer = {color: findColor(data.color, data.legoColors), posX: data.posX, posY: data.posY}
  self.postMessage(answer)
}