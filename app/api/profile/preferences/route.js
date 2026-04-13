import { handleUpdateSettings, handleGetProfile } from "../../../controllers/profileController.js";

export async function GET(request) {
	return handleGetProfile(request);
}

export async function PUT(request) {
	return handleUpdateSettings(request);
}
