import { handleGetProfile, handleUpdateProfile } from "../../controllers/profileController.js";

export async function GET(request) {
	return handleGetProfile(request);
}

export async function PUT(request) {
	return handleUpdateProfile(request);
}
