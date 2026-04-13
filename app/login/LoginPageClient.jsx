"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [infoMessage, setInfoMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState("credentials");
	const { login, verifyOtp, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		}
	}, [user, router]);

	const handleCredentialsSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setInfoMessage("");
		setLoading(true);

		try {
			const result = await login({ email, password });
			if (result.success) {
				setStep("otp");
				setInfoMessage(
					result.message || "Enter the verification code sent to your email.",
				);
			} else {
				setError(result.error || "Login failed");
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	const handleOtpSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await verifyOtp({ email, code: otp, action: "login" });
			if (result.success) {
				router.push("/dashboard");
			} else {
				setError(result.error || "Invalid verification code");
			}
		} catch (err) {
			console.error("OTP verification error:", err);
			setError("Unable to verify code");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10 px-4'>
			<div className='w-full max-w-md'>
				<div className='mb-8 text-center'>
					<Link href='/'>
						<img
							src='/images/footer-logo.png'
							alt='Logo'
							className='mx-auto mb-4 h-16'
						/>
					</Link>
					<h1 className='font-anton text-3xl text-gray-800'>Welcome Back</h1>
					<p className='font-montserrat mt-2 text-gray-600'>
						Securely sign in to your account
					</p>
				</div>

				<div className='rounded-2xl bg-white p-8 shadow-xl'>
					<form
						onSubmit={step === "credentials" ? handleCredentialsSubmit : handleOtpSubmit}
						className='space-y-6'
					>
						{infoMessage && !error && (
							<div className='rounded-lg bg-green-50 p-4 text-sm text-green-700'>
								{infoMessage}
							</div>
						)}
						{error && (
							<div className='rounded-lg bg-red-50 p-4 text-sm text-red-600'>
								{error}
							</div>
						)}

						{step === "credentials" && (
							<>
								<div>
									<label
										htmlFor='email'
										className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
										Email Address
									</label>
									<input
										id='email'
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										placeholder='Enter your email'
									/>
								</div>

								<div>
									<label
										htmlFor='password'
										className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
										Password
									</label>
									<input
										id='password'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
										placeholder='Enter your password'
									/>
								</div>

								<p className='font-montserrat text-xs text-gray-500'>
									We will send a verification code to your email after you submit your credentials.
								</p>
							</>
						)}

						{step === "otp" && (
							<div>
								<label
									htmlFor='otp'
									className='font-montserrat mb-2 block text-sm font-semibold text-gray-700'>
									Verification Code
								</label>
								<input
									id='otp'
									type='text'
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									required
									inputMode='numeric'
									pattern='[0-9]{6}'
									maxLength={6}
									className='tracking-widest w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
									placeholder='Enter 6-digit code'
								/>
								<p className='font-montserrat mt-2 text-xs text-gray-500'>
									Check your inbox for the security code we sent to {email}.
								</p>
							</div>
						)}

						<button
							type='submit'
							disabled={loading}
							className='w-full rounded-lg bg-primary py-3 font-montserrat font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'>
							{loading ? (
								<span className='flex items-center justify-center'>
									<svg
										className='mr-2 h-5 w-5 animate-spin'
										fill='none'
										viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
									</svg>
									{step === "credentials" ? "Submitting" : "Verifying"}...
								</span>
							) : step === "credentials" ? (
								"Send Verification Code"
							) : (
								"Verify & Sign In"
							)}
						</button>
					</form>
				</div>

				<div className='mt-6 space-y-2 text-center'>
					<Link
						href='/reset-password'
						className='font-montserrat block text-sm text-gray-600 hover:text-primary'>
							Forgot password? Reset it
					</Link>
					<Link
						href='/signup'
						className='font-montserrat block text-sm text-gray-600 hover:text-primary'>
							Need an account? Sign up
					</Link>
					<Link
						href='/'
						className='font-montserrat block text-sm text-gray-600 hover:text-primary'>
							← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
