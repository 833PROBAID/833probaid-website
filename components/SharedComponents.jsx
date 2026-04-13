import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";

export const renderLabel = (text, color, variant) => {
	const colorCode = color === "teal" ? "#0097A7" : "#FD7702";
	const isLarge = variant === "invoice";
	const textSize = isLarge ? "text-xl" : "text-base";
	const specialCharSize = isLarge ? "text-2xl font-bold" : "text-xl";

	if (
		!text?.includes("/") &&
		!text?.includes(":") &&
		!text?.includes("(") &&
		!text?.includes(")") &&
		!text?.includes("-") &&
		!text?.includes("—")
	)
		return <span className={`font-bold min-w-max ${textSize}`}>{text}</span>;

	const parts = text.split(/([/:()-—])/g);
	return (
		<span className={`font-bold min-w-max ${textSize}`}>
			{parts.map((part, index) => {
				if (part === ":")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{" : "}
						</span>
					);
				if (part === "(")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{"("}
						</span>
					);
				if (part === ")")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{")"}
						</span>
					);
				if (part === "/")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{"/"}
						</span>
					);
				if (part === "-")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{"-"}
						</span>
					);
				if (part === "—")
					return (
						<span
							key={index}
							className={`font-bold ${specialCharSize} text-[${colorCode}] align-middle`}>
							{"—"}
						</span>
					);
				return <React.Fragment key={index}>{part}</React.Fragment>;
			})}
		</span>
	);
};

const getWidthStyles = (width) => {
	// Handle string width values
	if (typeof width === "string") {
		// If it's already a Tailwind class, return it as className
		if (width.startsWith("w-")) return { className: width };

		// Handle pixel values - return as inline style
		if (width.includes("px")) {
			return { style: { width: width } };
		}

		// Handle percentage values - return as inline style
		if (width.includes("%")) {
			return { style: { width: width } };
		}

		// Handle numeric strings as pixels - return as inline style
		if (/^\d+$/.test(width)) {
			return { style: { width: `${width}px` } };
		}

		// Handle keyword values - return as className
		switch (width) {
			case "full":
				return { className: "w-full" };
			case "auto":
				return { className: "w-auto" };
			case "fit":
				return { className: "w-fit" };
			case "max":
				return { className: "w-max" };
			case "min":
				return { className: "w-min" };
			default:
				return { className: "w-auto" };
		}
	}

	// Handle numeric values as pixels - return as inline style
	if (typeof width === "number") {
		return { style: { width: `${width}px` } };
	}

	return { className: "w-auto" };
};

export const Checkbox = ({
	name,
	group,
	label,
	checked,
	onChange,
	width = "auto",
	containerClass = "",
	disabled = false,
	variant,
}) => {
	const widthConfig = getWidthStyles(width);
	const isLarge = variant === "invoice";
	const borderSize = isLarge ? "border-[4.5px]" : "border-[3.5px]";

	return (
		<label
			className={`flex items-center cursor-pointer gap-2 relative ${
				widthConfig.className || ""
			} ${containerClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			style={widthConfig.style || {}}>
			<div className='relative'>
				<input
					type='checkbox'
					data-group={group}
					name={name}
					checked={checked}
					onChange={onChange}
					disabled={disabled}
					className={`appearance-none h-8 w-8 ${borderSize} border-[#FD7702] bg-white rounded checked:border-[#FD7702] focus:ring-2 focus:ring-[#FD7702] transition-all disabled:cursor-not-allowed`}
				/>
				{checked && (
					<div className='absolute -top-1 left-1 w-full h-full flex items-center justify-center'>
						<i className='fas fa-check text-[#0097A7] text-5xl'></i>
					</div>
				)}
			</div>
			<span className='font-bold min-w-max'>
				{typeof label === "string"
					? renderLabel(label, undefined, variant)
					: label}
			</span>
		</label>
	);
};

export const TextInput = React.forwardRef(
	(
		{
			name,
			value,
			onChange,
			label,
			placeholder,
			type = "text",
			disabled = false,
			width = "full",
			containerClass = "",
			inputClass = "",
			labelClass = "",
			required = false,
			suggestions = [],
			onSuggestionClick,
			showSuggestions = false,
			onSearchSuggestions,
			isLoadingSuggestions = false,
			onFocus,
			onBlur,
			variant,
			...props
		},
		ref,
	) => {
		const isLarge = variant === "invoice";
		const borderSize = isLarge ? "border-[4.5px]" : "border-[3.5px]";
		const padding = isLarge ? "px-3 py-2" : "px-2 py-1";
		const textStyle = isLarge ? "text-xl font-bold" : "";
		const labelSize = isLarge ? "text-xl" : "text-base";
		const widthConfig = getWidthStyles(width);
		const [showDropdown, setShowDropdown] = React.useState(false);
		const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
		const [selectedIndex, setSelectedIndex] = React.useState(-1);
		const dropdownRef = React.useRef(null);
		const inputRef = React.useRef(ref);

		// Update filtered suggestions when suggestions prop changes (from API)
		React.useEffect(() => {
			if (showSuggestions && suggestions && suggestions.length > 0) {
				// API already filters, so just dedupe and limit
				const filtered = suggestions
					.filter((item, index, self) => self.indexOf(item) === index) // Remove duplicates
					.slice(0, 6); // Limit to 6 suggestions
				setFilteredSuggestions((prev) => {
					if (JSON.stringify(prev) === JSON.stringify(filtered)) return prev;
					return filtered;
				});
				// Auto-show dropdown when suggestions arrive
				setShowDropdown(true);
				setSelectedIndex(-1);
			} else if (!suggestions || suggestions.length === 0) {
				if (filteredSuggestions.length > 0) {
					setFilteredSuggestions([]);
				}
			}
		}, [suggestions, showSuggestions]);

		// Close dropdown when clicking outside
		React.useEffect(() => {
			const handleClickOutside = (event) => {
				if (
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target)
				) {
					setShowDropdown(false);
					setSelectedIndex(-1);
				}
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		const handleSuggestionClick = (suggestion) => {
			if (onSuggestionClick) {
				onSuggestionClick(suggestion);
			}
			setShowDropdown(false);
			setSelectedIndex(-1);
		};

		const handleKeyDown = (e) => {
			if (!showDropdown || filteredSuggestions.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
					break;
				case "Enter":
					if (selectedIndex >= 0) {
						e.preventDefault();
						handleSuggestionClick(filteredSuggestions[selectedIndex]);
					}
					break;
				case "Escape":
					e.preventDefault();
					setShowDropdown(false);
					setSelectedIndex(-1);
					break;
				default:
					break;
			}
		};

		return (
			<div
				className={`flex flex-row items-center gap-1 ${
					widthConfig.className || ""
				} ${containerClass}`}
				style={widthConfig.style || {}}>
				{label && (
					<label
						className={`block font-bold ${labelSize} mb-1 whitespace-nowrap min-w-max ${labelClass}`}>
						{typeof label === "string"
							? renderLabel(label, undefined, variant)
							: label}
					</label>
				)}
				<div className='relative w-full' ref={dropdownRef}>
					<input
						ref={ref || inputRef}
						type={type}
						name={name}
						value={value}
						onChange={(e) => {
							onChange(e);
							// Trigger search suggestions when typing
							if (showSuggestions && onSearchSuggestions) {
								onSearchSuggestions(name, e.target.value);
								setShowDropdown(true);
							}
						}}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						required={required}
						onFocus={(e) => {
							if (onFocus) onFocus(e);
							if (showSuggestions) {
								// Trigger initial search on focus
								if (onSearchSuggestions) {
									onSearchSuggestions(name, value || "");
								}
								if (filteredSuggestions.length > 0) {
									setShowDropdown(true);
								}
							}
						}}
						onBlur={(e) => {
							if (onBlur) onBlur(e);
						}}
						autoComplete='off'
						className={`w-full h-10 ${borderSize} border-[#0097A7] ${padding} bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD7702] focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold ${textStyle} ${inputClass}`}
						{...props}
					/>
					{/* Loading indicator */}
					{isLoadingSuggestions && showDropdown && (
						<div
							className='absolute z-[100] w-full mt-2 bg-white rounded-xl p-3 text-center text-gray-500'
							style={{
								boxShadow:
									"0 20px 25px -5px rgba(0, 151, 167, 0.15), 0 10px 10px -5px rgba(0, 151, 167, 0.1), 0 0 0 1px rgba(0, 151, 167, 0.1)",
							}}>
							<i className='fas fa-spinner fa-spin mr-2'></i>
							Loading suggestions...
						</div>
					)}
					{showDropdown &&
						!isLoadingSuggestions &&
						filteredSuggestions.length > 0 && (
							<div
								className='absolute z-[100] w-full mt-2 bg-white rounded-xl overflow-hidden animate-fadeIn'
								style={{
									boxShadow:
										"0 20px 25px -5px rgba(0, 151, 167, 0.15), 0 10px 10px -5px rgba(0, 151, 167, 0.1), 0 0 0 1px rgba(0, 151, 167, 0.1)",
								}}>
								<style>{`
								@keyframes fadeIn {
									from {
										opacity: 0;
										transform: translateY(-10px) scale(0.98);
									}
									to {
										opacity: 1;
										transform: translateY(0) scale(1);
									}
								}
								.animate-fadeIn {
									animation: fadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
								}
								.suggestion-item {
									transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
									position: relative;
								}
								.suggestion-item::before {
									content: '';
									position: absolute;
									left: 0;
									top: 0;
									bottom: 0;
									width: 3px;
									background: linear-gradient(180deg, #FD7702, #FF9933);
									transform: scaleY(0);
									transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
								}
								.suggestion-item.active::before {
									transform: scaleY(1);
								}
								.suggestion-item:hover .suggestion-icon,
								.suggestion-item.active .suggestion-icon {
									transform: scale(1.2) rotate(360deg);
									transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
								}
								.suggestion-badge {
									font-size: 9px;
									padding: 2px 6px;
									background: rgba(253, 119, 2, 0.1);
									border-radius: 4px;
									color: #FD7702;
									font-weight: 600;
									letter-spacing: 0.5px;
								}
								.kbd-key {
									display: inline-flex;
									align-items: center;
									justify-content: center;
									min-width: 24px;
									height: 20px;
									padding: 0 6px;
									background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
									border: 1px solid #d1d5db;
									border-bottom-width: 2px;
									border-radius: 4px;
									font-size: 11px;
									font-weight: 600;
									font-family: monospace;
									color: #374151;
									box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
								}
								.scrollbar-thin::-webkit-scrollbar {
									width: 6px;
								}
								.scrollbar-thin::-webkit-scrollbar-track {
									background: #f1f5f9;
									border-radius: 3px;
								}
								.scrollbar-thin::-webkit-scrollbar-thumb {
									background: linear-gradient(180deg, #0097A7, #007a87);
									border-radius: 3px;
								}
								.scrollbar-thin::-webkit-scrollbar-thumb:hover {
									background: linear-gradient(180deg, #007a87, #006570);
								}
							`}</style>

								{/* Header */}
								<div className='px-4 py-3 bg-gradient-to-r from-[#0097A7] via-[#00a8bb] to-[#0097A7] bg-size-200 bg-animate'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2.5'>
											<div className='w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center'>
												<i className='fas fa-clock-rotate-left text-white text-sm'></i>
											</div>
											<div>
												<div className='text-white font-bold text-sm tracking-wide'>
													Recent Entries
												</div>
												<div className='text-white/70 text-[10px] font-medium'>
													{filteredSuggestions.length} suggestion
													{filteredSuggestions.length !== 1 ? "s" : ""} found
												</div>
											</div>
										</div>
										<div className='suggestion-badge'>QUICK FILL</div>
									</div>
								</div>

								{/* Suggestions List */}
								<div className='max-h-64 overflow-y-auto scrollbar-thin'>
									{filteredSuggestions.map((suggestion, index) => (
										<div
											key={index}
											onClick={() => handleSuggestionClick(suggestion)}
											onMouseEnter={() => setSelectedIndex(index)}
											className={`suggestion-item px-4 py-3.5 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3.5 ${
												selectedIndex === index
													? "active bg-gradient-to-r from-[#0097A7]/5 to-[#0097A7]/10"
													: "hover:bg-gray-50/80"
											}`}>
											<div
												className={`suggestion-icon flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
													selectedIndex === index
														? "bg-gradient-to-br from-[#FD7702] to-[#FF9933] text-white shadow-lg shadow-orange-500/30"
														: "bg-gradient-to-br from-[#0097A7]/10 to-[#007a87]/10 text-[#0097A7]"
												}`}>
												<i className='fas fa-history text-sm'></i>
											</div>
											<div className='flex-1 min-w-0'>
												<span
													className={`block font-semibold text-sm truncate ${
														selectedIndex === index
															? "text-[#0097A7]"
															: "text-gray-800"
													}`}>
													{suggestion}
												</span>
												<span className='block text-[10px] text-gray-400 font-medium mt-0.5'>
													Previously used
												</span>
											</div>
											{selectedIndex === index && (
												<div className='flex-shrink-0 flex items-center gap-2'>
													<span className='text-[10px] font-semibold text-[#0097A7] uppercase tracking-wider'>
														Press Enter
													</span>
													<i className='fas fa-arrow-turn-down-left text-[#FD7702] text-xs'></i>
												</div>
											)}
										</div>
									))}
								</div>

								{/* Footer */}
								<div className='px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200'>
									<div className='flex items-center justify-between text-[11px]'>
										<div className='flex items-center gap-2'>
											<i className='fas fa-keyboard text-[#0097A7] text-xs'></i>
											<span className='text-gray-600 font-medium'>
												Navigate:
											</span>
											<kbd className='kbd-key'>↑</kbd>
											<kbd className='kbd-key'>↓</kbd>
											<span className='text-gray-400 mx-1'>|</span>
											<span className='text-gray-600 font-medium'>Select:</span>
											<kbd className='kbd-key'>↵</kbd>
										</div>
										<div className='flex items-center gap-1.5'>
											<span className='text-gray-600 font-medium'>Close:</span>
											<kbd className='kbd-key'>ESC</kbd>
										</div>
									</div>
								</div>
							</div>
						)}
				</div>
			</div>
		);
	},
);

export const TextArea = React.forwardRef(
	(
		{
			name,
			value,
			onChange,
			label,
			placeholder,
			disabled = false,
			width = "full",
			rows = 4,
			containerClass = "",
			inputClass = "",
			labelClass = "",
			required = false,
			suggestions = [],
			onSuggestionClick,
			showSuggestions = false,
			onSearchSuggestions,
			isLoadingSuggestions = false,
			onFocus,
			onBlur,
			variant,
			...props
		},
		ref,
	) => {
		const isLarge = variant === "invoice";
		const borderSize = isLarge ? "border-[4.5px]" : "border-[3.5px]";
		const padding = isLarge ? "px-3 py-2" : "px-2 py-1";
		const textStyle = isLarge ? "text-xl font-bold" : "";
		const labelSize = isLarge ? "text-xl" : "text-base";
		const widthConfig = getWidthStyles(width);
		const [showDropdown, setShowDropdown] = React.useState(false);
		const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
		const [selectedIndex, setSelectedIndex] = React.useState(-1);
		const dropdownRef = React.useRef(null);
		const textareaRef = React.useRef(ref);

		// Auto-resize textarea based on content
		const adjustHeight = React.useCallback(() => {
			const textarea = textareaRef.current;
			if (textarea) {
				textarea.style.height = "auto";
				textarea.style.height = textarea.scrollHeight + "px";
			}
		}, []);

		// Adjust height when value changes
		React.useEffect(() => {
			adjustHeight();
		}, [value, adjustHeight]);

		// Update filtered suggestions when suggestions prop changes (from API)
		React.useEffect(() => {
			if (showSuggestions && suggestions && suggestions.length > 0) {
				const filtered = suggestions
					.filter((item, index, self) => self.indexOf(item) === index)
					.slice(0, 6);
				setFilteredSuggestions((prev) => {
					if (JSON.stringify(prev) === JSON.stringify(filtered)) return prev;
					return filtered;
				});
				setShowDropdown(true);
				setSelectedIndex(-1);
			} else if (!suggestions || suggestions.length === 0) {
				if (filteredSuggestions.length > 0) {
					setFilteredSuggestions([]);
				}
			}
		}, [suggestions, showSuggestions]);

		// Close dropdown when clicking outside
		React.useEffect(() => {
			const handleClickOutside = (event) => {
				if (
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target)
				) {
					setShowDropdown(false);
					setSelectedIndex(-1);
				}
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		const handleSuggestionClick = (suggestion) => {
			if (onSuggestionClick) {
				onSuggestionClick(suggestion);
			}
			setShowDropdown(false);
			setSelectedIndex(-1);
		};

		const handleKeyDown = (e) => {
			if (!showDropdown || filteredSuggestions.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
					break;
				case "Enter":
					if (selectedIndex >= 0 && e.ctrlKey) {
						e.preventDefault();
						handleSuggestionClick(filteredSuggestions[selectedIndex]);
					}
					break;
				case "Escape":
					e.preventDefault();
					setShowDropdown(false);
					setSelectedIndex(-1);
					break;
				default:
					break;
			}
		};

		return (
			<div
				className={`flex flex-col gap-1 ${
					widthConfig.className || ""
				} ${containerClass}`}
				style={widthConfig.style || {}}>
				{label && (
					<label
						className={`block font-bold ${labelSize} mb-1 whitespace-nowrap min-w-max ${labelClass}`}>
						{typeof label === "string"
							? renderLabel(label, undefined, variant)
							: label}
					</label>
				)}
				<div className='relative w-full' ref={dropdownRef}>
					<textarea
						ref={ref || textareaRef}
						name={name}
						value={value}
						onChange={(e) => {
							onChange(e);
							adjustHeight();
							if (showSuggestions && onSearchSuggestions) {
								onSearchSuggestions(name, e.target.value);
								setShowDropdown(true);
							}
						}}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						required={required}
						rows={rows}
						onFocus={(e) => {
							if (onFocus) onFocus(e);
							if (showSuggestions) {
								if (onSearchSuggestions) {
									onSearchSuggestions(name, value || "");
								}
								if (filteredSuggestions.length > 0) {
									setShowDropdown(true);
								}
							}
						}}
						onBlur={(e) => {
							if (onBlur) onBlur(e);
						}}
						onInput={(e) => {
							// Auto-resize textarea
							e.target.style.height = "auto";
							e.target.style.height = e.target.scrollHeight + "px";
						}}
						className={`w-full ${borderSize} border-[#0097A7] ${padding} bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD7702] focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden leading-relaxed font-bold ${textStyle} ${inputClass}`}
						{...props}
					/>
					{isLoadingSuggestions && showDropdown && (
						<div
							className='absolute z-[100] w-full mt-2 bg-white rounded-xl p-3 text-center text-gray-500'
							style={{
								boxShadow:
									"0 20px 25px -5px rgba(0, 151, 167, 0.15), 0 10px 10px -5px rgba(0, 151, 167, 0.1), 0 0 0 1px rgba(0, 151, 167, 0.1)",
							}}>
							<i className='fas fa-spinner fa-spin mr-2'></i>
							Loading suggestions...
						</div>
					)}
					{showDropdown &&
						!isLoadingSuggestions &&
						filteredSuggestions.length > 0 && (
							<div
								className='absolute z-[100] w-full mt-2 bg-white rounded-xl overflow-hidden animate-fadeIn'
								style={{
									boxShadow:
										"0 20px 25px -5px rgba(0, 151, 167, 0.15), 0 10px 10px -5px rgba(0, 151, 167, 0.1), 0 0 0 1px rgba(0, 151, 167, 0.1)",
								}}>
								<div className='px-4 py-3 bg-gradient-to-r from-[#0097A7] via-[#00a8bb] to-[#0097A7]'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2.5'>
											<div className='w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center'>
												<i className='fas fa-clock-rotate-left text-white text-sm'></i>
											</div>
											<div>
												<div className='text-white font-bold text-sm tracking-wide'>
													Recent Entries
												</div>
												<div className='text-white/70 text-[10px] font-medium'>
													{filteredSuggestions.length} suggestion
													{filteredSuggestions.length !== 1 ? "s" : ""} found
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='max-h-64 overflow-y-auto'>
									{filteredSuggestions.map((suggestion, index) => (
										<div
											key={index}
											onClick={() => handleSuggestionClick(suggestion)}
											onMouseEnter={() => setSelectedIndex(index)}
											className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
												selectedIndex === index
													? "bg-gradient-to-r from-[#0097A7]/5 to-[#0097A7]/10"
													: "hover:bg-gray-50/80"
											}`}>
											<div className='flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#0097A7] to-[#007a87]'>
												<i className='fas fa-file-alt text-white text-sm'></i>
											</div>
											<div className='flex-grow min-w-0'>
												<div className='text-gray-800 font-medium text-sm truncate'>
													{suggestion}
												</div>
											</div>
											{selectedIndex === index && (
												<i className='fas fa-arrow-turn-down-left text-[#0097A7] text-sm flex-shrink-0'></i>
											)}
										</div>
									))}
								</div>
							</div>
						)}
				</div>
			</div>
		);
	},
);

export const DateSelector = ({
	name,
	label,
	selected,
	onChange,
	placeholderText = "Select date",
	width = "full",
	containerClass = "",
	required = false,
	variant,
	disabled = false,
	...props
}) => {
	const widthConfig = getWidthStyles(width);
	const isLarge = variant === "invoice";
	const borderSize = isLarge ? "border-[4.5px]" : "border-[3.5px]";
	const padding = isLarge ? "px-3 py-2" : "px-2 py-1";
	const textStyle = isLarge ? "text-xl font-bold" : "";
	const labelSize = isLarge ? "text-xl" : "text-base";

	return (
		<div
			className={`flex flex-row items-center gap-1 ${
				widthConfig.className || ""
			} ${containerClass} ${
				disabled ? "pointer-events-none cursor-not-allowed" : ""
			}`}
			style={widthConfig.style || {}}>
			<style>{`
				.probaid-datepicker { font-size: 0.6rem !important; }
				.probaid-datepicker .react-datepicker__header { padding: 2px 0 !important; }
				.probaid-datepicker .react-datepicker__current-month { font-size: 0.65rem !important; margin-bottom: 1px !important; }
				.probaid-datepicker .react-datepicker__day-name,
				.probaid-datepicker .react-datepicker__day { width: 1.1rem !important; line-height: 1.1rem !important; margin: 1px !important; }
				.probaid-datepicker .react-datepicker__navigation { top: 3px !important; }
				.probaid-datepicker .react-datepicker__month { margin: 2px !important; }
			`}</style>
			{label && (
				<label
					className={`block font-bold ${labelSize} mb-1 whitespace-nowrap min-w-max`}>
					{typeof label === "string"
						? renderLabel(label, undefined, variant)
						: label}
				</label>
			)}
			<DatePicker
				selected={selected}
				onChange={onChange}
				placeholderText={placeholderText}
				required={required}
				dateFormat='MM-dd-yyyy'
				highlightDates={[]}
				calendarClassName='no-today-highlight probaid-datepicker'
				customInput={
					<InputMask mask='99-99-9999' maskChar={null} alwaysShowMask={false}>
						{(inputProps) => (
							<input
								{...inputProps}
								className={`w-full h-10 ${borderSize} border-[#0097A7] ${padding} bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FD7702] focus:ring-offset-0 transition-colors cursor-pointer font-bold ${textStyle}`}
							/>
						)}
					</InputMask>
				}
				{...props}
			/>
		</div>
	);
};

export const FileUpload = ({
	name,
	onChange,
	label,
	accept,
	width = "full",
	containerClass = "",
	disabled = false,
	multiple = false,
	value = null,
	inputKey,
}) => {
	const widthConfig = getWidthStyles(width);
	const fileName =
		value instanceof File
			? value.name
			: value && typeof value === "object"
				? value.originalName || value.name || null
				: null;
	const hasFile = !!fileName;

	return (
		<label
			className={`block h-10 border-[3.5px] px-2 py-1 cursor-pointer transition-colors font-bold ${
				hasFile
					? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
					: "border-[#0097A7] bg-gray-200 text-[#FD7702] hover:text-[#0097A7]"
			} ${widthConfig.className || ""} ${containerClass} ${
				disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
			}`}
			style={widthConfig.style || {}}>
			<input
				key={inputKey}
				type='file'
				name={name}
				onChange={onChange}
				className='hidden'
				accept={accept}
				disabled={disabled}
				multiple={multiple}
			/>
			<div className='flex items-center justify-center gap-2 overflow-hidden'>
				<i className={hasFile ? "fas fa-check-circle flex-shrink-0" : "fas fa-paperclip flex-shrink-0"}></i>
				<span className='truncate' title={fileName || label}>
					{fileName || label}
				</span>
			</div>
		</label>
	);
};

export const RadioButton = ({
	name,
	value,
	selectedValue,
	onChange,
	label,
	color = "teal",
	width = "auto",
	containerClass = "",
	disabled = false,
}) => {
	const isSelected = selectedValue === value;
	const widthConfig = getWidthStyles(width);

	const bgColor = color === "orange" ? "bg-[#FD7702]" : "bg-[#0097A7]";
	const dotColor = color === "orange" ? "#0097A7" : "#FD7702";
	const dotColor2 = color !== "orange" ? "#0097A7" : "#FD7702";
	const borderClass =
		color === "orange" ? "border-[#0097A7]" : "border-[#FD7702]";
	const focusRingClass =
		color === "orange" ? "focus:ring-[#0097A7]" : "focus:ring-[#FD7702]";

	const handleClick = () => {
		if (disabled) return;
		const syntheticEvent = {
			target: {
				name,
				value,
				type: "radio",
				checked: true,
				dataset: {},
				getAttribute: () => null,
			},
		};
		onChange(syntheticEvent);
	};

	return (
		<div
			className={`cursor-pointer flex items-center text-center ${
				widthConfig.className || ""
			} ${containerClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			style={widthConfig.style || {}}
			onClick={handleClick}
			role='radio'
			aria-checked={isSelected}
			tabIndex={disabled ? -1 : 0}
			onKeyDown={(e) => {
				if (disabled) return;
				if (e.key === " " || e.key === "Enter") {
					e.preventDefault();
					handleClick();
				}
			}}>
			<div className='relative cursor-pointer'>
				<div
					className={`h-8 w-8 -mr-3 z-50 rounded-full border-2 bg-white focus:ring-2 transition-all ${borderClass} ${focusRingClass}`}>
					{isSelected && (
						<div
							className='absolute top-1.5 left-1.5 h-5 w-5 rounded-full z-40'
							style={{ backgroundColor: dotColor }}></div>
					)}
				</div>

				<div
					className='absolute top-0 left-0 h-8 w-8 rounded-full border-2 bg-transparent z-10 pointer-events-none'
					style={{ borderColor: dotColor2 }}></div>
			</div>

			<span
				className={`pr-2.5 pl-4 py-1 rounded font-bold uppercase text-sm text-[15px] line-height-6 w-full border ${
					color === "orange" ? "border-[#FD7702]" : "border-[#0097A7]"
				} ${bgColor} text-white`}>
				{label}
			</span>
		</div>
	);
};

export const RadioGroup = ({
	name,
	value,
	options,
	onChange,
	label,
	width = "full",
	containerClass = "",
	labelClass = "",
	gridClass = "",
	direction = "horizontal",
	gap = "gap-4",
	required = false,
	disabled = false,
	distributeWidth = false,
}) => {
	const widthConfig = getWidthStyles(width);
	const flexDirection = direction === "vertical" ? "flex-col" : "flex-row";

	// Calculate individual item width if distributeWidth is true
	const getItemWidth = () => {
		if (!distributeWidth) return "auto";

		if (direction === "horizontal") {
			const itemCount = options.length;
			// Calculate width accounting for gaps
			return `calc((100% - ${(itemCount - 1) * 0.5}rem) / ${itemCount})`;
		}
		return "full";
	};

	const itemWidth = getItemWidth();

	return (
		<div
			className={`${widthConfig.className || ""} ${containerClass}`}
			style={widthConfig.style || {}}>
			{label && (
				<label className={`block font-bold text-lg mb-1 ${labelClass}`}>
					{typeof label === "string" ? renderLabel(label) : label}
				</label>
			)}
			<div
				className={`flex ${flexDirection} ${gap} ${gridClass} ${
					distributeWidth ? "w-full" : ""
				}`}>
				{options.map((option) => (
					<RadioButton
						key={option.value}
						name={name}
						value={option.value}
						selectedValue={value}
						onChange={onChange}
						label={option.label}
						color={option.color || "teal"}
						width={distributeWidth ? itemWidth : option.width || "auto"}
						disabled={disabled || option.disabled}
						containerClass={distributeWidth ? "flex-1" : ""}
					/>
				))}
			</div>
		</div>
	);
};

export const FormSection = ({
	title,
	icon,
	children,
	width = "full",
	containerClass = "",
	...rest
}) => {
	const widthConfig = getWidthStyles(width);

	return (
		<div
			className={`mb-0 ${widthConfig.className || ""} ${containerClass}`}
			style={widthConfig.style || {}}
			{...rest}>
			<div className='relative bg-[#0097A7] py-2 pl-16 text-white font-semibold text-3xl uppercase'>
				<div className='absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[4rem] h-[4rem] rounded-full bg-[#FD7702] flex items-center justify-center z-10 border-[6px] border-[#0097A7]'>
					<i className={`fas ${icon} text-2xl`}></i>
				</div>
				{title}
			</div>
			<div className='pl-12 py-3 space-y-4'>{children}</div>
		</div>
	);
};
