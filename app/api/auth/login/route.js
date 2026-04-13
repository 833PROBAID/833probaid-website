import { handleLogin } from "../../../controllers/authController.js";

export async function POST(request) {
	return handleLogin(request);
}
