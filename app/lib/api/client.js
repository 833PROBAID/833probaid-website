class ApiClient {
	constructor() {
		this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
		this.token = null;
		this.apiKey = null;
	}

	setToken(token) {
		this.token = token;
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_token", token);
		}
	}

	getToken() {
		if (this.token) return this.token;
		if (typeof window !== "undefined") {
			this.token = localStorage.getItem("auth_token");
		}
		return this.token;
	}

	setApiKey(apiKey) {
		this.apiKey = apiKey;
		if (typeof window !== "undefined") {
			localStorage.setItem("api_key", apiKey);
		}
	}

	getApiKey() {
		if (this.apiKey) return this.apiKey;
		if (typeof window !== "undefined") {
			this.apiKey = localStorage.getItem("api_key");
		}
		return this.apiKey;
	}

	// 🔒 SECURITY: Get CSRF token
	getCSRFToken() {
		if (typeof window !== "undefined") {
			return localStorage.getItem("csrf_token");
		}
		return null;
	}

	clearAuth() {
		this.token = null;
		this.apiKey = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem("auth_token");
			localStorage.removeItem("api_key");
			localStorage.removeItem("csrf_token");
		}
	}

	async request(endpoint, options = {}) {
		// Handle query parameters
		let url = `${this.baseURL}${endpoint}`;
		if (options.params) {
			const searchParams = new URLSearchParams();
			Object.keys(options.params).forEach((key) => {
				if (options.params[key] !== null && options.params[key] !== undefined) {
					searchParams.append(key, options.params[key]);
				}
			});
			const queryString = searchParams.toString();
			if (queryString) {
				url += `?${queryString}`;
			}
		}

		const config = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		// Remove params from options to avoid conflicts
		delete config.params;

		// Serialize body to JSON if it exists and is an object (but not FormData)
		if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
			config.body = JSON.stringify(config.body);
		}

		// If body is FormData, remove Content-Type header to let browser set it with boundary
		if (config.body instanceof FormData) {
			delete config.headers["Content-Type"];
			for (let [key, value] of config.body.entries()) {
				if (value instanceof File) {
					console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type });
				} else {
					console.log(`  ${key}:`, value);
				}
			}
		}

		// Add authentication headers
		const token = this.getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		const apiKey = this.getApiKey();
		if (apiKey) {
			config.headers["X-API-Key"] = apiKey;
		}

		// 🔒 SECURITY: Add TOTP code and wallet address for admin requests
		if (config.method && config.method.toUpperCase() !== "GET") {
			const totpData = this.getTOTPCode();
			if (totpData) {
				config.headers["X-TOTP-Code"] = totpData.code;
				config.headers["X-Wallet-Address"] = totpData.wallet;
			}

			// 🔒 SECURITY: Add CSRF token for state-changing operations
			const csrfToken = this.getCSRFToken();
			if (csrfToken) {
				config.headers["X-CSRF-Token"] = csrfToken;
			} else {
				console.warn(
					"🔒 CLIENT: No CSRF token found in localStorage for",
					config.method,
					"request to",
					endpoint,
				);
			}
		}

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));

				// Handle authentication and security errors
				if (response.status === 401 || response.status === 403) {
					const errorMessage = errorData.error || "";
					const isAuthError =
						response.status === 401 ||
						errorMessage.toLowerCase().includes("token") ||
						errorMessage.toLowerCase().includes("unauthorized") ||
						errorMessage.toLowerCase().includes("authentication") ||
						errorMessage.toLowerCase().includes("revoked") ||
						errorMessage.toLowerCase().includes("expired") ||
						errorMessage.toLowerCase().includes("csrf");

					if (isAuthError) {
						// Dispatch auth error event for AuthGuard to handle
						if (typeof window !== "undefined") {
							window.dispatchEvent(
								new CustomEvent("authError", {
									detail: {
										status: response.status,
										message: errorMessage,
										endpoint: endpoint,
									},
								}),
							);
						}
					}
				}

				throw new ApiError(
					errorData.error || `HTTP ${response.status}`,
					response.status,
					errorData,
				);
			}

			// Handle blob responses (for file downloads/images)
			if (options.responseType === 'blob') {
				return await response.blob();
			}

			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return await response.json();
			}

			return await response.text();
		} catch (error) {
			console.error("API Request Error:", error);
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Network error occurred", 0, { originalError: error });
		}
	}

	// HTTP method helpers - fix the get method
	async get(endpoint, params = {}, options = {}) {
		return this.request(endpoint, { ...options, method: "GET", params });
	}

	async post(endpoint, body, options = {}) {
		return this.request(endpoint, { ...options, method: "POST", body });
	}

	async put(endpoint, body, options = {}) {
		return this.request(endpoint, { ...options, method: "PUT", body });
	}

	async delete(endpoint, body, options = {}) {
		return this.request(endpoint, { ...options, method: "DELETE", body });
	}

	async patch(endpoint, body, options = {}) {
		return this.request(endpoint, { ...options, method: "PATCH", body });
	}
}

class ApiError extends Error {
	constructor(message, status, data = {}) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

export { ApiError };

const apiClient = new ApiClient();
export default apiClient;

// Helper method to get TOTP code with timestamp validation
apiClient.getTOTPCode = function () {
	if (typeof window !== "undefined") {
		try {
			// 🔒 SECURITY: Obfuscated storage key to prevent easy detection
			const storedData = sessionStorage.getItem("_asc_tkn");
			const storedWallet = sessionStorage.getItem("_asc_wlt");
			if (!storedData || !storedWallet) return null;

			const { code, timestamp } = JSON.parse(storedData);
			const elapsed = Date.now() - timestamp;

			// 🔒 SECURITY: Only return code if it's less than 25 seconds old
			if (elapsed < 25000) {
				return { code, wallet: storedWallet };
			} else {
				// Auto-clear expired code
				sessionStorage.removeItem("_asc_tkn");
				sessionStorage.removeItem("_asc_wlt");
				return null;
			}
		} catch (error) {
			// Invalid stored data, clear it immediately
			sessionStorage.removeItem("_asc_tkn");
			sessionStorage.removeItem("_asc_wlt");
			return null;
		}
	}
	return null;
};

// Helper method to set TOTP code with timestamp
apiClient.setTOTPCode = function (code, wallet) {
	if (typeof window !== "undefined") {
		if (code && wallet) {
			// 🔒 SECURITY: Validate code format before storing
			if (!/^\d{6}$/.test(code)) {
				return false;
			}

			// 🔒 SECURITY: Store code with timestamp for validation
			const totpData = {
				code: code,
				timestamp: Date.now(),
			};
			sessionStorage.setItem("_asc_tkn", JSON.stringify(totpData));
			sessionStorage.setItem("_asc_wlt", wallet);
			return true;
		} else {
			sessionStorage.removeItem("_asc_tkn");
			sessionStorage.removeItem("_asc_wlt");
			return true;
		}
	}
	return false;
};

// Helper method to clear TOTP code
apiClient.clearTOTPCode = function () {
	if (typeof window !== "undefined") {
		sessionStorage.removeItem("_asc_tkn");
		sessionStorage.removeItem("_asc_wlt");
	}
};

