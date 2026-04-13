import { handlePasswordResetVerify } from "../../../../controllers/authController.js";

export async function POST(request) {
	return handlePasswordResetVerify(request);
}
