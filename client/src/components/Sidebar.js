import ProgressBar from "./progressBar";
import { FaTimes, FaClipboard } from "react-icons/fa";

export default function Sidebar({
  userId,
  receiverId,
  setReceiverId,
  senderId,
  connectionStatus,
  isConnected,
  createPeer,
  acceptConnection,
  disableConnection,
  fileSending,
  fileUploadProgress,
  fileReceiving,
  fileDownloadProgress,
  receivedFile,
  receivedFileName,
  fileSaveHandler,
  handleFileChange,
  uploadFile,
  handleWebRTCUpload,
  clearReceivedFile,
}) {
  
  const truncateFileName = (filename, maxLength = 12) => {
    if (!filename) return "";
    if (filename.length <= maxLength) return filename;
    return filename.slice(0, maxLength - 3) + "...";
  };

  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Get status circle element
  const getStatusCircle = () => {
    if (connectionStatus === "Connected") {
      return <div className="w-3 h-3 rounded-full bg-green-500 inline-block ml-1" />;
    } else if (connectionStatus === "Connecting...") {
      return (
        <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse inline-block ml-1" />
      );
    } else {
      return <div className="w-3 h-3 rounded-full bg-red-500 inline-block ml-1" />;
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-gray-800 shadow-lg text-gray-100">
    
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1 flex items-center">
          My ID
          <FaClipboard
            className="ml-2 cursor-pointer text-indigo-300 hover:text-indigo-500"
            onClick={handleCopy}
            title="Copy ID to clipboard"
          />
        </h3>
        <div className="bg-gray-700 rounded-lg p-2">
          <input
            type="text"
            value={userId}
            readOnly
            className="bg-transparent text-gray-100 w-full text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <span className="text-sm font-semibold">Connection Status</span>
          {getStatusCircle()}
        </div>
      </div>

      {!isConnected && (
        <>
          <h3 className="text-sm font-semibold mb-2">Peer's ID</h3>
          <input
            type="text"
            className="border border-gray-600 rounded-md px-4 py-2 w-full mb-4 bg-gray-700 text-gray-100"
            placeholder="Enter ID"
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId}
          />
          <button
            className="px-4 py-2 rounded-md w-full bg-indigo-500 hover:bg-indigo-600 text-white mb-4"
            onClick={createPeer}
          >
            Connect
          </button>
        </>
      )}

      {senderId && connectionStatus === "No connection" && (
        <div className="mt-4">
          <p>
            Incoming connection from: <span className="font-bold">{senderId}</span>
          </p>
          <button
            className="px-4 py-2 rounded-md w-full bg-green-500 hover:bg-green-600 text-white mt-2"
            onClick={acceptConnection}
          >
            Accept Connection
          </button>
        </div>
      )}

      {isConnected && (
        <button
          className="mt-4 px-4 py-2 rounded-md w-full bg-red-500 hover:bg-red-600 text-white"
          onClick={disableConnection}
        >
          Disconnect
        </button>
      )}

      {isConnected && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Upload</h3>
          <label className="cursor-pointer bg-gray-700 p-2 rounded-lg hover:bg-gray-600 inline-block">
            <input type="file" className="hidden" onChange={handleFileChange} />
            {uploadFile
              ? `${truncateFileName(uploadFile.name, 15)}`
              : `Select File`}
          </label>
          <button
            className="ml-2 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleWebRTCUpload}
          >
            Send
          </button>
        </div>
      )}

      <div className="mt-4">
        {fileSending && (
          <div className="mb-2">
            <p className="text-sm">Uploading...</p>
            <ProgressBar progress={fileUploadProgress} />
          </div>
        )}
        {fileReceiving && (
          <div className="mb-2">
            <p className="text-sm">Downloading...</p>
            <ProgressBar progress={fileDownloadProgress} />
          </div>
        )}
      </div>

      {receivedFile && (
        <div className="mt-2 bg-gray-700 p-2 rounded-md flex items-center justify-between">
          <button
            className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white overflow-hidden whitespace-nowrap text-ellipsis"
            style={{ maxWidth: "70%" }}
            onClick={fileSaveHandler}
            title={receivedFileName}
          >
            Download: {truncateFileName(receivedFileName, 15)}
          </button>
          <FaTimes
            className="ml-2 cursor-pointer text-gray-300 hover:text-red-400"
            onClick={clearReceivedFile}
            title="Clear file"
          />
        </div>
      )}
    </div>
  );
}
