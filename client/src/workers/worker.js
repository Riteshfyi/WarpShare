let chunks = [];
let startTime;
let fileSize;
let chunkSize = 16000;
let currentChunk = 0;
let totalChunks;
let currentProgress = 0;
let prevProgress = 0;

onmessage = function(event) {
    if(event.data.status === "fileInfo"){
        fileSize = event.data.fileSize;
        totalChunks = Math.ceil(fileSize/chunkSize);
    }else if(event.data === "download"){
        const blob = new Blob(chunks,{type : "application/octet-stream"});
        const endTime  = performance.now();
        const elapsedTime = endTime - startTime;

        postMessage({
            blob:blob,
            timeTaken:elapsedTime
        })

        chunks = [];
        currentChunk = 0;
    }else{
        if(!startTime){
            startTime = performance.now();
        }

        chunks.push(new Uint8Array(event.data));

        currentChunk++;

        const progress = (currentChunk/totalChunks)*100;

        const roundedProgress = Math.floor(progress);

        if(roundedProgress != prevProgress){
            prevProgress = roundedProgress;
            postMessage({
                progress:prevProgress,
            })
        }
    }}
