import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { str6_36 } from "hyperdyperid/lib/str6_36";
import "./polyfills.js";

import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { saveAs } from "file-saver";

import { toast } from "react-toastify";

function App() {
  const [userId, setUserId] = useState("Loading...");
  const [remoteSignal, setRemoteSignal] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("No connection");
  const [receiverId, setReceiverId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedFile, setReceivedFile] = useState(null);
  const [fileSending, setFileSending] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileDownloadProgress, setFileDownloadProgress] = useState(0);
  const [fileReceiving, setFileReceiving] = useState(false);
  const [receivedFileName, setReceivedFileName] = useState("");

  const [messages, setMessages] = useState([]);

  const workerRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

 
  const API = "https://warpshareapi.vercel.app";

  useEffect(() => {
    const socket = io(API);
    socketRef.current = socket;

    socket.on("connect", () => {
      const id = str6_36();
      socket.emit("register", { userId: id, socketId: socket.id });
    });

    socket.on("registered", ({ userId }) => {
      setUserId(userId);
    });

    socket.on("signal", ({ signal, from }) => {
      setSenderId(from);
      if (peerRef.current) {
        peerRef.current.signal(signal);
      } else {
        setRemoteSignal(signal);
      }
    });

    
    workerRef.current = new Worker(
      new URL("./workers/worker.js", import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      if (event.data?.progress) {
        setFileDownloadProgress(Number(event.data.progress));
      } else {
        setReceivedFile(event.data?.blob);
        setFileDownloadProgress(0);
        setFileReceiving(false);
        toast.success("File download ready!");
      }
    };

    return () => {
      socket.disconnect();
      peerRef.current?.destroy();
    };
  }, []);

  const disableConnection = () => {
    try {
      peerRef.current?.destroy();
    } catch (err) {
      console.log("Peer destroy error:", err);
    }
    peerRef.current = null;

    setConnectionStatus("No connection");
    setReceiverId("");
    setRemoteSignal(null);
    setSenderId("");
    setIsConnected(false);
    setMessages([]);
    setUploadFile(null);
    setReceivedFile(null);
    setReceivedFileName("");
    toast.info("Disconnected from peer.");
  };

  const acceptConnection = () => {
    if (!remoteSignal) return;
    const peer = new Peer({ initiator: false, trickle: false });
    peerRef.current = peer;

    peer.on("signal", (signal) => {
      socketRef.current?.emit("signal", { signal, to: senderId, from: userId });
    });

    peer.on("connect", () => {
      setConnectionStatus("Connected");
      setIsConnected(true);
      toast.success("Connected to peer!");
    });

    peer.on("error", (err) => {
      console.log("Peer error:", err);
      toast.error(`Peer error: ${err.message}`);
    });

    peer.on("close", () => {
      console.log("Peer closed");
      disableConnection();
    });

    peer.signal(remoteSignal);
    setConnectionStatus("Connecting...");
    toast.info("Accepting incoming connection...");
    peer.on("data", handlePeerData);
  };

  const createPeer = () => {
    if (receiverId.length !== 6) {
      toast.warn("Enter a valid receiver ID (6 chars)");
      return;
    }
    const peer = new Peer({ initiator: true, trickle: false });
    peerRef.current = peer;

    peer.on("signal", (signal) => {
      socketRef.current.emit("signal", {
        signal,
        to: receiverId,
        from: userId,
      });
    });

    peer.on("connect", () => {
      setConnectionStatus("Connected");
      setIsConnected(true);
      toast.success("Connected to peer!");
    });

    peer.on("error", (err) => {
      console.log("Peer error:", err);
      toast.error(`Peer error: ${err.message}`);
    });

    peer.on("close", () => {
      console.log("Peer closed");
      disableConnection();
    });

    setConnectionStatus("Connecting...");
    toast.info("Attempting to connect...");
    peer.on("data", handlePeerData);
  };

  const handlePeerData = (data) => {
    const str = data.toString();
    let parsedData;
    try {
      parsedData = JSON.parse(str);
    } catch (err) {
      console.log("Failed to parse data:", err);
      return;
    }

    
    if (parsedData.message) {
      setMessages((prev) => [...prev, { from: senderId, text: parsedData.message }]);
      return;
    }

    
    if (parsedData.chunk) {
      setFileReceiving(true);
      handleReceivingData(parsedData.chunk);
    } else if (parsedData.done) {
      handleReceivingData(parsedData);
    } else if (parsedData.info) {
      handleReceivingData(parsedData);
    }
  };

  function handleReceivingData(data) {
    if (data.info) {
      workerRef.current?.postMessage({
        status: "fileInfo",
        fileSize: data.fileSize,
      });
      setReceivedFileName(data.fileName);
    } else if (data.done) {
      workerRef.current?.postMessage("download");
    } else {
      workerRef.current?.postMessage(data);
    }
  }

  const handleFileChange = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleWebRTCUpload = () => {
    if (!peerRef.current || !uploadFile) {
      toast.warn("No file selected or not connected.");
      return;
    }

    const peer = peerRef.current;
    const file = uploadFile;
    const chunkSize = 32 * 1024;
    let offset = 0;

    const readAndSendChunk = () => {
      const chunk = file.slice(offset, offset + chunkSize);
      const reader = new FileReader();

      if (offset === 0) {
        setFileSending(true);
        const fileInfo = {
          info: true,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        };
        peer.write(JSON.stringify(fileInfo));
        toast.info(`Sending file: ${file.name}`);
      }

      reader.onload = (e) => {
        if (e.target?.result) {
          const chunkData = new Uint8Array(e.target.result);
          const progressPayload = {
            chunk: Array.from(chunkData),
            progress: (offset / file.size) * 100,
          };
          peer.write(JSON.stringify(progressPayload));
          setFileUploadProgress((offset / file.size) * 100);

          offset += chunkSize;
          if (offset < file.size) {
            readAndSendChunk();
          } else {
            peer.write(
              JSON.stringify({
                done: true,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
              })
            );
            setFileUploadProgress(100);
            setFileSending(false);
            toast.success("File fully sent!");
          }
        }
      };
      reader.readAsArrayBuffer(chunk);
    };

    readAndSendChunk();
  };

  const fileSaveHandler = () => {
    if (!receivedFile) return;
    const name = receivedFileName || "downloaded_file";
    saveAs(receivedFile, name);
  };

  const clearReceivedFile = () => {
    setReceivedFile(null);
    setReceivedFileName("");
    toast.info("Cleared downloaded file.");
  };

  const handleSendMessage = (msg) => {
    if (!peerRef.current || !isConnected) return;
    const payload = { message: msg };
    peerRef.current.write(JSON.stringify(payload));
    setMessages((prev) => [...prev, { from: userId, text: msg }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-700 text-gray-100">
      
      <div className="p-4 bg-indigo-600 border-b border-indigo-700">
        <h1 className="text-2xl font-bold">WarpShare</h1>
      </div>


      <div className="flex flex-1">

        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-600">
          <Sidebar
            userId={userId}
            receiverId={receiverId}
            setReceiverId={setReceiverId}
            senderId={senderId}
            connectionStatus={connectionStatus}
            isConnected={isConnected}
            createPeer={createPeer}
            acceptConnection={acceptConnection}
            disableConnection={disableConnection}
            fileSending={fileSending}
            fileUploadProgress={fileUploadProgress}
            fileReceiving={fileReceiving}
            fileDownloadProgress={fileDownloadProgress}
            receivedFile={receivedFile}
            receivedFileName={receivedFileName}
            fileSaveHandler={fileSaveHandler}
            handleFileChange={handleFileChange}
            uploadFile={uploadFile}
            handleWebRTCUpload={handleWebRTCUpload}
            clearReceivedFile={clearReceivedFile}
          />
        </div>

        
        <div className="flex-1 p-4">
          <Chat
            disabled={!isConnected}
            onSendMessage={handleSendMessage}
            connectedPeerId={isConnected ? receiverId || senderId : ""}
            messages={messages}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
