import dns from "node:dns";
import mongoose from "mongoose";

const connectionState = {
	isConnected: 0,
	promise: null,
};

export default async function connectToDatabase() {
	if (mongoose.connection.readyState === 1) {
		connectionState.isConnected = 1;
		return;
	}

	const uri = process.env.MONGODB_URI;

	if (!uri) {
		throw new Error("MONGODB_URI is not set");
	}

	if (connectionState.promise) {
		await connectionState.promise;
		return;
	}

	const options = {
		maxPoolSize: 10,
		minPoolSize: 0,
		autoIndex: false,
		serverSelectionTimeoutMS: 5000,
	};

	if (uri.startsWith("mongodb+srv://")) {
		dns.setServers(["1.1.1.1", "8.8.8.8"]);
	}

	connectionState.promise = mongoose.connect(uri, options);

	try {
		const db = await connectionState.promise;
		connectionState.isConnected = mongoose.connection.readyState;
	} finally {
		connectionState.promise = null;
	}
}
