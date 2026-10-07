import apiClient from "./client";

const credentials = { credentials: "include" };

class ToolAccessApi {
	requestCode(data) {
		return apiClient.post("/api/tool-access/otp", data, credentials);
	}

	verifyCode(data) {
		return apiClient.post("/api/tool-access/verify", data, credentials);
	}

	session() {
		return apiClient.get("/api/tool-access/session", {}, {
			...credentials,
			cache: "no-store",
		});
	}

	recordUse(toolPage) {
		return apiClient.post("/api/tool-access/use", { toolPage }, credentials);
	}
}

const toolAccessApi = new ToolAccessApi();
export default toolAccessApi;
