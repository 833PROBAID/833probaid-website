"use client";

import { useState, useEffect } from "react";

const GROQ_MODELS = [
	"llama-3.1-8b-instant",
	"llama-3.1-70b-versatile",
	"llama-3.3-70b-versatile",
	"llama3-8b-8192",
	"llama3-70b-8192",
	"mixtral-8x7b-32768",
	"gemma2-9b-it",
];

const DEFAULT_FORM = {
	systemPrompt: "",
	model: "llama-3.1-8b-instant",
	maxTokens: 500,
	temperature: 0.7,
	groqApiKey: "",
};

export default function AiSettingsPage() {
	const [form, setForm] = useState(DEFAULT_FORM);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }
	const [showKey, setShowKey] = useState(false);

	useEffect(() => {
		fetchConfig();
	}, []);

	async function fetchConfig() {
		setLoading(true);
		try {
			const res = await fetch("/api/dashboard/ai-config", {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to load settings");
			const data = await res.json();
			setForm({
				systemPrompt: data.systemPrompt ?? "",
				model: data.model ?? "llama-3.1-8b-instant",
				maxTokens: data.maxTokens ?? 500,
				temperature: data.temperature ?? 0.7,
				groqApiKey: data.groqApiKey ?? "",
			});
		} catch {
			setStatus({ type: "error", message: "Could not load AI settings." });
		} finally {
			setLoading(false);
		}
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleNumberChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: Number(value) }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setStatus(null);

		try {
			const res = await fetch("/api/dashboard/ai-config", {
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("Save failed");
			setStatus({ type: "success", message: "AI settings saved successfully." });
			// Re-fetch so the key field reflects the masked placeholder
			fetchConfig();
		} catch {
			setStatus({ type: "error", message: "Failed to save settings. Please try again." });
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[40vh] text-gray-400 text-sm'>
				Loading AI settings…
			</div>
		);
	}

	return (
		<div className='max-w-3xl mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold text-gray-900 mb-1'>AI Settings</h1>
			<p className='text-sm text-gray-500 mb-8'>
				Configure the chatbot's behaviour, model, and API credentials. Changes take effect immediately for all new conversations.
			</p>

			{status && (
				<div
					className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
						status.type === "success"
							? "bg-green-50 text-green-700 border border-green-200"
							: "bg-red-50 text-red-700 border border-red-200"
					}`}>
					{status.message}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* System Prompt */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-1'>
						System Prompt
					</label>
					<p className='text-xs text-gray-500 mb-2'>
						Defines Alex's personality, scope, and instructions. Sent with every conversation.
					</p>
					<textarea
						name='systemPrompt'
						rows={12}
						value={form.systemPrompt}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y'
						placeholder='You are Alex, a warm and knowledgeable specialist at 833PROBAID®…'
					/>
				</div>

				{/* Model */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-1'>
						Model
					</label>
					<select
						name='model'
						value={form.model}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'>
						{GROQ_MODELS.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
					<p className='text-xs text-gray-400 mt-1'>Groq-hosted model to use for completions.</p>
				</div>

				{/* Max Tokens + Temperature */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-1'>
							Max Tokens
						</label>
						<input
							type='number'
							name='maxTokens'
							min={100}
							max={8000}
							step={50}
							value={form.maxTokens}
							onChange={handleNumberChange}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
						<p className='text-xs text-gray-400 mt-1'>100 – 8000. Default: 500.</p>
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-1'>
							Temperature&nbsp;
							<span className='font-normal text-gray-500'>(current: {Number(form.temperature).toFixed(1)})</span>
						</label>
						<input
							type='range'
							name='temperature'
							min={0}
							max={2}
							step={0.1}
							value={form.temperature}
							onChange={handleNumberChange}
							className='w-full h-2 accent-blue-600 cursor-pointer'
						/>
						<div className='flex justify-between text-xs text-gray-400 mt-1'>
							<span>0 — precise</span>
							<span>1 — balanced</span>
							<span>2 — creative</span>
						</div>
					</div>
				</div>

				{/* GROQ API Key */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-1'>
						GROQ API Key
					</label>
					<p className='text-xs text-gray-500 mb-2'>
						Stored securely on the server. If a key is already saved, the field shows{" "}
						<code className='bg-gray-100 px-1 rounded text-xs'>***saved***</code>. Leave it as-is to keep the existing key, or type a new value to replace it.
					</p>
					<div className='relative'>
						<input
							type={showKey ? "text" : "password"}
							name='groqApiKey'
							value={form.groqApiKey}
							onChange={handleChange}
							autoComplete='off'
							className='w-full pr-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							placeholder='gsk_…'
						/>
						<button
							type='button'
							onClick={() => setShowKey((v) => !v)}
							className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 px-2 py-1'>
							{showKey ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				{/* Submit */}
				<div className='flex items-center gap-4 pt-2'>
					<button
						type='submit'
						disabled={saving}
						className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors'>
						{saving ? "Saving…" : "Save Settings"}
					</button>
					<button
						type='button'
						onClick={fetchConfig}
						disabled={loading || saving}
						className='px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors'>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
}
