"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { PageLoading } from "../../../components/LoadingState";

export default function SettingsPage() {
	const { user, loading, updateNotificationSettings, changePassword } = useAuth();
	const [preferences, setPreferences] = useState({ pushNotifications: true, emailNotifications: true });
	const [prefState, setPrefState] = useState({ loading: false, success: "", error: "" });
	const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
	const [passwordState, setPasswordState] = useState({ loading: false, success: "", error: "" });

	useEffect(() => {
		if (user?.settings) {
			setPreferences({
				pushNotifications: user.settings.pushNotifications,
				emailNotifications: user.settings.emailNotifications,
			});
		}
	}, [user]);

	if (loading && !user) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<PageLoading title='Loading settings…' message='Preparing your dashboard' />
			</div>
		);
	}

	const handlePreferencesSubmit = async (event) => {
		event.preventDefault();
		setPrefState({ loading: true, success: "", error: "" });
		const result = await updateNotificationSettings(preferences);
		if (result.success) {
			setPrefState({ loading: false, success: result.message || "Preferences updated", error: "" });
		} else {
			setPrefState({ loading: false, success: "", error: result.error || "Unable to update preferences" });
		}
	};

	const handlePasswordSubmit = async (event) => {
		event.preventDefault();
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPasswordState({ loading: false, success: "", error: "New passwords do not match" });
			return;
		}
		setPasswordState({ loading: true, success: "", error: "" });
		const result = await changePassword({
			currentPassword: passwordForm.currentPassword,
			newPassword: passwordForm.newPassword,
		});
		if (result.success) {
			setPasswordState({ loading: false, success: result.message || "Password updated", error: "" });
			setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
		} else {
			setPasswordState({ loading: false, success: "", error: result.error || "Unable to update password" });
		}
	};

	return (
		<div>
			<div className='mb-8'>
				<h1 className='font-anton text-4xl text-gray-800'>Settings</h1>
				<p className='font-montserrat mt-2 text-gray-600'>
					Manage notification preferences and security
				</p>
			</div>

			<div className='space-y-6'>
				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>Notifications</h2>
					<form onSubmit={handlePreferencesSubmit} className='space-y-4'>
						{prefState.error && (
							<div className='rounded-lg bg-red-50 p-3 text-sm text-red-600'>{prefState.error}</div>
						)}
						{prefState.success && (
							<div className='rounded-lg bg-green-50 p-3 text-sm text-green-700'>{prefState.success}</div>
						)}
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-montserrat font-semibold text-gray-800'>Push Notifications</p>
								<p className='font-montserrat text-sm text-gray-600'>Receive security and account updates instantly</p>
							</div>
							<button
								type='button'
								onClick={() =>
									setPreferences((prev) => ({
										...prev,
										pushNotifications: !prev.pushNotifications,
									}))
								}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									preferences.pushNotifications ? "bg-primary" : "bg-gray-300"
								}`}>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										preferences.pushNotifications ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<p className='font-montserrat font-semibold text-gray-800'>Email Alerts</p>
								<p className='font-montserrat text-sm text-gray-600'>Get notified via email for critical activity</p>
							</div>
							<button
								type='button'
								onClick={() =>
									setPreferences((prev) => ({
										...prev,
										emailNotifications: !prev.emailNotifications,
									}))
								}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									preferences.emailNotifications ? "bg-primary" : "bg-gray-300"
								}`}>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										preferences.emailNotifications ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
						<button
							type='submit'
							disabled={prefState.loading}
							className='w-full rounded-lg bg-primary py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
						>
							{prefState.loading ? "Saving..." : "Save Preferences"}
						</button>
					</form>
				</div>

				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>Change Password</h2>
					<form onSubmit={handlePasswordSubmit} className='space-y-4'>
						{passwordState.error && (
							<div className='rounded-lg bg-red-50 p-3 text-sm text-red-600'>{passwordState.error}</div>
						)}
						{passwordState.success && (
							<div className='rounded-lg bg-green-50 p-3 text-sm text-green-700'>{passwordState.success}</div>
						)}
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>Current Password</label>
							<input
								type='password'
								value={passwordForm.currentPassword}
								onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
								required
								className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
						</div>
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>New Password</label>
							<input
								type='password'
								value={passwordForm.newPassword}
								onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
								required
								className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
						</div>
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>Confirm New Password</label>
							<input
								type='password'
								value={passwordForm.confirmPassword}
								onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
								required
								className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
						</div>
						<button
							type='submit'
							disabled={passwordState.loading}
							className='w-full rounded-lg bg-primary py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
						>
							{passwordState.loading ? "Updating..." : "Update Password"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
