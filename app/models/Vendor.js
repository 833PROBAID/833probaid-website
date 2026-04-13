import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
	{
		// Company Information
		businessName: { type: String, default: "" },
		yourName: { type: String, default: "" },
		cellPhone: { type: String, default: "" },
		officePhone: { type: String, default: "" },
		email: { type: String, default: "" },

		// Payment Terms & Work Agreement
		acceptDeferredPayment: { type: String, default: "" },
		paidThroughEscrow: { type: String, default: "" },
		requireSignedAgreement: { type: String, default: "" },
		insured: { type: String, default: "" },
		cancellationFee: { type: String, default: "" },
		cancellationAmount: { type: String, default: "" },
		takePhotos: { type: String, default: "" },
		subcontract: { type: String, default: "" },

		// Service Area
		headquarters: { type: String, default: "" },
		travelDistance: { type: String, default: "" },
		specificAreas: { type: String, default: "" },

		// Payment Methods
		paymentMethods: {
			cash: { type: Boolean, default: false },
			check: { type: Boolean, default: false },
			creditCard: { type: Boolean, default: false },
			zelle: { type: Boolean, default: false },
			venmo: { type: Boolean, default: false },
			paypal: { type: Boolean, default: false },
			escrowOnly: { type: Boolean, default: false },
		},

		// Availability & Scheduling
		daysAvailable: {
			mon: { type: Boolean, default: false },
			tue: { type: Boolean, default: false },
			wed: { type: Boolean, default: false },
			thu: { type: Boolean, default: false },
			fri: { type: Boolean, default: false },
			sat: { type: Boolean, default: false },
			sun: { type: Boolean, default: false },
		},
		howSoon: { type: String, default: "" },
		preferredTimeWindow: { type: String, default: "" },
		emergencyServices: { type: String, default: "" },

		// Services Offered
		servicesOffered: {
			locksmith: { type: Boolean, default: false },
			haulingJunkRemoval: { type: Boolean, default: false },
			deepCleaning: { type: Boolean, default: false },
			biohazardCleanup: { type: Boolean, default: false },
			propertyInspector: { type: Boolean, default: false },
			securityBoardUp: { type: Boolean, default: false },
			estateLiquidator: { type: Boolean, default: false },
			generalContractorHandyman: { type: Boolean, default: false },
			roofingStructuralInspection: { type: Boolean, default: false },
			translationInterpretationServices: { type: Boolean, default: false },
			others: { type: Boolean, default: false },
		},
		othersList: { type: String, default: "" },

		// Notes & Credentials
		notesOrSpecialRequirements: { type: String, default: "" },
		licensed: { type: String, default: "" },
		licenseNumber: { type: String, default: "" },
		suretyCompany: { type: String, default: "" },
		insuredSecond: { type: String, default: "" },
		bonded: { type: String, default: "" },
		bondNumber: { type: String, default: "" },

		// Legal & Ethical Conduct
		courtSupervisedUnderstand: { type: String, default: "" },
		notifyAgentSensitive: { type: String, default: "" },
		agreeNotToTakeItems: { type: String, default: "" },
		agreeToTakePhotos: { type: String, default: "" },
		agreeToIndemnify: { type: String, default: "" },
		understandNoGuarantee: { type: String, default: "" },

		// Translation/Interpretation Services
		translationServices: {
			languagesOffered: { type: String, default: "" },
			areasServed: { type: String, default: "" },
			inPersonHourlyRate: { type: String, default: "" },
			phoneVirtualHourlyRate: { type: String, default: "" },
			listingPresentationTranslation: { type: Boolean, default: false },
			contractDisclosureTranslation: { type: Boolean, default: false },
			propertyWalkthroughTranslation: { type: Boolean, default: false },
			attorneyConferenceTranslation: { type: Boolean, default: false },
			otherAvailability: { type: Boolean, default: false },
			otherAvailabilityList: { type: String, default: "" },
			certifiedInterpreter: { type: Boolean, default: false },
			certifiedTranslator: { type: Boolean, default: false },
			certifyingAuthority: { type: String, default: "" },
			certifyingOrganization: { type: String, default: "" },
			licenseNumber: { type: String, default: "" },
			translatorLicenseNumber: { type: String, default: "" },
			languagePairs: { type: String, default: "" },
			yearsOfExperience: { type: String, default: "" },
			turnaroundTime: { type: String, default: "" },
			otherSpecializationList: { type: String, default: "" },
			specializations: {
				willsTrusts: { type: Boolean, default: false },
				probateCourtForms: { type: Boolean, default: false },
				propertyDisclosures: { type: Boolean, default: false },
				legalContracts: { type: Boolean, default: false },
				medicalDocuments: { type: Boolean, default: false },
				other: { type: Boolean, default: false },
				iContractTranslation: { type: Boolean, default: false },
			},
		},

		// Uploaded files with metadata
		uploadedFiles: {
			type: [
				{
					originalName: { type: String, default: "" },
					name: { type: String, default: "" },
					size: { type: Number, default: 0 },
					mimeType: { type: String, default: "" },
					path: { type: String, default: "" },
					fieldName: { type: String, default: "" },
				},
			],
			default: [],
		},

		submittedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

// In development, always use the latest schema (handles HMR without server restart)
if (mongoose.models.Vendor) {
	delete mongoose.models.Vendor;
}

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
