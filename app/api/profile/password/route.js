import { handleChangePassword } from "../../../controllers/profileController.js";

export async function POST(request) {
	return handleChangePassword(request);
}
