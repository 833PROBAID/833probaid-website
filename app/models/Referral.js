import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
	{
		address: { type: String, default: "" },
		occupancyStatus: { type: String, default: "" },
		multipleProperties: { type: String, default: "" },
		additionalAddresses: { type: String, default: "" },
		accessRestrictions: { type: String, default: "" },
		accessRestrictionsDetails: { type: String, default: "" },
		urgency: { type: String, default: "" },
		urgencyDetails: { type: String, default: "" },
	},
	{ _id: false },
);

const referralSchema = new mongoose.Schema(
	{
		// Referring Party Info
		referringPartyName: { type: String, default: "" },
		role: { type: String, default: "" },
		roleOther: { type: String, default: "" },
		firmName: { type: String, default: "" },
		referringEmail: { type: String, default: "" },
		referringPhone: { type: String, default: "" },
		preferredContact: { type: String, default: "" },
		attorneyName: { type: String, default: "" },
		attorneyEmail: { type: String, default: "" },

		// Client / Representative Details
		clientName: { type: String, default: "" },
		clientRole: { type: String, default: "" },
		clientRoleOther: { type: String, default: "" },
		lettersIssued: { type: String, default: "" },
		lettersDate: { type: String, default: "" },
		lettersExpectedDate: { type: String, default: "" },
		caseNumber: { type: String, default: "" },
		courthouse: { type: String, default: "" },

		// Property Information
		propertyAddress: { type: String, default: "" },
		occupancyStatus: { type: String, default: "" },
		multipleProperties: { type: String, default: "" },
		additionalAddresses: { type: String, default: "" },
		accessRestrictions: { type: String, default: "" },
		accessRestrictionsDetails: { type: String, default: "" },
		urgency: { type: String, default: "" },
		urgencyDetails: { type: String, default: "" },

		// Extra properties (for multiple property submissions)
		exportedProperties: { type: [propertySchema], default: [] },

		// Case Type
		caseType: {
			probate: { type: Boolean, default: false },
			fullAuthority: { type: Boolean, default: false },
			limitedAuthority: { type: Boolean, default: false },
			conservatorship: { type: Boolean, default: false },
			ofTheEstate: { type: Boolean, default: false },
			ofThePerson: { type: Boolean, default: false },
			both: { type: Boolean, default: false },
			trustSale: { type: Boolean, default: false },
			trustee: { type: Boolean, default: false },
			successorTrustee: { type: Boolean, default: false },
			reverseMortgage: { type: Boolean, default: false },
			successorInInterest: { type: Boolean, default: false },
			notSure: { type: Boolean, default: false },
		},

		// Requested Support
		requestedSupport: {
			contactClient: { type: Boolean, default: false },
			waitForIntro: { type: Boolean, default: false },
			provideOpinion: { type: Boolean, default: false },
			refereeAssigned: { type: Boolean, default: false },
			conductWalkthrough: { type: Boolean, default: false },
			preparePhotos: { type: Boolean, default: false },
			willOrderPrivateAppraisal: { type: String, default: "" },
			coordinateVendors: { type: Boolean, default: false },
			notReadyForListing: { type: Boolean, default: false },
		},

		// Document Upload flags
		documentUpload: {
			lettersOfAdministration: { type: Boolean, default: false },
			lettersOfConservatorship: { type: Boolean, default: false },
			trustCertification: { type: Boolean, default: false },
			recordedDeed: { type: Boolean, default: false },
			courtMinuteOrder: { type: Boolean, default: false },
			relevantFilings: { type: Boolean, default: false },
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
				},
			],
			default: [],
		},

		// How Did You Hear About Us
		onlineSearch: { type: Boolean, default: false },
		socialMedia: { type: Boolean, default: false },
		directAttorneyReferral: { type: Boolean, default: false },
		pastCasePriorMatter: { type: Boolean, default: false },
		emailNewsletterOrBrochure: { type: Boolean, default: false },
		barAssociationOrLegalEvent: { type: Boolean, default: false },
		courtClerkOrProbateExaminer: { type: Boolean, default: false },
		other: { type: Boolean, default: false },
		otherDetails: { type: String, default: "" },

		// Legacy / unused but kept for compat
		howDidYouHear: { type: String, default: "" },
		howDidYouHearOther: { type: String, default: "" },

		submittedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

// In development, always use the latest schema (handles HMR without server restart)
if (mongoose.models.Referral) {
	delete mongoose.models.Referral;
}

const Referral = mongoose.model("Referral", referralSchema);

export default Referral;
