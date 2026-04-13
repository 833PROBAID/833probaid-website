import { handleOtpVerification } from "../../../controllers/authController.js";

export async function POST(request) {
	return handleOtpVerification(request);
}
