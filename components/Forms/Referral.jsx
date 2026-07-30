import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	Checkbox,
	TextInput,
	TextArea,
	PhoneInput,
	FileUpload,
	RadioButton,
	RadioGroup,
	FormSection,
	renderLabel,
	isValidUSPhone,
	isValidEmail,
} from "../SharedComponents";
import referralsApi from "../../app/lib/api/referrals";
import { uploadToBlob } from "../../app/lib/blobUpload";
import CTAButton from "../CTAButton";

const INITIAL_FORM_DATA = {
	// Referring Party Info
	referringPartyName: "",
	role: "",
	roleOther: "",
	firmName: "",
	referringEmail: "",
	referringPhone: "",
	preferredContact: "",
	attorneyName: "",
	attorneyEmail: "",

	// Client/Representative Details
	clientName: "",
	clientRole: "",
	clientRoleOther: "",
	lettersIssued: "",
	lettersDate: "",
	lettersExpectedDate: "",
	caseNumber: "",
	courthouse: "",

	// Property Information
	propertyAddress: "",
	occupancyStatus: "",
	multipleProperties: "",
	additionalAddresses: "",
	accessRestrictions: "",
	accessRestrictionsDetails: "",
	urgency: "",
	urgencyDetails: "",

	//extra property info
	exportedProperties: [
		{
			address: "",
			occupancyStatus: "",
			multipleProperties: "",
			additionalAddresses: "",
			accessRestrictions: "",
			accessRestrictionsDetails: "",
			urgency: "",
			urgencyDetails: "",
		},
	],

	// Case Type
	caseType: {
		probate: false,
		fullAuthority: false,
		limitedAuthority: false,
		conservatorship: false,
		ofTheEstate: false,
		ofThePerson: false,
		both: false,
		trustSale: false,
		trustee: false,
		successorTrustee: false,
		reverseMortgage: false,
		successorInInterest: false,
		otherCaseType: false,
		notSure: false,
	},

	// Requested Support
	requestedSupport: {
		contactClient: false,
		waitForIntro: false,
		provideOpinion: false,
		refereeAssigned: false,
		conductWalkthrough: false,
		preparePhotos: false,
		refereeFullName: "",
		refereePhone: "",
		refereeEmail: "",
		willOrderPrivateAppraisal: "",
		coordinateVendors: false,
		notReadyForListing: false,
	},

	// Document Upload
	documentUpload: {
		lettersOfAdministration: false,
		lettersOfConservatorship: false,
		trustCertification: false,
		recordedDeed: false,
		courtMinuteOrder: false,
		relevantFilings: false,
	},
	uploadedFiles: [],

	// How Did You Hear About Us (checkboxes)
	onlineSearch: false,
	socialMedia: false,
	directAttorneyReferral: false,
	pastCasePriorMatter: false,
	emailNewsletterOrBrochure: false,
	barAssociationOrLegalEvent: false,
	courtClerkOrProbateExaminer: false,
	other: false,
	otherDetails: "",

	// Legacy fields
	howDidYouHear: "",
	howDidYouHearOther: "",
};

const buildFormData = (data) => ({
	...INITIAL_FORM_DATA,
	...data,
	caseType: { ...INITIAL_FORM_DATA.caseType, ...(data?.caseType || {}) },
	requestedSupport: {
		...INITIAL_FORM_DATA.requestedSupport,
		...(data?.requestedSupport || {}),
	},
	documentUpload: {
		...INITIAL_FORM_DATA.documentUpload,
		...(data?.documentUpload || {}),
	},
});

const Form = ({ readOnly = false, initialData = null }) => {
	const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'
	const [submitError, setSubmitError] = useState("");
	const [countdown, setCountdown] = useState(0);
	const [fieldErrors, setFieldErrors] = useState(new Set());
	const [_formData, setFormData] = useState(INITIAL_FORM_DATA);

	// Always derive display data directly from initialData in readOnly mode,
	// bypassing state management entirely to guarantee correct checkbox rendering.
	const formData =
		readOnly && initialData ? buildFormData(initialData) : _formData;

	// Sync editable form state when initialData is provided (edit/prefill scenarios)
	useEffect(() => {
		if (!readOnly && initialData) {
			setFormData(buildFormData(initialData));
		}
	}, [readOnly, initialData]);
	// Remove a single key from the field-error set (used as the user fixes fields)
	// Fields the user has interacted with. Live validation only applies to
	// these, so nothing is highlighted until the user actually changes a field.
	const [touched, setTouched] = useState(new Set());
	const markTouched = (...keys) => {
		setTouched((prev) => {
			const next = new Set(prev);
			keys.forEach((k) => k && next.add(k));
			return next;
		});
	};

	// Pre-mark a newly opened property block's required fields so they validate
	// (and highlight red) immediately when the block appears.
	const markPropertyRequiredTouched = (i) => {
		markTouched(
			`property.${i}.address`,
			`property.${i}.occupancyStatus`,
			`property.${i}.accessRestrictions`,
			`property.${i}.urgency`,
			`property.${i}.multipleProperties`,
		);
	};

	// Update a single text/phone field inside the requestedSupport group.
	const handleSupportFieldChange = (field) => (e) => {
		let { value } = e.target;
		// The referee's full name must not contain numbers.
		if (field === "refereeFullName") value = value.replace(/[0-9]/g, "");
		markTouched(field);
		setFormData((prev) => ({
			...prev,
			requestedSupport: { ...prev.requestedSupport, [field]: value },
		}));
	};

	const HEAR_OPTIONS = [
		"onlineSearch",
		"socialMedia",
		"directAttorneyReferral",
		"pastCasePriorMatter",
		"emailNewsletterOrBrochure",
		"barAssociationOrLegalEvent",
		"courtClerkOrProbateExaminer",
		"other",
	];

	// In Document Upload these three letter types are mutually exclusive —
	// checking one clears the other two.
	const EXCLUSIVE_DOCS = [
		"lettersOfAdministration",
		"lettersOfConservatorship",
		"trustCertification",
	];

	// Requested Support boxes that each unlock dependent required fields; used
	// to mark those dependents touched for live validation. Both may be checked
	// together.
	const SUPPORT_WITH_DEPENDENTS = ["preparePhotos", "refereeAssigned"];

	// Handler for main form fields
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const group = e.target.dataset?.group;

		// Mark only the field(s) being edited so live validation applies to them.
		if (group) {
			markTouched(group);
			if (group === "requestedSupport" && SUPPORT_WITH_DEPENDENTS.includes(name))
				markTouched(
					"willOrderPrivateAppraisal",
					"refereeFullName",
					"refereePhone",
					"refereeEmail",
				);
			if (group === "documentUpload") markTouched("uploadedFiles");
		} else if (HEAR_OPTIONS.includes(name)) {
			markTouched("howDidYouHear");
			if (name === "other") markTouched("otherDetails");
		} else if (name === "lettersIssued") {
			markTouched("lettersIssued", "lettersDate");
		} else if (name === "role") {
			markTouched("role", "roleOther");
		} else if (name === "clientRole") {
			markTouched(
				"clientRole",
				"clientRoleOther",
				"clientRole.probateRole",
				"clientRole.conservatorRole",
				"clientRole.trustRole",
			);
		} else {
			markTouched(name);
		}

		if (name === "multipleProperties") {
			// A second property block opens — pre-validate its required fields.
			if (value === "Yes" && formData.exportedProperties.length === 1)
				markPropertyRequiredTouched(1);
			setFormData((prev) => {
				let newExportedProperties = prev.exportedProperties;
				if (value === "Yes") {
					// Add a new property if only one exists
					if (prev.exportedProperties.length === 1) {
						newExportedProperties = [
							...prev.exportedProperties,
							{
								address: "",
								occupancyStatus: "",
								multipleProperties: "",
								additionalAddresses: "",
								accessRestrictions: "",
								accessRestrictionsDetails: "",
								urgency: "",
								urgencyDetails: "",
							},
						];
					}
				} else if (value === "No") {
					// Keep only the first property
					newExportedProperties = [prev.exportedProperties[0]];
				}
				return {
					...prev,
					multipleProperties: value,
					exportedProperties: newExportedProperties,
				};
			});
			return;
		}

		if (type === "checkbox") {
			if (group) {
				setFormData((prev) => {
					const updatedGroup = { ...prev[group], [name]: checked };
					// Document Upload: only one of the three letter types at a time
					if (group === "documentUpload" && checked && EXCLUSIVE_DOCS.includes(name)) {
						EXCLUSIVE_DOCS.forEach((k) => {
							if (k !== name) updatedGroup[k] = false;
						});
					}
					// Requested Support: the appraisal radio only applies while
					// "No Referee Assigned" is checked, and the referee fields only
					// while "Prepare Photos" is checked. The two boxes can be checked
					// together.
					if (group === "requestedSupport") {
						// The appraisal radio applies only while "No Referee Assigned"
						// is checked; the referee fields only while "Prepare Photos" is.
						if (!updatedGroup.refereeAssigned)
							updatedGroup.willOrderPrivateAppraisal = "";
						if (!updatedGroup.preparePhotos) {
							updatedGroup.refereeFullName = "";
							updatedGroup.refereePhone = "";
							updatedGroup.refereeEmail = "";
						}
					}
					return { ...prev, [group]: updatedGroup };
				});
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: checked,
					// "Other" details are only kept while the Other box is checked.
					...(name === "other" && !checked ? { otherDetails: "" } : {}),
				}));
			}
		} else {
			// When letters have been issued, require & auto-open the issue date.
			if (name === "lettersIssued") {
				setFormData((prev) => ({ ...prev, lettersIssued: value }));
				if (value === "Yes") {
					setTimeout(() => lettersDateRef.current?.setOpen(true), 0);
				}
				return;
			}
			// Special handling for the 'howDidYouHear' radio: focus the 'Other' input when selected and clear it when not
			if (name === "howDidYouHear") {
				setFormData((prev) => ({
					...prev,
					howDidYouHear: value,
					howDidYouHearOther: value === "Other" ? prev.howDidYouHearOther : "",
				}));
				if (value === "Other") {
					setTimeout(() => howDidYouHearOtherRef.current?.focus(), 0);
				}
			} else if (name === "role") {
				// The "Other" text is only kept while the Other radio is selected.
				setFormData((prev) => ({
					...prev,
					role: value,
					roleOther: value === "Other" ? prev.roleOther : "",
				}));
			} else if (name === "clientRole") {
				setFormData((prev) => ({
					...prev,
					clientRole: value,
					clientRoleOther: value === "Other" ? prev.clientRoleOther : "",
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
				}));
			}
		}
	};

	// Handler for property fields in exportedProperties
	const handlePropertyChange = (index, e) => {
		const { name, value, type, checked } = e.target;

		// Mark the matching property field(s) as touched so they validate live.
		markTouched(`property.${index}.${name}`);
		if (name === "accessRestrictions" && value === "Yes")
			markTouched(`property.${index}.accessRestrictionsDetails`);
		if (name === "urgency" && value === "Yes")
			markTouched(`property.${index}.urgencyDetails`);

		if (name === "multipleProperties") {
			// A further property block opens — pre-validate its required fields.
			if (value === "Yes" && index === formData.exportedProperties.length - 1)
				markPropertyRequiredTouched(index + 1);
			setFormData((prev) => {
				let updatedProperties = prev.exportedProperties.map((property, i) => {
					if (i !== index) return property;
					return { ...property, [name]: value };
				});

				if (value === "Yes") {
					// Only add if this is the last property
					if (index === updatedProperties.length - 1) {
						updatedProperties = [
							...updatedProperties,
							{
								address: "",
								occupancyStatus: "",
								multipleProperties: "",
								additionalAddresses: "",
								accessRestrictions: "",
								accessRestrictionsDetails: "",
								urgency: "",
								urgencyDetails: "",
							},
						];
					}
				} else if (value === "No") {
					// Remove all properties after this one
					updatedProperties = updatedProperties.slice(0, index + 1);
				}
				return {
					...prev,
					exportedProperties: updatedProperties,
				};
			});
			return;
		}

		setFormData((prev) => {
			const updatedProperties = prev.exportedProperties.map((property, i) => {
				if (i !== index) return property;
				if (type === "checkbox") {
					return { ...property, [name]: checked };
				}
				// If changing accessRestrictions to No or Not Sure, clear the details
				if (
					name === "accessRestrictions" &&
					(value === "No" || value === "Not Sure")
				) {
					return { ...property, [name]: value, accessRestrictionsDetails: "" };
				}
				// If changing urgency to No or Not Sure, clear the urgency details
				if (name === "urgency" && (value === "No" || value === "Not Sure")) {
					return { ...property, [name]: value, urgencyDetails: "" };
				}
				return { ...property, [name]: value };
			});
			return { ...prev, exportedProperties: updatedProperties };
		});

		// If the user selected Yes for accessRestrictions, focus the details input (for any index)
		if (name === "accessRestrictions" && value === "Yes") {
			setTimeout(() => {
				const ref = accessRestrictionsDetailsRefs.current[index];
				if (ref && typeof ref.focus === "function") ref.focus();
			}, 0);
		}

		// If the user selected Yes for urgency, focus the details input (for any index)
		if (name === "urgency" && value === "Yes") {
			setTimeout(() => {
				const ref = urgencyDetailsRefs.current[index];
				if (ref && typeof ref.focus === "function") ref.focus();
			}, 0);
		}
	};

	const printRef = useRef();
	const accessRestrictionsDetailsRef0 = useRef(null);
	const accessRestrictionsDetailsRefs = useRef({});
	const urgencyDetailsRef0 = useRef(null);
	const urgencyDetailsRefs = useRef({});
	const howDidYouHearOtherRef = useRef(null);
	const lettersDateRef = useRef(null);

	// Fields whose inline TextInput has overflowed onto more than one line, so an
	// expanded TextArea should be revealed. Driven by TextInput's onOverflowChange
	// (measured from the DOM — no hardcoded character count).
	const [overflowedFields, setOverflowedFields] = useState({});
	const setFieldOverflow = (key) => (overflow) =>
		setOverflowedFields((prev) =>
			prev[key] === overflow ? prev : { ...prev, [key]: overflow },
		);

	// Zoom control state
	const [zoomLevel, setZoomLevel] = useState(1);
	const formContainerRef = useRef(null);

	const isEmpty = (v) => !v?.toString().trim();

	// "N/A" / "Not Yet Assigned" are acceptable for the optional attorney email
	const isNaValue = (v) => /^(n\/?a|not yet assigned)$/i.test(v?.toString().trim());

	// Build the set of invalid field keys (empty set === valid)
	const buildErrors = () => {
		const errors = new Set();
		const prop0 = formData.exportedProperties[0] || {};

		// Rule 1: required top-level fields
		const requiredFields = {
			referringPartyName: formData.referringPartyName,
			role: formData.role,
			firmName: formData.firmName,
			referringEmail: formData.referringEmail,
			referringPhone: formData.referringPhone,
			preferredContact: formData.preferredContact,
			clientName: formData.clientName,
			clientRole: formData.clientRole,
			lettersIssued: formData.lettersIssued,
			courthouse: formData.courthouse,
			multipleProperties: formData.multipleProperties,
			attorneyName: formData.attorneyName,
			attorneyEmail: formData.attorneyEmail,
		};
		Object.entries(requiredFields).forEach(([k, v]) => {
			if (isEmpty(v)) errors.add(k);
		});

		// role "Other" requires roleOther
		if (formData.role === "Other" && isEmpty(formData.roleOther))
			errors.add("roleOther");

		// Client Role may hold multiple values (Trust Sale); parse before checks.
		const clientRoles = formData.clientRole
			? formData.clientRole.split(",").map((s) => s.trim()).filter(Boolean)
			: [];
		const hasRole = (r) => clientRoles.includes(r);

		if (hasRole("Other") && isEmpty(formData.clientRoleOther))
			errors.add("clientRoleOther");

		// The selected Case Type constrains which Client Role(s) are valid.
		// (Case types are mutually exclusive, so at most one rule applies.)
		if (
			formData.caseType.probate &&
			!hasRole("Executor") &&
			!hasRole("Administrator")
		)
			errors.add("clientRole.probateRole");
		if (formData.caseType.conservatorship && !hasRole("Conservator"))
			errors.add("clientRole.conservatorRole");
		if (formData.caseType.trustSale && !hasRole("Trustee"))
			errors.add("clientRole.trustRole");
		if (formData.caseType.successorInInterest && !hasRole("Other"))
			errors.add("clientRole.successorRole");
		if (formData.caseType.otherCaseType && !hasRole("Other"))
			errors.add("clientRole.successorRole");

		// When the court has issued letters, the issue date is required.
		// (Courthouse is always required — handled in requiredFields above.)
		if (formData.lettersIssued === "Yes") {
			if (isEmpty(formData.lettersDate)) errors.add("lettersDate");
		}

		// Email format checks (referring email is required; attorney email allows "N/A")
		if (!isEmpty(formData.referringEmail) && !isValidEmail(formData.referringEmail))
			errors.add("referringEmail");
		if (
			!isEmpty(formData.attorneyEmail) &&
			!isNaValue(formData.attorneyEmail) &&
			!isValidEmail(formData.attorneyEmail)
		)
			errors.add("attorneyEmail");

		// Phone must be a valid US number (when provided)
		if (!isEmpty(formData.referringPhone) && !isValidUSPhone(formData.referringPhone))
			errors.add("referringPhone");

		// Property 0
		if (isEmpty(prop0.address)) errors.add("property.0.address");
		if (isEmpty(prop0.occupancyStatus))
			errors.add("property.0.occupancyStatus");
		if (isEmpty(prop0.accessRestrictions))
			errors.add("property.0.accessRestrictions");
		if (isEmpty(prop0.urgency)) errors.add("property.0.urgency");
		if (prop0.accessRestrictions === "Yes" && isEmpty(prop0.accessRestrictionsDetails))
			errors.add("property.0.accessRestrictionsDetails");
		if (prop0.urgency === "Yes" && isEmpty(prop0.urgencyDetails))
			errors.add("property.0.urgencyDetails");

		// Additional properties (when multipleProperties === "Yes")
		for (let i = 1; i < formData.exportedProperties.length; i++) {
			const p = formData.exportedProperties[i];
			if (isEmpty(p.address)) errors.add(`property.${i}.address`);
			if (isEmpty(p.occupancyStatus))
				errors.add(`property.${i}.occupancyStatus`);
			if (isEmpty(p.accessRestrictions))
				errors.add(`property.${i}.accessRestrictions`);
			if (isEmpty(p.urgency)) errors.add(`property.${i}.urgency`);
			if (isEmpty(p.multipleProperties))
				errors.add(`property.${i}.multipleProperties`);
			if (p.accessRestrictions === "Yes" && isEmpty(p.accessRestrictionsDetails))
				errors.add(`property.${i}.accessRestrictionsDetails`);
			if (p.urgency === "Yes" && isEmpty(p.urgencyDetails))
				errors.add(`property.${i}.urgencyDetails`);
		}

		// Rule 2: at least one caseType must be checked
		if (!Object.values(formData.caseType).some(Boolean))
			errors.add("caseType");

		if (
			formData.caseType.probate &&
			!formData.caseType.fullAuthority &&
			!formData.caseType.limitedAuthority
		)
			errors.add("caseType.probateAuthority");

		if (
			formData.caseType.conservatorship &&
			!formData.caseType.ofTheEstate &&
			!formData.caseType.ofThePerson &&
			!formData.caseType.both
		)
			errors.add("caseType.conservatorshipScope");

		if (
			formData.caseType.trustSale &&
			!formData.caseType.trustee &&
			!formData.caseType.successorTrustee
		)
			errors.add("caseType.trustSaleRole");

		const supportBoxes = [
			"contactClient",
			"waitForIntro",
			"provideOpinion",
			"refereeAssigned",
			"conductWalkthrough",
			"preparePhotos",
			"coordinateVendors",
			"notReadyForListing",
		];
		if (!supportBoxes.some((k) => formData.requestedSupport[k]))
			errors.add("requestedSupport");

		// refereeAssigned requires willOrderPrivateAppraisal
		if (
			formData.requestedSupport.refereeAssigned &&
			isEmpty(formData.requestedSupport.willOrderPrivateAppraisal)
		)
			errors.add("willOrderPrivateAppraisal");

		// preparePhotos requires the referee's name, phone, and email.
		if (formData.requestedSupport.preparePhotos) {
			const rs = formData.requestedSupport;
			if (isEmpty(rs.refereeFullName)) errors.add("refereeFullName");
			if (isEmpty(rs.refereePhone) || !isValidUSPhone(rs.refereePhone))
				errors.add("refereePhone");
			if (isEmpty(rs.refereeEmail) || !isValidEmail(rs.refereeEmail))
				errors.add("refereeEmail");
		}

		// Document Upload is optional, but if a document type is checked the
		// matching file(s) must be uploaded.
		const anyDocChecked = Object.values(formData.documentUpload).some(Boolean);
		if (
			anyDocChecked &&
			(!formData.uploadedFiles || formData.uploadedFiles.length === 0)
		)
			errors.add("uploadedFiles");

		// Rule 2: at least one "How did you hear" option checked
		if (!HEAR_OPTIONS.some((k) => formData[k])) errors.add("howDidYouHear");

		// "other" requires otherDetails
		if (formData.other && isEmpty(formData.otherDetails))
			errors.add("otherDetails");

		return errors;
	};

	// Validate live, but only for fields the user has actually touched — so
	// nothing is red on first render, and changing one field only (re)validates
	// that field. A full validation still runs on Submit.
	useEffect(() => {
		if (readOnly || touched.size === 0) return;
		const all = buildErrors();
		const visible = new Set([...all].filter((k) => touched.has(k)));

		if (all.has("courthouse") && Object.values(formData.caseType).some(Boolean))
			visible.add("courthouse");
		if (
			all.has("property.0.address") &&
			Object.values(formData.caseType).some(Boolean)
		)
			visible.add("property.0.address");
		setFieldErrors(visible);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_formData, touched, readOnly]);

	// The selected Case Type restricts which Client Role options are allowed.
	// `null` means no restriction (Reverse Mortgage / none → all allowed).
	const allowedClientRoles = formData.caseType.probate
		? ["Executor", "Administrator"]
		: formData.caseType.conservatorship
			? ["Conservator"]
			: formData.caseType.trustSale
				? ["Trustee"]
				: formData.caseType.successorInInterest
					? ["Other"]
					: formData.caseType.otherCaseType
						? ["Other"]
						: null;

	// Every Case Type is single-pick for Client Role.
	const isClientRoleMulti = false;

	// Client Role is stored as a comma-joined string (to support the Trust Sale
	// multi-select); parse it into an array for rendering/validation.
	const selectedClientRoles = formData.clientRole
		? formData.clientRole
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
		: [];

	// If the Case Type changes so a chosen Client Role is no longer allowed,
	// drop just the invalid roles (keeps valid picks when toggling sub-options).
	useEffect(() => {
		if (readOnly || !allowedClientRoles) return;
		const kept = selectedClientRoles.filter((r) =>
			allowedClientRoles.includes(r),
		);
		if (kept.length !== selectedClientRoles.length) {
			setFormData((prev) => ({
				...prev,
				clientRole: kept.join(", "),
				clientRoleOther: kept.includes("Other") ? prev.clientRoleOther : "",
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		formData.caseType.probate,
		formData.caseType.conservatorship,
		formData.caseType.trustSale,
		formData.caseType.reverseMortgage,
		formData.caseType.successorInInterest,
		formData.caseType.otherCaseType,
		formData.clientRole,
		readOnly,
	]);

	// After errors render, scroll the first highlighted field into view.
	const scrollToFirstError = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const el = printRef.current?.querySelector(
					".border-red-500, .ring-red-500, .text-red-500"
				);
				el?.scrollIntoView({ behavior: "smooth", block: "center" });
			});
		});
	};

	const handleSendPdfByEmail = async () => {
		if (readOnly) return;
		setSubmitStatus("loading");
		setSubmitError("");
		const errors = buildErrors();
		if (errors.size > 0) {
			// On Submit, reveal every error and treat all of them as touched.
			setTouched((prev) => new Set([...prev, ...errors]));
			setFieldErrors(errors);
			setSubmitStatus("error");
			setSubmitError("Please complete all required fields highlighted in red.");
			scrollToFirstError();
			return;
		}
		setFieldErrors(new Set());
		try {
			// Upload files directly to Blob from the browser (bypasses the 4.5 MB
			// serverless limit that caused HTTP 413 on large files).
			const { uploadedFiles, ...fields } = formData;
			const uploaded = [];
			for (const file of uploadedFiles || []) {
				if (file instanceof File) {
					uploaded.push(await uploadToBlob(file, "referral"));
				} else if (file) {
					// Already-uploaded metadata (edit/prefill scenarios) — pass through.
					uploaded.push(file);
				}
			}
			const result = await referralsApi.create({ ...fields, uploadedFiles: uploaded });
			if (result.success) {
				setSubmitStatus("success");
				setFormData(INITIAL_FORM_DATA);
				setFieldErrors(new Set());
				setTouched(new Set());
				setCountdown(5);
				const interval = setInterval(() => {
					setCountdown((prev) => {
						if (prev <= 1) {
							clearInterval(interval);
							setSubmitStatus(null);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				setSubmitStatus("error");
				setSubmitError(result.error || "Submission failed");
			}
		} catch (err) {
			setSubmitStatus("error");
			setSubmitError(err.message || "Submission failed");
		}
	};
	// Handler for file uploads
	const handleFileChange = (e) => {
		const { files } = e.target;
		if (files && files.length > 0) {
			setFormData((prev) => ({
				...prev,
				uploadedFiles: [...prev.uploadedFiles, ...Array.from(files)],
			}));
			markTouched("uploadedFiles");
		}
	};

	// Zoom control functions
	const handleZoomIn = () => {
		setZoomLevel((prev) => Math.min(prev + 0.1, 2));
	};

	const handleZoomOut = () => {
		setZoomLevel((prev) => Math.max(prev - 0.1, 0.25));
	};

	const handleFitToScreen = () => {
		if (formContainerRef.current) {
			const containerWidth = formContainerRef.current.offsetWidth;
			const formWidth = 1280;
			const fitZoom = containerWidth / formWidth;
			setZoomLevel(Math.min(fitZoom, 1));
		}
	};

	useEffect(() => {
		const autoFit = () => {
			if (formContainerRef.current) {
				const containerWidth = formContainerRef.current.offsetWidth;
				const fitZoom = containerWidth / 1280;
				setZoomLevel(Math.min(fitZoom, 1));
			}
		};
		setTimeout(autoFit, 100);
		window.addEventListener("resize", autoFit);
		return () => window.removeEventListener("resize", autoFit);
	}, []);

	const handleResetZoom = () => {
		setZoomLevel(1);
	};

	return (
		<div
			className='w-full'
			ref={formContainerRef}
			style={{ fontFamily: "var(--font-poppins), sans-serif" }}
			data-no-scope
		>
			<div className='sticky top-3 z-50 flex justify-center mb-[2.5rem] pointer-events-none'>
				<div
					className='pointer-events-auto flex items-center gap-1 rounded-full px-3 py-1.5'
					style={{
						background: "rgba(255,255,255,0.92)",
						backdropFilter: "blur(12px)",
						WebkitBackdropFilter: "blur(12px)",
						boxShadow:
							"0 2px 16px 0 rgba(0,151,167,0.18), 0 1px 4px 0 rgba(0,0,0,0.10)",
						border: "1.5px solid rgba(0,151,167,0.25)",
					}}>
					{/* Zoom Out */}
					<button
						type='button'
						onClick={handleZoomOut}
						disabled={zoomLevel <= 0.25}
						title='Zoom Out'
						className='w-7 h-7 flex items-center justify-center rounded-full text-[#0097A7] hover:bg-[#0097A7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm'>
						<i className='fas fa-minus'></i>
					</button>

					{/* Percentage — click to reset to 100% */}
					<button
						type='button'
						onClick={handleResetZoom}
						title='Reset to 100%'
						className='min-w-[52px] text-center text-xs font-bold text-[#0097A7] hover:text-[#FD7702] transition-colors px-1 tabular-nums'>
						{Math.round(zoomLevel * 100)}%
					</button>

					{/* Zoom In */}
					<button
						type='button'
						onClick={handleZoomIn}
						disabled={zoomLevel >= 2}
						title='Zoom In'
						className='w-7 h-7 flex items-center justify-center rounded-full text-[#0097A7] hover:bg-[#0097A7]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm'>
						<i className='fas fa-plus'></i>
					</button>

					{/* Divider */}
					<div className='w-px h-4 bg-gray-300 mx-1'></div>

					{/* Fit to Screen */}
					<button
						type='button'
						onClick={handleFitToScreen}
						title='Fit to Screen'
						className='w-7 h-7 flex items-center justify-center rounded-full text-[#FD7702] hover:bg-[#FD7702]/10 transition-all text-sm'>
						<i className='fas fa-expand-arrows-alt'></i>
					</button>
				</div>
			</div>

			<div className='large-div'>
				<div
					ref={printRef}
					className='large-div-content'
					style={{
						transform: `scale(${zoomLevel})`,
						transformOrigin: "top center",
						transition: "transform 0.2s ease",
						marginBottom: printRef.current
							? `${printRef.current.offsetHeight * (zoomLevel - 1)}px`
							: 0,
					}}>
					<div
						className='flex items-center justify-center w-full'
						id='printable-content'>
						<div
							className='w-full bg-white border border-gray-200 shadow-md form-canvas'
							style={{ margin: "0 auto" }}>
							<div className='w-full bg-[#0097A7]'>
								<div className='grid grid-cols-7 justify-center items-stretch py-8'>
									<div className='col-span-3 bg-white pr-12 py-2 pl-4 flex items-center'>
										<img
											src='/images/footer-logo.png'
											alt='footer logo'
											className='w-full h-auto'
										/>
									</div>
									<div className='bg-[#FD7702] -ml-9 border-21 border-r-0 border-[#0097A7] text-white px-6 py-4 font-bold text-[3.7rem] uppercase col-span-4 rounded-l-full flex items-center justify-center'>
										Referral Form
									</div>
								</div>
							</div>

							<form className='relative mt-4 mx-1 px-1 md:mx-5'>
								<fieldset
									disabled={readOnly}
									style={{
										border: "none",
										margin: 0,
										padding: 0,
										pointerEvents: readOnly ? "none" : "auto",
									}}>
									<div className='absolute left-2 top-10 bottom-10 w-[6px] bg-[#FD7702]'></div>

									{/* Referring Party Info */}
									<FormSection title='Referring Party Info' icon='fa-user'>
										<TextInput
											name='referringPartyName'
											value={formData.referringPartyName}
											onChange={handleChange}
											label='Your Full Name:'
											width='full'
											required
											error={fieldErrors.has("referringPartyName")}
										/>

										<div className='flex items-center gap-4'>
											<RadioGroup
												name='role'
												value={formData.role}
												onChange={handleChange}
												label='Your Role:'
												error={fieldErrors.has("role")}
												options={[
													{
														value: "Attorney",
														label: "Attorney",
														color: "teal",
														width: "140px",
													},
													{
														value: "Paralegal",
														label: "Paralegal",
														color: "orange",
														width: "140px",
													},
													{
														value: "Professional Fiduciary",
														label: "Professional Fiduciary (P.F.B.)",
														color: "teal",
														width: "310px",
													},
													{
														value: "Other",
														label: "Other",
														color: "orange",
														width: "100px",
													},
												]}
												width='full'
												containerClass='w-full flex justify-between'
											/>
												<TextInput
													name='roleOther'
													value={formData.roleOther}
													onChange={handleChange}
													width='400px'
													disabled={formData.role !== "Other"}
													error={fieldErrors.has("roleOther")}
													onOverflowChange={setFieldOverflow("roleOther")}
												/>
										</div>
										{formData.roleOther && overflowedFields.roleOther && (
											<TextArea
												name='roleOther'
												value={formData.roleOther}
												onChange={handleChange}
												width='full'
												rows={1}
												disabled={readOnly}
												inputClass={`${
													fieldErrors.has("roleOther")
														? "!border-red-500"
														: ""
												}`}
											/>
										)}

										<TextInput
											name='firmName'
											value={formData.firmName}
											onChange={handleChange}
											label='Your Firm / Agency Name:'
											placeholder='If none, write "N/A" or describe your connection - e.g., friend, neighbor, church, etc.'
											inputClass='placeholder:italic placeholder-[#FD7702]'
											width='full'
											error={fieldErrors.has("firmName")}
										/>

										<div className={`flex gap-4 w-full ${fieldErrors.has("referringEmail") || (!isEmpty(formData.referringPhone) &&
														!isValidUSPhone(formData.referringPhone)) ? 'mb-7' : ''}`}>
											<TextInput
												name='referringEmail'
												value={formData.referringEmail}
												onChange={handleChange}
												label='Your Email:'
												type='email'
												placeholder='e.g. name@firm.com'
												inputClass='placeholder:italic placeholder-[#FD7702]'
												width='50%'
												required
												error={fieldErrors.has("referringEmail")}
												errorMessage={
													!isEmpty(formData.referringEmail) &&
													!isValidEmail(formData.referringEmail)
														? "Please enter a valid email address."
														: ""
												}
											/>

											<PhoneInput
												name='referringPhone'
												value={formData.referringPhone}
												onChange={handleChange}
												label='Your Phone:'
												placeholder='(555) 234-5678'
												inputClass="placeholder:italic placeholder-[#FD7702]"
												width='50%'
												error={fieldErrors.has("referringPhone")}
												errorMessage={
													!isEmpty(formData.referringPhone) &&
													!isValidUSPhone(formData.referringPhone)
														? "Please enter a valid 10-digit US phone number."
														: ""
												}
											/>
										</div>

										<div className='w-full flex justify-between items-center'>
											<label className='block font-bold text-lg'>
												{renderLabel("Your Preferred Method of Contact:")}
											</label>
											<div
												className={`flex gap-4 ${
													fieldErrors.has("preferredContact")
														? "ring-2 ring-red-500 rounded p-1 w-max"
														: ""
												}`}>
												{[
													{ value: "Call", color: "teal" },
													{ value: "Email", color: "orange" },
													{ value: "Text", color: "teal" },
												].map((opt) => {
													const selected = formData.preferredContact
														? formData.preferredContact
																.split(",")
																.map((s) => s.trim())
																.filter(Boolean)
														: [];
													const isSelected = selected.includes(opt.value);
													return (
														<RadioButton
															key={opt.value}
															name='preferredContact'
															value={opt.value}
															selectedValue={isSelected ? opt.value : ""}
															label={opt.value}
															color={opt.color}
															width='100px'
															onChange={() => {
																markTouched("preferredContact");
																setFormData((prev) => {
																	const cur = prev.preferredContact
																		? prev.preferredContact
																				.split(",")
																				.map((s) => s.trim())
																				.filter(Boolean)
																		: [];
																	const next = cur.includes(opt.value)
																		? cur.filter((v) => v !== opt.value)
																		: [...cur, opt.value];
																	return {
																		...prev,
																		preferredContact: next.join(", "),
																	};
																});
															}}
														/>
													);
												})}
											</div>
										</div>

										{/* <div className='w-full flex justify-between items-center'>
											<label className='block font-bold text-lg'>
												{renderLabel(
													"Your Preferred Method of Contact:"
												)}
											</label>
											<div className='flex gap-4'>
												{["Call", "Email", "Text"].map((method) => {
													const selected = formData.preferredContact
														? formData.preferredContact
																.split(",")
																.map((s) => s.trim())
																.filter(Boolean)
														: [];
													return (
														<Checkbox
															key={method}
															name={method}
															label={method}
															width='100px'
															checked={selected.includes(method)}
															error={fieldErrors.has("preferredContact")}
															onChange={() => {
																markTouched("preferredContact");
																setFormData((prev) => {
																	const cur = prev.preferredContact
																		? prev.preferredContact
																				.split(",")
																				.map((s) => s.trim())
																				.filter(Boolean)
																		: [];
																	const next = cur.includes(method)
																		? cur.filter((v) => v !== method)
																		: [...cur, method];
																	return {
																		...prev,
																		preferredContact: next.join(", "),
																	};
																});
															}}
														/>
													);
												})}
											</div>
										</div> */}

										<div className='pt-3 font-bold'>
											<div
												style={{
													lineHeight: "1.5",
												}}
												className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
												If submitted by a Paralegal or Assistant (If none, write
												"N/A" or "Not Yet Assigned")
											</div>
											<TextInput
												name='attorneyName'
												value={formData.attorneyName}
												onChange={handleChange}
												label="Attorney of Record's Full Name:"
												error={fieldErrors.has("attorneyName")}
											/>
											<TextInput
												name='attorneyEmail'
												value={formData.attorneyEmail}
												onChange={handleChange}
												label="Attorney's Email (If Different):"
												type='email'
												placeholder='e.g. attorney@firm.com (or "N/A")'
												inputClass='placeholder:italic placeholder-[#FD7702]'
												containerClass='mt-3'
												error={fieldErrors.has("attorneyEmail")}
												errorMessage={
													!isEmpty(formData.attorneyEmail) &&
													!isNaValue(formData.attorneyEmail) &&
													!isValidEmail(formData.attorneyEmail)
														? "Please enter a valid email address."
														: ""
												}
											/>
											<div
												className='bg-gray-100 p-3 mt-3 italic space-y-2'
												style={{
													lineHeight: "1.5",
												}}>
												<p className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic uppercase'>
													Not an attorney? &nbsp; Not a problem.
												</p>
												<p>
													This Form Can Be Submitted by Any Trusted Party
													Helping the Estate Move Forward — No License Required.
												</p>
												<p>
													Or call{" "}
													<span className='text-[#0097A7] font-bold'>
														(833) PROBAID
													</span>{" "}
													— that's{" "}
													<span className='text-[#0097A7] font-bold not-italic'>
														(833) 776-2243
													</span>{" "}
													— and Speak With Me Directly.
												</p>
												<div className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic uppercase'>
													- Your Referral Could Make All the Difference for
													Someone Navigating a Difficult Chapter. Thank You for
													Stepping In.
												</div>
											</div>
										</div>
									</FormSection>
									{/* Case Type */}
									<FormSection title='Case Type' icon='fa-gavel'>
										<div className='flex justify-start gap-2 w-full'>
											<div className='w-[545px]'>
												<Checkbox
													name='probate'
													group='caseType'
													label='Probate'
													containerClass="w-fit"
													checked={formData.caseType.probate}
													onChange={(e) => {
														markTouched(
															"caseType",
															"caseType.probateAuthority",
															"clientRole",
															"clientRole.probateRole"
														);
														setFormData({
															...formData,
															clientRole: "",
															clientRoleOther: "",
															caseType: {
																...formData.caseType,
																probate: e.target.checked,
																otherCaseType: false,
																conservatorship: false,
																fullAuthority: false,
																limitedAuthority: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustSale: false,
																reverseMortgage: false,
																successorInInterest: false,
															},
														});
													}}
												/>
											</div>
											<div className='flex gap-[47px]'>
												<Checkbox
													name='fullAuthority'
													group='caseType'
													label='Full Authority'
													checked={formData.caseType.fullAuthority}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																fullAuthority: e.target.checked,
																otherCaseType: false,
																limitedAuthority: false,
																probate: true,
																conservatorship: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															},
														});
													}}
													width='160px'
													error={fieldErrors.has(
														"caseType.probateAuthority"
													)}
												/>
												<Checkbox
													name='limitedAuthority'
													group='caseType'
													label='Limited Authority (With Court Confirmation)'
													checked={formData.caseType.limitedAuthority}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																limitedAuthority: e.target.checked,
																otherCaseType: false,
																fullAuthority: false,
																probate: true,
																conservatorship: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															},
														});
													}}
													width='400px'
													error={fieldErrors.has(
														"caseType.probateAuthority"
													)}
												/>
											</div>
										</div>
										<div className='flex justify-start gap-2 w-full'>
											<div className='w-[545px]'>
												<Checkbox
													name='conservatorship'
													group='caseType'
													label='Conservatorship'
													checked={formData.caseType.conservatorship}
													onChange={(e) => {
														markTouched(
															"caseType",
															"caseType.conservatorshipScope",
															"clientRole",
															"clientRole.conservatorRole"
														);
														setFormData({
															...formData,
															clientRole: "",
															clientRoleOther: "",
															caseType: {
																...formData.caseType,
																conservatorship: e.target.checked,
																otherCaseType: false,
																probate: false,
																fullAuthority: false,
																limitedAuthority: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															}
														});
													}}
													width='180px'
												/>
											</div>
											<div className='flex gap-[47px]'>
												<Checkbox
													name='ofTheEstate'
													group='caseType'
													label='Of the Estate'
													checked={formData.caseType.ofTheEstate}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																ofTheEstate: e.target.checked,
																otherCaseType: false,
																ofThePerson: false,
																both: false,
																probate: false,
																conservatorship: true,
																fullAuthority: false,
																limitedAuthority: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															},
														});
													}}
													width='160px'
													error={fieldErrors.has(
														"caseType.conservatorshipScope"
													)}
												/>
												<Checkbox
													name='ofThePerson'
													group='caseType'
													label='Of the Person'
													checked={formData.caseType.ofThePerson}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																ofThePerson: e.target.checked,
																otherCaseType: false,
																ofTheEstate: false,
																both: false,
																probate: false,
																conservatorship: true,
																fullAuthority: false,
																limitedAuthority: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															},
														});
													}}
													width='170px'
													error={fieldErrors.has(
														"caseType.conservatorshipScope"
													)}
												/>
												<Checkbox
													name='both'
													group='caseType'
													label='Both'
													checked={formData.caseType.both}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																both: e.target.checked,
																otherCaseType: false,
																ofThePerson: true,
																ofTheEstate: true,
																probate: false,
																conservatorship: true,
																fullAuthority: false,
																limitedAuthority: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
																trustSale: false,
															},
														});
													}}
													width='150px'
													error={fieldErrors.has(
														"caseType.conservatorshipScope"
													)}
												/>
											</div>
										</div>
										<div className='flex justify-start gap-2 w-full'>
											<div className='w-[545px]'>
												<Checkbox
													name='trustSale'
													group='caseType'
													label='Trust Sale'
													checked={formData.caseType.trustSale}
													onChange={(e) => {
														markTouched(
															"caseType",
															"caseType.trustSaleRole",
															"clientRole",
															"clientRole.trustRole"
														);
														setFormData({
															...formData,
															clientRole: "",
															clientRoleOther: "",
															caseType: {
																...formData.caseType,
																trustSale: e.target.checked,
																otherCaseType: false,
																probate: false,
																conservatorship: false,
																fullAuthority: false,
																limitedAuthority: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustee: false,
																successorTrustee: false,
																reverseMortgage: false,
																successorInInterest: false,
															},
														});
													}}
													width='200px'
												/>
											</div>
											<div className='flex gap-[39px]'>
												<Checkbox
													name='trustee'
													group='caseType'
													label='Trustee'
													checked={formData.caseType.trustee}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																trustee: e.target.checked,
																otherCaseType: false,
																successorTrustee: false,
																probate: false,
																conservatorship: false,
																fullAuthority: false,
																limitedAuthority: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustSale: true,
																reverseMortgage: false,
																successorInInterest: false,
															},
														});
													}}
													width='168px'
													error={fieldErrors.has(
														"caseType.trustSaleRole"
													)}
												/>
												<Checkbox
													name='successorTrustee'
													group='caseType'
													label='Successor Trustee'
													checked={formData.caseType.successorTrustee}
													onChange={(e) => {
														setFormData({
															...formData,
															caseType: {
																...formData.caseType,
																successorTrustee: e.target.checked,
																otherCaseType: false,
																probate: false,
																conservatorship: false,
																fullAuthority: false,
																limitedAuthority: false,
																ofTheEstate: false,
																ofThePerson: false,
																both: false,
																trustSale: true,
																trustee: false,
																reverseMortgage: false,
																successorInInterest: false,
															},
														});
													}}
													width='250px'
													error={fieldErrors.has(
														"caseType.trustSaleRole"
													)}
												/>
											</div>
										</div>
										<div className='flex justify-start gap-2 w-full'>
											<Checkbox
												name='reverseMortgage'
												group='caseType'
												label='Reverse Mortgage'
												checked={formData.caseType.reverseMortgage}
												onChange={(e) => {
													markTouched("caseType", "clientRole");
													setFormData({
														...formData,
														clientRole: "",
														clientRoleOther: "",
														caseType: {
															...formData.caseType,
															reverseMortgage: e.target.checked,
															otherCaseType: false,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: false,
															trustee: false,
															successorTrustee: false,
															successorInInterest: false,
														},
													});
												}}
												width='220px'
											/>
										</div>
										<div className='flex justify-start gap-2 w-full'>
											<Checkbox
												name='successorInInterest'
												group='caseType'
												label='Successor in Interest'
												checked={formData.caseType.successorInInterest}
												onChange={(e) => {
													markTouched(
														"caseType",
														"clientRole",
														"clientRole.successorRole",
													);
													setFormData({
														...formData,
														clientRole: "",
														clientRoleOther: "",
														caseType: {
															...formData.caseType,
															successorInInterest: e.target.checked,
															otherCaseType: false,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
														},
													});
												}}
												width='240px'
											/>
										</div>
										<div className='flex justify-start gap-2 w-full'>
											<Checkbox
												name='otherCaseType'
												group='caseType'
												label='Other'
												checked={formData.caseType.otherCaseType}
												onChange={(e) => {
													markTouched(
														"caseType",
														"clientRole",
														"clientRole.successorRole",
													);
													setFormData({
														...formData,
														clientRole: "",
														clientRoleOther: "",
														caseType: {
															...formData.caseType,
															otherCaseType: e.target.checked,
															successorInInterest: false,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
														},
													});
												}}
												width='240px'
											/>
										</div>
										{fieldErrors.has("caseType") && (
											<p className='text-red-500 font-bold text-base'>
												Please select at least one case type.
											</p>
										)}
									</FormSection>

									{/* Client/Representative Details */}
									<FormSection
										title='Client / Representative Details'
										icon='fa-user-tie'>
										<TextInput
											name='clientName'
											value={formData.clientName}
											onChange={handleChange}
											label='Full Name:'
											width='full'
											required
											error={fieldErrors.has("clientName")}
										/>
										<div className='flex items-center gap-4'>
											{/* Client Role: single-pick for most Case Types, but Trust
											    Sale allows Trustee and/or Other together. Uses the radio
											    look regardless. */}
											<div className='w-full flex justify-between items-center'>
												<label className='block font-bold text-lg'>
													{renderLabel("Role in the Case:")}
												</label>
												<div
													className={`flex gap-4 ${
														fieldErrors.has("clientRole")
															? "ring-2 ring-red-500 rounded p-1 w-max"
															: ""
													}`}>
													{[
														{ value: "Executor", color: "teal", width: "140px" },
														{
															value: "Administrator",
															color: "orange",
															width: "180px",
														},
														{
															value: "Conservator",
															color: "teal",
															width: "160px",
														},
														{ value: "Trustee", color: "orange", width: "120px" },
														{ value: "Other", color: "teal", width: "100px" },
													].map((opt) => {
														const isSel = selectedClientRoles.includes(opt.value);
														const disabled = allowedClientRoles
															? !allowedClientRoles.includes(opt.value)
															: false;
														const optError =
															opt.value === "Executor" ||
															opt.value === "Administrator"
																? fieldErrors.has("clientRole.probateRole")
																: opt.value === "Conservator"
																	? fieldErrors.has("clientRole.conservatorRole")
																	: opt.value === "Trustee"
																		? fieldErrors.has("clientRole.trustRole")
																		: // Other — flagged by Trust Sale or Successor rules
																			// fieldErrors.has("clientRole.trustRole") ||
																			fieldErrors.has("clientRole.successorRole");
														return (
															<RadioButton
																key={opt.value}
																name='clientRole'
																value={opt.value}
																selectedValue={isSel ? opt.value : ""}
																label={opt.value}
																color={opt.color}
																width={opt.width}
																disabled={disabled}
																error={optError}
																onChange={() => {
																	markTouched(
																		"clientRole",
																		"clientRoleOther",
																		"clientRole.probateRole",
																		"clientRole.conservatorRole",
																		"clientRole.trustRole",
																		"clientRole.successorRole",
																	);
																	setFormData((prev) => {
																		const cur = prev.clientRole
																			? prev.clientRole
																					.split(",")
																					.map((s) => s.trim())
																					.filter(Boolean)
																			: [];
																		// Trust Sale toggles; other types single-pick.
																		const next = isClientRoleMulti
																			? cur.includes(opt.value)
																				? cur.filter((v) => v !== opt.value)
																				: [...cur, opt.value]
																			: [opt.value];
																		return {
																			...prev,
																			clientRole: next.join(", "),
																			clientRoleOther: next.includes("Other")
																				? prev.clientRoleOther
																				: "",
																		};
																	});
																}}
															/>
														);
													})}
												</div>
											</div>
											<TextInput
												name='clientRoleOther'
												value={formData.clientRoleOther}
												onChange={handleChange}
												width='290px'
												disabled={!selectedClientRoles.includes("Other")}
												error={fieldErrors.has("clientRoleOther")}
												onOverflowChange={setFieldOverflow("clientRoleOther")}
											/>
										</div>
										{formData.clientRoleOther &&
											overflowedFields.clientRoleOther && (
											<TextArea
												name='clientRoleOther'
												value={formData.clientRoleOther}
												onChange={handleChange}
												width='full'
												rows={1}
												disabled={readOnly}
												inputClass={`${
													fieldErrors.has("clientRoleOther")
														? "!border-red-500"
														: ""
												}`}
											/>
										)}
										<div className='flex justify-between items-center'>
											<label className='block font-bold text-base'>
												Has the Court Issued Letters Yet?
											</label>
											<div className='flex flex-col gap-3 items-end'>
												<div className='flex items-center gap-4'>
													<RadioGroup
														name='lettersIssued'
														value={formData.lettersIssued}
														onChange={handleChange}
														error={fieldErrors.has("lettersIssued")}
														options={[
															{
																value: "Yes",
																label: "Yes",
																color: "teal",
																width: "80px",
															},
															{
																value: "No",
																label: "No ",
																color: "orange",
																width: "80px",
															},
														]}
														width='auto'
														gap='gap-4'
														direction='horizontal'
													/>
													<div className='flex justify-center items-center'>
														<label className='font-bold mr-1'>
															{renderLabel("Issued On:")}
														</label>
														<DatePicker
															ref={lettersDateRef}
															maxDate={new Date()}
															selected={
																formData.lettersDate
																	? new Date(formData.lettersDate + "T00:00:00")
																	: null
															}
															onChange={(date) => {
																const event = {
																	target: {
																		name: "lettersDate",
																		value: date
																			? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
																			: "",
																	},
																};
																handleChange(event);
															}}
															className={`border-[3px] px-2 py-1 bg-gray-200 placeholder:italic placeholder-[#FD7702] w-[240px] font-bold focus:outline-none focus:ring-2 focus:ring-[#FD7702] focus:ring-offset-0 disabled:text-secondary disabled:[-webkit-text-fill-color:var(--color-secondary)] disabled:cursor-not-allowed ${
																fieldErrors.has("lettersDate")
																	? "border-red-500"
																	: "border-[#0097A7]"
															}`}
															placeholderText='Select date'
															popperPlacement="bottom-end"
															dateFormat='MM-dd-yyyy'
														/>
													</div>
													<div className='flex justify-center items-center'>
														<label className='font-bold mr-1'>
															{renderLabel("Expected By:")}
														</label>
														<DatePicker
															selected={
																formData.lettersExpectedDate
																	? new Date(
																			formData.lettersExpectedDate +
																				"T00:00:00",
																		)
																	: null
															}
															onChange={(date) => {
																const event = {
																	target: {
																		name: "lettersExpectedDate",
																		value: date
																			? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
																			: "",
																	},
																};
																handleChange(event);
															}}
															className='border-[3px] border-[#0097A7] px-2 py-1 bg-gray-200 placeholder:italic placeholder-[#FD7702] w-[230px] font-bold focus:outline-none focus:ring-2 focus:ring-[#FD7702] focus:ring-offset-0 disabled:text-secondary disabled:[-webkit-text-fill-color:var(--color-secondary)] disabled:cursor-not-allowed'
															placeholderText='Select date'
															popperPlacement="bottom-end"
															dateFormat='MM-dd-yyyy'
														/>
													</div>
												</div>
											</div>
										</div>

										<TextInput
											name='caseNumber'
											value={formData.caseNumber}
											onChange={handleChange}
											label='Case Number (If Available):'
											width='full'
										/>

										<TextInput
											name='courthouse'
											value={formData.courthouse}
											onChange={handleChange}
											label='Courthouse Handling File:'
											width='full'
											error={fieldErrors.has("courthouse")}
											onOverflowChange={setFieldOverflow("courthouse")}
										/>
										{formData.courthouse && overflowedFields.courthouse && (
											<TextArea
												name='courthouse'
												value={formData.courthouse}
												onChange={handleChange}
												width='full'
												rows={1}
												disabled={readOnly}
												inputClass={`${
													fieldErrors.has("courthouse")
														? "!border-red-500"
														: ""
												}`}
											/>
										)}
									</FormSection>

									{/* Property Information */}
									<FormSection
										title={`${
											formData.exportedProperties?.length > 1 ? "1 - " : ""
										}Property Information`}
										icon='fa-home'>
										<TextInput
											name='address'
											value={formData.exportedProperties[0]?.address || ""}
											onChange={(e) => handlePropertyChange(0, e)}
											label='Full Property Address:'
											width='full'
											required
											error={fieldErrors.has("property.0.address")}
											placeholder="123 Main St, Los Angeles, CA 90041"
											inputClass="placeholder:italic placeholder-[#FD7702]"
										/>

										<RadioGroup
											name='occupancyStatus'
											value={
												formData.exportedProperties[0]?.occupancyStatus || ""
											}
											onChange={(e) => handlePropertyChange(0, e)}
											label='Occupancy Status:'
											error={fieldErrors.has("property.0.occupancyStatus")}
											options={[
												{
													value: "Vacant",
													label: "Vacant",
													color: "teal",
													width: "110px",
												},
												{
													value: "Tenant",
													label: "Tenant",
													color: "orange",
													width: "110px",
												},
												{
													value: "Family Member",
													label: "Family Member",
													color: "teal",
													width: "177px",
												},
												{
													value: "Unauthorized Occupant/Squatter",
													label: "Unauthorized Occupant / Squatter",
													color: "orange",
													width: "350px",
												},
												{
													value: "Unknown",
													label: "Unknown",
													color: "teal",
													width: "130px",
												},
											]}
											width='full'
											gap='gap-4'
											containerClass='w-full flex justify-between'
										/>

										<div className='flex items-center justify-between w-full'>
											<label
												className='block font-bold text-base flex-shrink-0'
												style={{ minWidth: "35%" }}>
												Any Known Access Restrictions, Hostility, or Safety
												Concerns?
											</label>
											<div className='flex gap-4 justify-end items-center flex-1 w-full'>
												<div className='flex gap-4'>
													<RadioButton
														name='accessRestrictions'
														value='Yes'
														selectedValue={
															formData.exportedProperties[0]
																?.accessRestrictions || ""
														}
														onChange={(e) => handlePropertyChange(0, e)}
														label='Yes'
														color='teal'
														width='70px'
														error={fieldErrors.has(
															"property.0.accessRestrictions"
														)}
													/>
													<TextInput
														ref={(el) => {
															accessRestrictionsDetailsRef0.current = el;
															accessRestrictionsDetailsRefs.current[0] = el;
														}}
														name='accessRestrictionsDetails'
														value={
															formData.exportedProperties[0]
																?.accessRestrictionsDetails || ""
														}
														onChange={(e) => handlePropertyChange(0, e)}
														label='Please Describe:'
														containerClass='w-full max-w-none'
														inputClass='placeholder:italic placeholder-[#FD7702]'
														width='340px'
														error={fieldErrors.has(
															"property.0.accessRestrictionsDetails"
														)}
														onOverflowChange={setFieldOverflow(
															"property.0.accessRestrictionsDetails"
														)}
													/>
												</div>
												<RadioGroup
													name='accessRestrictions'
													value={
														formData.exportedProperties[0]
															?.accessRestrictions || ""
													}
													onChange={(e) => handlePropertyChange(0, e)}
													error={fieldErrors.has(
														"property.0.accessRestrictions"
													)}
													options={[
														{
															value: "No",
															label: "No ",
															color: "orange",
															width: "80px",
														},
														{
															value: "Not Sure",
															label: "Not Sure",
															color: "teal",
															width: "130px",
														},
													]}
													width='auto'
												/>
											</div>
										</div>
										{formData.exportedProperties[0]?.accessRestrictionsDetails &&
											overflowedFields["property.0.accessRestrictionsDetails"] && (
											<TextArea
												name='accessRestrictionsDetails'
												value={formData.exportedProperties[0]?.accessRestrictionsDetails || ""}
												onChange={(e) => handlePropertyChange(0, e)}
												width='full'
												rows={1}
												disabled={readOnly}
												inputClass={`placeholder:italic placeholder-[#FD7702] ${
													fieldErrors.has("property.0.accessRestrictionsDetails")
														? "!border-red-500"
														: ""
												}`}
											/>
										)}
										
										<div>
										<div className='flex items-center justify-between w-full gap-2'>
											<label
												className='block font-bold text-base flex-shrink-0'
												style={{ minWidth: "35%" }}>
												Any Urgency, Deadlines, or Court Pressure to List or
												Sell?
											</label>
											<div className='flex gap-4 justify-end items-center flex-1 w-full'>
												<div className='flex gap-4'>
													<RadioButton
														name='urgency'
														value='Yes'
														selectedValue={
															formData.exportedProperties[0]?.urgency || ""
														}
														onChange={(e) => handlePropertyChange(0, e)}
														label='Yes'
														color='teal'
														width='70px'
														error={fieldErrors.has("property.0.urgency")}
													/>
													<TextInput
														ref={(el) => {
															urgencyDetailsRef0.current = el;
															urgencyDetailsRefs.current[0] = el;
														}}
														name='urgencyDetails'
														value={
															formData.exportedProperties[0]?.urgencyDetails ||
															""
														}
														onChange={(e) => handlePropertyChange(0, e)}
														label='Please Describe:'
														containerClass='w-full max-w-none'
														inputClass='placeholder:italic placeholder-[#FD7702]'
														width='340px'
														error={fieldErrors.has("property.0.urgencyDetails")}
														onOverflowChange={setFieldOverflow(
															"property.0.urgencyDetails"
														)}
													/>
												</div>
												<RadioGroup
													name='urgency'
													value={formData.exportedProperties[0]?.urgency || ""}
													onChange={(e) => handlePropertyChange(0, e)}
													error={fieldErrors.has("property.0.urgency")}
													options={[
														{
															value: "No",
															label: "No ",
															color: "orange",
															width: "80px",
														},
														{
															value: "Not Sure",
															label: "Not Sure",
															color: "teal",
															width: "130px",
														},
													]}
													width='auto'
												/>
											</div>
										</div>
										</div>
										{formData.exportedProperties[0]?.urgencyDetails &&
											overflowedFields["property.0.urgencyDetails"] && (
											<TextArea
												name='urgencyDetails'
												value={formData.exportedProperties[0]?.urgencyDetails || ""}
												onChange={(e) => handlePropertyChange(0, e)}
												width='full'
												rows={1}
												disabled={readOnly}
												inputClass={`placeholder:italic placeholder-[#FD7702] ${
													fieldErrors.has("property.0.urgencyDetails")
														? "!border-red-500"
														: ""
												}`}
											/>
										)}

										<RadioGroup
											name='multipleProperties'
											value={formData.multipleProperties}
											onChange={handleChange}
											label='Multiple Properties?'
											error={fieldErrors.has("multipleProperties")}
											options={[
												{
													value: "Yes",
													label: "Yes – Details Below",
													color: "teal",
													width: "215px",
												},
												{
													value: "No",
													label: "No ",
													color: "orange",
													width: "130px",
												},
											]}
											width='full'
											gap='gap-4'
											containerClass='w-full flex justify-between'
										/>
									</FormSection>

									{/* Extra Property Info */}
									{formData.multipleProperties === "Yes" && (
										<div className='mb-0'>
											{formData.exportedProperties
												.slice(1)
												.map((property, index) => (
													<FormSection
														key={index + 1}
														title={`${index + 2} - Property Information`}
														icon='fa-home'>
														<TextInput
															name='address'
															value={property.address}
															onChange={(e) =>
																handlePropertyChange(index + 1, e)
															}
															label='Full Property Address:'
															width='full'
															required
															error={fieldErrors.has(
																`property.${index + 1}.address`
															)}
															placeholder="123 Main St, Los Angeles, CA 90041"
															inputClass="placeholder:italic placeholder-[#FD7702]"
														/>
														<RadioGroup
															name='occupancyStatus'
															value={property.occupancyStatus || ""}
															onChange={(e) =>
																handlePropertyChange(index + 1, e)
															}
															label='Occupancy Status:'
															error={fieldErrors.has(
																`property.${index + 1}.occupancyStatus`
															)}
															options={[
																{
																	value: "Vacant",
																	label: "Vacant",
																	color: "teal",
																	width: "110px",
																},
																{
																	value: "Tenant",
																	label: "Tenant",
																	color: "orange",
																	width: "110px",
																},
																{
																	value: "Family Member",
																	label: "Family Member",
																	color: "teal",
																	width: "177px",
																},
																{
																	value: "Unauthorized Occupant/Squatter",
																	label: "Unauthorized Occupant/Squatter",
																	color: "orange",
																	width: "350px",
																},
																{
																	value: "Unknown",
																	label: "Unknown",
																	color: "teal",
																	width: "130px",
																},
															]}
															width='full'
															gap='gap-4'
															containerClass='w-full flex justify-between'
														/>

														<div className='flex items-center justify-between w-full'>
															<label
																className='block font-bold text-base flex-shrink-0'
																style={{ minWidth: "35%" }}>
																Any Known Access Restrictions, Hostility, or
																Safety Concerns?
															</label>
															<div className='flex gap-4 justify-end items-center flex-1 w-full'>
																<div className='flex gap-4'>
																	<RadioButton
																		name='accessRestrictions'
																		value='Yes'
																		selectedValue={property.accessRestrictions}
																		onChange={(e) =>
																			handlePropertyChange(index + 1, e)
																		}
																		label='Yes'
																		color='teal'
																		width='70px'
																		error={fieldErrors.has(
																			`property.${index + 1}.accessRestrictions`
																		)}
																	/>
																	<TextInput
																		ref={(el) =>
																			(accessRestrictionsDetailsRefs.current[
																				index + 1
																			] = el)
																		}
																		name='accessRestrictionsDetails'
																		value={property.accessRestrictionsDetails}
																		onChange={(e) =>
																			handlePropertyChange(index + 1, e)
																		}
																		label='Please Describe:'
																		containerClass='w-full max-w-none'
																		inputClass='placeholder:italic placeholder-[#FD7702]'
																		width='340px'
																		error={fieldErrors.has(
																			`property.${index + 1}.accessRestrictionsDetails`
																		)}
																		onOverflowChange={setFieldOverflow(
																			`property.${index + 1}.accessRestrictionsDetails`
																		)}
																	/>
																</div>
																<RadioGroup
																	name='accessRestrictions'
																	value={property.accessRestrictions || ""}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	error={fieldErrors.has(
																		`property.${index + 1}.accessRestrictions`
																	)}
																	options={[
																		{
																			value: "No",
																			label: "No ",
																			color: "orange",
																			width: "80px",
																		},
																		{
																			value: "Not Sure",
																			label: "Not Sure",
																			color: "teal",
																			width: "130px",
																		},
																	]}
																	width='auto'
																/>
															</div>
														</div>
														{property.accessRestrictionsDetails &&
															overflowedFields[`property.${index + 1}.accessRestrictionsDetails`] && (
															<TextArea
																name='accessRestrictionsDetails'
																value={property.accessRestrictionsDetails || ""}
																onChange={(e) => handlePropertyChange(index + 1, e)}
																width='full'
																rows={1}
																disabled={readOnly}
																inputClass={`placeholder:italic placeholder-[#FD7702] ${
																	fieldErrors.has(`property.${index + 1}.accessRestrictionsDetails`)
																		? "!border-red-500"
																		: ""
																}`}
															/>
														)}
														<div className='flex items-center justify-between w-full gap-2'>
															<label
																className='block font-bold text-base flex-shrink-0'
																style={{ minWidth: "35%" }}>
																Any Urgency, Deadlines, or Court Pressure to
																List or Sell?
															</label>
															<div className='flex gap-4 justify-end items-center flex-1 w-full'>
																<div className='flex gap-4'>
																	<RadioButton
																		name='urgency'
																		value='Yes'
																		selectedValue={property.urgency}
																		onChange={(e) =>
																			handlePropertyChange(index + 1, e)
																		}
																		label='Yes'
																		color='teal'
																		width='70px'
																		error={fieldErrors.has(
																			`property.${index + 1}.urgency`
																		)}
																	/>
																	<TextInput
																		ref={(el) =>
																			(urgencyDetailsRefs.current[index + 1] =
																				el)
																		}
																		name='urgencyDetails'
																		value={property.urgencyDetails}
																		onChange={(e) =>
																			handlePropertyChange(index + 1, e)
																		}
																		label='Please Describe:'
																		containerClass='w-full max-w-none'
																		inputClass='placeholder:italic placeholder-[#FD7702]'
																		width='340px'
																		error={fieldErrors.has(
																			`property.${index + 1}.urgencyDetails`
																		)}
																		onOverflowChange={setFieldOverflow(
																			`property.${index + 1}.urgencyDetails`
																		)}
																	/>
																</div>
																<RadioGroup
																	name='urgency'
																	value={property.urgency || ""}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	error={fieldErrors.has(
																		`property.${index + 1}.urgency`
																	)}
																	options={[
																		{
																			value: "No",
																			label: "No ",
																			color: "orange",
																			width: "80px",
																		},
																		{
																			value: "Not Sure",
																			label: "Not Sure",
																			color: "teal",
																			width: "130px",
																		},
																	]}
																	width='auto'
																/>
															</div>
														</div>
														{property.urgencyDetails &&
															overflowedFields[`property.${index + 1}.urgencyDetails`] && (
															<TextArea
																name='urgencyDetails'
																value={property.urgencyDetails || ""}
																onChange={(e) => handlePropertyChange(index + 1, e)}
																width='full'
																rows={1}
																disabled={readOnly}
																inputClass={`placeholder:italic placeholder-[#FD7702] ${
																	fieldErrors.has(`property.${index + 1}.urgencyDetails`)
																		? "!border-red-500"
																		: ""
																}`}
															/>
														)}
														<RadioGroup
															name='multipleProperties'
															value={property.multipleProperties}
															onChange={(e) =>
																handlePropertyChange(index + 1, e)
															}
															label='Multiple Properties?'
															error={fieldErrors.has(
																`property.${index + 1}.multipleProperties`
															)}
															options={[
																{
																	value: "Yes",
																	label: "Yes – Details Below",
																	color: "teal",
																	width: "215px",
																},
																{
																	value: "No",
																	label: "No ",
																	color: "orange",
																	width: "130px",
																},
															]}
															width='full'
															gap='gap-4'
															containerClass='w-full flex justify-between'
														/>
													</FormSection>
												))}
										</div>
									)}

									{/* Requested Support */}
									<FormSection
										title='Requested Support (Select All that Apply)'
										icon='fa-hands-helping'>
										<div className='flex flex-col gap-2 w-full'>
											<Checkbox
												name='contactClient'
												group='requestedSupport'
												label='Contact Client Directly and Coordinate Next Steps'
												containerClass="w-fit"
												checked={formData.requestedSupport.contactClient}
												onChange={handleChange}
											/>
											<Checkbox
												name='waitForIntro'
												group='requestedSupport'
												label='Wait for Your Intro Email or Call'
												containerClass="w-fit"
												checked={formData.requestedSupport.waitForIntro}
												onChange={handleChange}
											/>
											<Checkbox
												name='provideOpinion'
												group='requestedSupport'
												label='Provide a Court-Aligned Opinion of Value'
												containerClass="w-fit"
												checked={formData.requestedSupport.provideOpinion}
												onChange={handleChange}
											/>
											<Checkbox
												name='conductWalkthrough'
												group='requestedSupport'
												label='Conduct Property Walkthrough and Condition Report'
												containerClass="w-fit"
												checked={formData.requestedSupport.conductWalkthrough}
												onChange={handleChange}
											/>
											<div className="flex gap-3 items-center w-full">
												<Checkbox
													name='preparePhotos'
													group='requestedSupport'
													label='Prepare Photos for Referee'
													checked={formData.requestedSupport.preparePhotos}
													onChange={handleChange}
													width='300px'
												/>
												<span className="font-bold text-xl text-[#FD7702]">/</span>
												<TextInput
													name='refereeFullName'
													value={formData.requestedSupport.refereeFullName}
													onChange={handleSupportFieldChange("refereeFullName")}
													label="Referee's Full Name:"
													disabled={!formData.requestedSupport.preparePhotos}
													inputClass="!w-full"
													error={fieldErrors.has("refereeFullName")}
												/>
											</div>
											{formData.requestedSupport.preparePhotos && (
												<div className={`flex gap-2 items-center ml-102.25 ${(!isEmpty(formData.requestedSupport.refereePhone) &&
															!isValidUSPhone(formData.requestedSupport.refereePhone)) || (!isEmpty(formData.requestedSupport.refereeEmail) &&
															!isValidEmail(formData.requestedSupport.refereeEmail)) ? 'mb-[35px]' : ''}`}>
													<PhoneInput
														name='refereePhone'
														value={formData.requestedSupport.refereePhone}
														onChange={handleSupportFieldChange("refereePhone")}
														label='Phone:'
														inputClass="!w-40 placeholder:italic placeholder-[#FD7702]"
														disabled={!formData.requestedSupport.preparePhotos}
														error={fieldErrors.has("refereePhone")}
														errorMessage={
															!isEmpty(formData.requestedSupport.refereePhone) &&
															!isValidUSPhone(formData.requestedSupport.refereePhone)
															? "Please enter a valid 10-digit US phone number."
															: ""
														}
														/>
													<TextInput
														name='refereeEmail'
														value={formData.requestedSupport.refereeEmail}
														onChange={handleSupportFieldChange("refereeEmail")}
														label='Email:'
														type='email'
														inputClass="!w-110 placeholder:italic placeholder-[#FD7702]"
														disabled={!formData.requestedSupport.preparePhotos}
														placeholder='e.g. name@firm.com'
														error={fieldErrors.has("refereeEmail")}
														errorMessage={
															!isEmpty(formData.requestedSupport.refereeEmail) &&
															!isValidEmail(formData.requestedSupport.refereeEmail)
															? "Please enter a valid email address."
															: ""
														}
														/>
												</div>
											)}
											<div className='flex gap-1 items-start justify-between w-full'>
												<Checkbox
													name='refereeAssigned'
													group='requestedSupport'
													label='No Referee Assigned? Will You Be Ordering a Private Appraisal?'
													checked={formData.requestedSupport.refereeAssigned}
													onChange={handleChange}
													width='450px'
												/>

												<div className='flex gap-1 flex-1 justify-end'>
													<RadioGroup
														name='willOrderPrivateAppraisal'
														value={
															formData.requestedSupport
																.willOrderPrivateAppraisal
														}
														onChange={(e) => {
															markTouched("willOrderPrivateAppraisal");
															// Picking an appraisal answer implies there is no
															// referee — auto-check "No Referee Assigned".
															setFormData((prev) => ({
																...prev,
																requestedSupport: {
																	...prev.requestedSupport,
																	refereeAssigned: true,
																	willOrderPrivateAppraisal: e.target.value,
																},
															}));
														}}
														error={fieldErrors.has("willOrderPrivateAppraisal")}
														options={[
															{
																value: "Yes",
																label: "Yes",
																color: "teal",
																width: "80px",
															},
															{
																value: "No",
																label: "No ",
																color: "orange",
																width: "80px",
															},
															{
																value: "Not Sure",
																label: "Not Sure",
																color: "teal",
																width: "130px",
															},
														]}
														width='auto'
														containerClass='flex gap-1'
													/>
												</div>
											</div>
											<Checkbox
												name='coordinateVendors'
												group='requestedSupport'
												label='Coordinate Vendors (Clean-Out, Locksmith, Etc.)'
												containerClass="w-fit"
												checked={formData.requestedSupport.coordinateVendors}
												onChange={handleChange}
											/>
											<Checkbox
												name='notReadyForListing'
												group='requestedSupport'
												label='Pre-Listing Consultation Only - Meet with the Client to Explain the Process and Prep the File'
												containerClass="w-fit"
												checked={formData.requestedSupport.notReadyForListing}
												onChange={handleChange}
											/>
										</div>
										{fieldErrors.has("requestedSupport") && (
											<p className='text-red-500 font-bold text-base'>
												Please select at least one type of requested support.
											</p>
										)}
									</FormSection>

									{/* Document Upload */}
									<FormSection title='Document Upload' icon='fa-file-upload'>
										<div className='mb-3'>
											<div
												style={{
													lineHeight: "1.5",
												}}
												className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic mb-3 uppercase'>
												Please Upload or Email Any of the Following That Apply :
											</div>
											<div className='flex flex-col gap-2'>
												<Checkbox
													name='lettersOfAdministration'
													group='documentUpload'
													label='Letters of Administration / Testamentary (DE-150)'
													checked={
														formData.documentUpload.lettersOfAdministration
													}
													onChange={handleChange}
													width='fit'
												/>
												<Checkbox
													name='lettersOfConservatorship'
													group='documentUpload'
													label='Letters of Conservatorship of The Estate (GC-350)'
													checked={
														formData.documentUpload.lettersOfConservatorship
													}
													onChange={handleChange}
													width='fit'
												/>
												<Checkbox
													name='trustCertification'
													group='documentUpload'
													label='Trust Certification Page (or Full Trust Agreement if Unavailable)'
													checked={formData.documentUpload.trustCertification}
													onChange={handleChange}
													width='fit'
												/>
												<Checkbox
													name='recordedDeed'
													group='documentUpload'
													label='Recorded Deed in Trust Name (to Confirm Title Vesting Prior to Prelim — Optional, But Helps Speed Up Coordination)'
													checked={formData.documentUpload.recordedDeed}
													onChange={handleChange}
													width='fit'
												/>

												<Checkbox
													name='courtMinuteOrder'
													group='documentUpload'
													label='Minute Order or Court Filling Confirming Sale Authority'
													checked={formData.documentUpload.courtMinuteOrder}
													onChange={handleChange}
													width='fit'
												/>
												<Checkbox
													name='relevantFilings'
													group='documentUpload'
													label='Any Relevant Filings, Petitions, or Timeline Documents'
													checked={formData.documentUpload.relevantFilings}
													onChange={handleChange}
													width='fit'
												/>
											</div>
											{fieldErrors.has("documentUpload") && (
												<p className='text-red-500 font-bold text-base mt-2'>
													Please select at least one document type.
												</p>
											)}
										</div>
										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic mb-3 uppercase'>
											Please ensure all uploaded documents match the case type
											selected above.
										</div>
										<div className='mt-4 w-full'>
											<FileUpload
												name='documentFiles'
												onChange={handleFileChange}
												label='Upload Documents'
												accept='.pdf,.doc,.docx,.jpg,.png,.zip'
												width='full'
												multiple
												disabled={readOnly}
												value={
													formData.uploadedFiles?.length
														? formData.uploadedFiles
														: null
												}
												error={fieldErrors.has("uploadedFiles")}
											/>
											{fieldErrors.has("uploadedFiles") && (
												<p className='text-red-500 font-bold text-base mt-2'>
													Please upload at least one document.
												</p>
											)}
											<div className='mt-2 text-sm text-gray-500'>
												{formData.uploadedFiles.length > 0 && (
													<div>
														<p className='font-bold'>Uploaded files:</p>
														<ul className='list-disc pl-5 text-green-700'>
															{formData.uploadedFiles.map((file, index) => (
																<li key={index}>
																	{file instanceof File
																		? file.name
																		: file.originalName ||
																			file.name ||
																			file.path}
																</li>
															))}
														</ul>
													</div>
												)}
											</div>
										</div>
									</FormSection>

									{/* How Did You Hear About Us */}
									<FormSection
										title='How Did You Hear About 833PROBAID®?'
										icon='fa-question'>
										<div className='grid grid-cols-2 gap-2 mb-2'>
											<Checkbox
												name='onlineSearch'
												value='Online Search'
												checked={formData.onlineSearch}
												onChange={handleChange}
												label='Online Search'
												width='fit'
											/>
											<Checkbox
												name='socialMedia'
												value='Social Media'
												checked={formData.socialMedia}
												onChange={handleChange}
												label='Social Media'
												width='fit'
											/>
											<Checkbox
												name='directAttorneyReferral'
												value='Direct Attorney Referral'
												checked={formData.directAttorneyReferral}
												onChange={handleChange}
												label='Direct Attorney Referral'
												width='fit'
											/>
											<Checkbox
												name='pastCasePriorMatter'
												value='Past Case / Prior Matter'
												checked={formData.pastCasePriorMatter}
												onChange={handleChange}
												label='Past Case / Prior Matter'
												width='fit'
											/>
											<Checkbox
												name='emailNewsletterOrBrochure'
												value='Email Newsletter or Brochure'
												checked={formData.emailNewsletterOrBrochure}
												onChange={handleChange}
												label='Email Newsletter or Brochure'
												width='fit'
											/>
											<Checkbox
												name='barAssociationOrLegalEvent'
												value='Bar Association / Legal Event'
												checked={formData.barAssociationOrLegalEvent}
												onChange={handleChange}
												label='Bar Association / Legal Event'
												width='fit'
											/>
											<Checkbox
												name='courtClerkOrProbateExaminer'
												value='Court Clerk or Probate Examiner'
												checked={formData.courtClerkOrProbateExaminer}
												onChange={handleChange}
												label='Court Clerk or Probate Examiner'
												width='fit'
											/>
											<div className='w-full flex items-center gap-2'>
												<Checkbox
													name='other'
													value='Other'
													checked={formData.other}
													onChange={handleChange}
													label='Other'
													color='orange'
													width='90px'
												/>
												<TextInput
													name='otherDetails'
													value={formData.otherDetails}
													onChange={handleChange}
													width='100%'
													ref={howDidYouHearOtherRef}
													disabled={!formData.other}
													error={fieldErrors.has("otherDetails")}
													onOverflowChange={setFieldOverflow("otherDetails")}
												/>
											</div>
											<div className="col-span-2">
												{formData.other && overflowedFields.otherDetails && (
													<TextArea
														name='otherDetails'
														value={formData.otherDetails}
														onChange={handleChange}
														width='full'
														rows={1}
														disabled={readOnly}
														inputClass={`${
															fieldErrors.has("otherDetails")
																? "!border-red-500"
																: ""
														}`}
													/>
												)}
											</div>
										</div>
										{fieldErrors.has("howDidYouHear") && (
											<p className='text-red-500 font-bold text-base'>
												Please select at least one option.
											</p>
										)}
									</FormSection>

									<div className='pt-5 pb-9'></div>

									{/* Footer Contact Information */}
									<div className='bg-[#0097A7] text-white py-1 pl-8 pr-1 z-10 absolute bottom-0 left-2 right-0'>
										<div className='flex gap-3 justify-evenly text-2xl font-bold'>
											{/* Phone Section */}
											<a
												href='tel:8337762243'
												className='flex items-center hover:text-[#FD7702] group text-center -ml-11'>
												<i className='fas fa-phone-volume text-4xl text-[#FD7702] group-hover:text-white mr-3'></i>
												<div className='flex flex-col items-end leading-tight'>
													<div className='tracking-wide'>(833) PROBAID</div>
													<div className='tracking-wider lowercase -mt-1 w-max'>
														7762243
													</div>
												</div>
											</a>
											<div className='border-r-2 border-white'></div>

											{/* Email Section */}
											<a
												href='mailto:Info@833probaid.com'
												className='flex items-center border-white group'>
												<i className='fas fa-envelope text-[#FD7702] group-hover:text-white text-4xl mr-3'></i>
												<span>
													<span className='text-black group-hover:text-white'>
														Info@
													</span>
													<span className='text-white group-hover:text-black'>
														833probaid
													</span>
													<span className='text-black group-hover:text-white'>
														.com
													</span>
												</span>
											</a>

											<div className='border-r-2 border-white'></div>
											{/* Website Section */}
											<a
												href='https://www.833probaid.com'
												className='flex items-center group'>
												<i className='fas fa-globe text-[#FD7702] group-hover:text-white text-4xl mr-3'></i>
												<span>
													<span className='text-black group-hover:text-white'>
														www.
													</span>
													<span className='text-white group-hover:text-black'>
														833probaid
													</span>
													<span className='text-black group-hover:text-white'>
														.com
													</span>
												</span>
											</a>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className='max-w-full overflow-x-hidden px-4'>
				<div className='flex flex-col items-center mt-6 gap-3'>
					{!readOnly && submitStatus !== "success" && (
						<CTAButton 
							label={submitStatus === 'loading' ? 'Submitting…' : 'Submit Referral'} 
							iconPosition="left"
							onClick={handleSendPdfByEmail}
							disabled={submitStatus === "loading"}
							icon={<i className={`fas ${submitStatus === "loading" ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-white text-xl tracking-wide [text-shadow:1px_2px_1.6px_rgba(0,0,0,0.82),0_0_6px_rgba(255,255,255,0.25)]`} />} 
							className="cursor-pointer w-max px-4 h-12 lg:h-16 mb-4 mt-5"
						/>
					)}
					{submitStatus === "success" && (
						<div className='flex items-center gap-2 bg-green-100 border border-green-400 text-green-800 font-bold px-6 py-3 rounded'>
							<i className='fas fa-check-circle text-green-600'></i>
							Referral submitted successfully! Resetting in {countdown}s…
						</div>
					)}
					{submitStatus === "error" && (
						<div className='flex items-center gap-2 bg-red-100 border border-red-400 text-red-800 font-bold px-6 py-3 rounded'>
							<i className='fas fa-exclamation-circle text-red-600'></i>
							{submitError || "Submission failed. Please try again."}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Form;
