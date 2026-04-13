import { handleLogout } from "../../../controllers/authController.js";

export async function POST() {
	return handleLogout();
}
