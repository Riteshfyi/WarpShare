WarpShare
WarpShare is a real-time file sharing and messaging platform that enables fast, secure, and peer-to-peer transfers without intermediaries. Built using WebRTC & Socket.io, it allows users to exchange files and messages instantly over the web.

🚀 Features
LAN-based Peer-to-Peer File Sharing
Enables high-speed file transfers between devices on the same local network.

WebRTC-powered Transfers
Utilizes WebRTC for direct peer-to-peer communication, bypassing central servers for actual file data transfer.

Chunk-based File Transfer
Supports large file sharing by breaking data into 32KB chunks, improving reliability and performance.

WebSocket Signaling
Uses Socket.io for real-time signaling between peers, allowing seamless session setup and connection negotiation.

Node.js STUN Server Integration
Custom signaling via a Node.js-based STUN server enables discovery and connection between peers.

Asynchronous File Processing
Uses Node.js workers to manage concurrent file read/write operations without blocking the main thread.

Secure & Fast
Transfers occur directly between peers on the same network, minimizing latency and reducing external exposure.

🛠️ Tech Stack
Frontend: React.js

Backend: Node.js, Express

Real-time Communication: WebRTC, Socket.io

Worker Threads: Node.js Worker Threads for non-blocking operations

STUN/Signaling: Custom WebSocket-based server

📷 Demo
Coming soon...

🔧 Installation & Setup
Clone the repo

bash
Copy
Edit
git clone https://github.com/Riteshfyi/WarpShare.git
cd WarpShare
Install dependencies

bash
Copy
Edit
npm install       # for backend
cd client
npm install       # for frontend
Run the app

bash
Copy
Edit
# In the root directory
npm run dev       # Runs both client and server concurrently
Access the app
Open your browser and visit: http://localhost:3000

📡 How It Works
On connection, peers are introduced via the signaling server.

WebRTC establishes a direct peer-to-peer link.

Files are read, chunked into 32KB packets, and streamed to the other peer.

The receiving peer reconstructs the file using a worker for efficient processing.

💡 Use Cases
Quick file sharing during local hackathons or LAN parties.

Sharing media or documents within a private network without external servers.

Secure messaging and file transfer within intranet environments.
