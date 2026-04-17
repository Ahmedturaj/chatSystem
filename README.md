# Real-Time Group Chat & Community Platform

A full-stack real-time group chat and community system built as part of the interview technical assessment. Users can create/join communities, chat in real-time, see online status, and view message history.

## ✨ Features

### Core Features
- User Authentication (Register & Login with JWT)
- Create, Join, and Leave Groups/Communities
- Real-time messaging using Socket.io
- Messages are stored persistently in MongoDB
- Load previous messages when joining a group
- Real-time online user status in groups
- Typing indicators

### Bonus Implemented
- Clean and responsive UI
- Proper error handling
- Socket authentication with JWT
- Message timestamps and sender info

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose** ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **dotenv** for environment variables

### Frontend
- **React.js** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (for styling)
- **Socket.io-client**
- **React Router DOM**
- **Axios**

text## 🔧 Socket.io Room Management

Socket.io uses **rooms** to handle group chat efficiently:

- Each group has its own **room** (room name = `groupId`)
- When a user joins a group → `socket.join(groupId)`
- Messages are sent only to users in that room using `io.to(groupId).emit()`
- This ensures messages are delivered only to members of that specific group (very efficient and scalable)
- Users automatically leave the room when they disconnect or switch groups

## 📊 MongoDB Message Indexing (Best Practices)

For better performance with large number of messages, add the following indexes:

```js
// In Message model (recommended)
MessageSchema.index({ group: 1, createdAt: -1 });   // Fast message loading per group
MessageSchema.index({ sender: 1 });
These indexes help in quickly fetching the latest messages of a group and improve query performance.

Installation & Setup
1. Backend Setup
Bash# 1. Clone the repository
git clone <your-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file in backend folder
cp .env.example .env
Important: MongoDB DNS Fix (Common in Bangladesh)
If you face this error:
textquerySrv ECONNREFUSED _mongodb._tcp.xxxxx.mongodb.net
Add these two lines at the very top of src/server.ts (before any other imports):
TypeScriptimport dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);   // Google's Public DNS
This fixes DNS resolution issues with MongoDB Atlas SRV records.
4. Environment Variables (.env)
envPORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatapp
JWT_SECRET=your_very_strong_jwt_secret_key_here
NODE_ENV=development
Make sure your MongoDB Atlas IP whitelist allows 0.0.0.0/0 (for development) or add your current IP.
5. Run Backend
Bashnpm run dev
Server should start on http://localhost:5000

2. Frontend Setup
Bash# Open new terminal
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
Frontend will run on http://localhost:5173
📋 How to Use

Register a new account or Login
Go to dashboard
Create a new group or join existing groups
Click on any group to enter chat
Start sending real-time messages
Typing indicators and online status will work automatically

🐞 Troubleshooting
MongoDB Connection Error (querySrv ECONNREFUSED)

Add dns.setServers(['8.8.8.8', '8.8.4.4']) at the top of server.ts
Check your internet connection
Try Cloudflare DNS instead: ['1.1.1.1', '1.0.0.1']

Socket not connecting

Make sure backend is running
Check that frontend socket URL points to correct backend port

CORS Issues

Backend has CORS enabled with origin * (for development)

Future Improvements (Optional)

Message read receipts
File/image sharing
Group admin roles
Search messages
Push notifications

📝 Notes

This project was completed within the given 1 night and 1 day timeline.
Backend reuses the provided authentication boilerplate.
Frontend built from scratch using Vite + React + TypeScript.
All requirements mentioned in the task are fulfilled.