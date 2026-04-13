import { NextResponse } from "next/server";
import * as referralController from "../../../controllers/referralController.js";

export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await referralController.handleGetReferralById(id);
		if (!result.success) return NextResponse.json(result, { status: 404 });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await referralController.handleDeleteReferral(id);
		if (!result.success) return NextResponse.json(result, { status: 404 });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
