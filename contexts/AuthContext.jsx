"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("auth_user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				localStorage.removeItem("auth_user");
			}
		}

		const fetchSession = async () => {
			try {
				const response = await fetch("/api/auth/me", {
					method: "GET",
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Session request failed");
				}

				const data = await response.json();
				if (data.authenticated && data.user) {
					setUser(data.user);
					localStorage.setItem("auth_user", JSON.stringify(data.user));
				} else {
					setUser(null);
					localStorage.removeItem("auth_user");
				}
			} catch (error) {
				console.error("Session check error:", error);
				setUser(null);
				localStorage.removeItem("auth_user");
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, []);

	const persistUser = useCallback((userData) => {
		setUser(userData);
		localStorage.setItem("auth_user", JSON.stringify(userData));
	}, []);

	const clearUser = useCallback(() => {
		setUser(null);
		localStorage.removeItem("auth_user");
	}, []);

	const signup = async ({ name, email, password }) => {
		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Signup failed" };
			}

			return { success: true, email: data.email, message: data.message };
		} catch (error) {
			console.error("Signup error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const login = async ({ email, password }) => {
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Login failed" };
			}

			return {
				success: true,
				email: data.email,
				message: data.message,
			};
		} catch (err) {
			console.error("Login error:", err);
			return { success: false, error: "Network error" };
		}
	};

	const verifyOtp = async ({ email, code, action }) => {
		try {
			const response = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code, action }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Invalid code" };
			}

			persistUser(data.user);
			return { success: true, user: data.user };
		} catch (error) {
			console.error("OTP verification error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const requestPasswordReset = async ({ email }) => {
		try {
			const response = await fetch("/api/auth/password/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return {
					success: false,
					error: data.message || "Unable to process reset request",
				};
			}

			return { success: true, email: data.email, message: data.message };
		} catch (error) {
			console.error("Password reset request error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const completePasswordReset = async ({ email, code, password }) => {
		try {
			const response = await fetch("/api/auth/password/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code, password }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Invalid reset code" };
			}

			persistUser(data.user);
			return { success: true, user: data.user, message: data.message };
		} catch (error) {
			console.error("Password reset verify error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const updateProfile = async ({ name, bio }) => {
		try {
			const response = await fetch("/api/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, bio }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Unable to update profile" };
			}

			persistUser(data.user);
			return { success: true, user: data.user, message: data.message };
		} catch (error) {
			console.error("Profile update error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const changePassword = async ({ currentPassword, newPassword }) => {
		try {
			const response = await fetch("/api/profile/password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Unable to update password" };
			}

			persistUser(data.user);
			return { success: true, user: data.user, message: data.message };
		} catch (error) {
			console.error("Password change error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const updateNotificationSettings = async ({ pushNotifications, emailNotifications }) => {
		try {
			const response = await fetch("/api/profile/preferences", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pushNotifications, emailNotifications }),
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				return { success: false, error: data.message || "Unable to update preferences" };
			}

			persistUser(data.user);
			return { success: true, user: data.user, message: data.message };
		} catch (error) {
			console.error("Notification update error:", error);
			return { success: false, error: "Network error" };
		}
	};

	const logout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			clearUser();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				signup,
				verifyOtp,
				requestPasswordReset,
				completePasswordReset,
				updateProfile,
				changePassword,
				updateNotificationSettings,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
