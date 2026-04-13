"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { PageLoading } from "../../../components/LoadingState";

export default function ProfilePage() {
	const { user, loading, updateProfile } = useAuth();
	const [profileForm, setProfileForm] = useState({ name: "", bio: "" });
	const [profileState, setProfileState] = useState({ loading: false, success: "", error: "" });

	useEffect(() => {
		if (user) {
			setProfileForm({ name: user.name || "", bio: user.bio || "" });
		}
	}, [user]);

	if (loading && !user) {
		return (
			<div className='min-h-screen bg-gray-50'>
				<PageLoading title='Loading profile…' message='Preparing your dashboard' />
			</div>
		);
	}

	const handleProfileSubmit = async (event) => {
		event.preventDefault();
		setProfileState({ loading: true, success: "", error: "" });
		const result = await updateProfile({ name: profileForm.name, bio: profileForm.bio });
		if (result.success) {
			setProfileState({ loading: false, success: result.message || "Profile updated", error: "" });
		} else {
			setProfileState({ loading: false, success: "", error: result.error || "Unable to update profile" });
		}
	};

	return (
		<div>
			<div className='mb-8'>
				<h1 className='font-anton text-4xl text-gray-800'>Profile</h1>
				<p className='font-montserrat mt-2 text-gray-600'>
					Manage your profile information
				</p>
			</div>

			<div className='space-y-6'>
				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<div className='flex items-center space-x-6'>
						<div className='flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl font-bold text-white'>
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						<div>
							<h2 className='font-anton text-3xl text-gray-800'>
								{user?.name || "User Name"}
							</h2>
							<p className='font-montserrat text-gray-600'>
								{user?.email || "user@example.com"}
							</p>
							<button className='font-montserrat mt-2 text-sm text-primary hover:underline'>
								Change Profile Picture
							</button>
						</div>
					</div>
				</div>

				<div className='rounded-xl bg-white p-6 shadow-lg'>
					<h2 className='font-anton mb-4 text-2xl text-gray-800'>Personal Information</h2>
					<form onSubmit={handleProfileSubmit} className='space-y-4'>
						{profileState.error && (
							<div className='rounded-lg bg-red-50 p-3 text-sm text-red-600'>{profileState.error}</div>
						)}
						{profileState.success && (
							<div className='rounded-lg bg-green-50 p-3 text-sm text-green-700'>{profileState.success}</div>
						)}
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>Full Name</label>
							<input
								type='text'
								value={profileForm.name}
								onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
								required
								className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
						</div>
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>Email</label>
							<input
								type='email'
								value={user?.email || ""}
								disabled
								className='w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500 focus:outline-none'
							/>
							<p className='font-montserrat mt-1 text-xs text-gray-500'>Email address is locked for security. Contact support to update it.</p>
						</div>
						<div>
							<label className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>Bio</label>
							<textarea
								rows='4'
								value={profileForm.bio}
								onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
								className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
								placeholder='Tell us about yourself...'
							/>
						</div>
						<button
							type='submit'
							disabled={profileState.loading}
							className='w-full rounded-lg bg-primary py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
						>
							{profileState.loading ? "Saving..." : "Save Changes"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
