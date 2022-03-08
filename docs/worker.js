// const findColor = (a: LabColor): LabColor | null => {
//   if (legoColors != undefined) {
//     let smallestDist = differenceEuclideanLab(a, legoColors[0])
//     let smallestIndex = 0
//     for (let i = 1; i < legoColors.length; i++) {
//       const dist = differenceEuclideanLab(a, legoColors[i])
//       if (dist < smallestDist) {
//         smallestDist = dist
//         smallestIndex = i
//       }
//     }
//     return legoColors[smallestIndex]
//   }
//   return null
// }

self.addEventListener('findColor', function(e) {
  console.log('hello world')
  var message = e.data + 'to myself!';
  self.postMessage(message);
  self.close();
})

// export {
//   findColor
// }