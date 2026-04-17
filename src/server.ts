import mongoose from 'mongoose';
import dns from 'node:dns';
import server from './app';
import config from './app/config';
dns.setServers(['8.8.8.8', '8.8.4.4']);
const PORT = config.port;

const main = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    const mongo = await mongoose.connect(config.mongoUri);
    console.log(` MongoDB connected: ${mongo.connection.host}`);
    server.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Socket.io is ready for real-time communication`);
    });
  } catch (error: any) {
    console.error('Error starting server:', error.message || error);
    process.exit(1);
  }
};
main();