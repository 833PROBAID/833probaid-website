import mongoose from "mongoose";

const connectionState = {
	isConnected: 0,
};

export default async function connectToDatabase() {
	if (connectionState.isConnected) {
		return;
	}

	const uri = process.env.MONGODB_URI;

	if (!uri) {
		throw new Error("MONGODB_URI is not set");
	}

	if (mongoose.connections.length > 0) {
		connectionState.isConnected = mongoose.connections[0].readyState;
		if (connectionState.isConnected === 1) {
			return;
		}
		await mongoose.disconnect();
	}

	const options = {
		maxPoolSize: 10,
		minPoolSize: 0,
		autoIndex: false,
		serverSelectionTimeoutMS: 5000,
	};

	const db = await mongoose.connect(uri, options);
	connectionState.isConnected = db.connections[0].readyState;
}
