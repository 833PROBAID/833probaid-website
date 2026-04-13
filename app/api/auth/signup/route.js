import { handleSignup } from "../../../controllers/authController.js";

export async function POST(request) {
	return handleSignup(request);
}
