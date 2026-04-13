import { NextResponse } from "next/server";
import * as vendorController from "../../../controllers/vendorController.js";

export async function GET(request, { params }) {
	try {
		const { id } = await params;
		const result = await vendorController.handleGetVendorById(id);
		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;
		const result = await vendorController.handleDeleteVendor(id);
		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
