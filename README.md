
---

# 🚀 WarpShare

**WarpShare** is a peer to peer file sharing and messaging platform that enables fast, secure, and peer-to-peer transfers without intermediaries. Built using **WebRTC** & **Socket.io**, it allows users to exchange files and messages instantly over the local area network.

---

## 💭 Motivation

As a student, I often faced situations where I needed to transfer large files—like software tools such as Vivado—from friends, but didn’t have a high-capacity pen drive or external storage. In such cases, file sharing becomes unnecessarily complicated.

In college environments, a lot of bandwidth and time is wasted downloading files from the internet—when in reality, many peers already have the required resources. **WarpShare** was built to solve this: enabling fast, peer-to-peer file transfers over LAN..
![image](https://github.com/user-attachments/assets/8856acfa-9677-427d-87e3-2b8b98674535)

---

## ✨ Features

* **LAN-based Peer-to-Peer File Sharing**
  High-speed file transfers between devices on the same local network.

* **WebRTC-powered Transfers**
  Direct peer-to-peer communication, bypassing central servers for file data transfer.
  
* **Supports Large File Transfers**
 Uses file streaming to efficiently handle and transfer large files.

* **Chunk-based File Transfer**
  Large files are broken into 32KB chunks for improved performance and reliability.

* **WebSocket Signaling**
  Real-time signaling between peers via Socket.io for seamless connection setup.

* **Node.js STUN Server Integration**
  Custom Node.js-based STUN server to facilitate peer discovery and negotiation.

* **Asynchronous File Processing**
  Node.js worker threads manage file sending/receiving concurrently without blocking.

* **Secure & Fast**
  Transfers occur directly over the local network, reducing latency and external exposure.

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Backend**: Node.js, Express
* **Real-time Communication**: WebRTC, Socket.io
* **Workers**: Node.js Worker Threads
* **Signaling/STUN**: Custom WebSocket-based server

---

🔮 Future Plans
Implement in Java: Rewriting the core chunking and transfer logic in Java to significantly boost performance and enable faster file transfers, especially for larger files.


## 📷 Demo

🚧 Coming soon...

---

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Riteshfyi/WarpShare.git
cd WarpShare
```

### 2. Install dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

### 3. Run the app

In the root directory:

```bash
cd client
npm run dev
cd ..
cd server
node index.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📡 How It Works

1. Peers connect to a signaling server using WebSockets.
2. WebRTC establishes a direct peer-to-peer connection.
3. Files are read, chunked into 32KB packets, and sent via the WebRTC data channel.
4. Node.js workers handle file receiving and reassembly on the other end.

---

## 💡 Use Cases

* Quick file sharing during hackathons or LAN events.
* Sharing files securely within an internal network.
* Local peer-to-peer messaging without third-party dependencies.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

