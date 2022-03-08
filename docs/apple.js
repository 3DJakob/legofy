self.onmessage = async ($event) => {
  self.postMessage('fooobar');
    // if ($event && $event.data && $event.data.msg === 'incApple') {
    //     const newCounter = incApple($event.data.countApple);
    //     self.postMessage(newCounter);
    // }
};

// function incApple(countApple) {
//     const start = Date.now();
//     while (Date.now() < start + 5000) {
//     }
//     return countApple + 1;
// }