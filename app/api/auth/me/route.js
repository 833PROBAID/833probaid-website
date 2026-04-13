import { handleSession } from "../../../controllers/sessionController.js";

export async function GET(request) {
	return handleSession(request);
}
