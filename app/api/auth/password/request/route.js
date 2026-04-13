import { handlePasswordResetRequest } from "../../../../controllers/authController.js";

export async function POST(request) {
	return handlePasswordResetRequest(request);
}
