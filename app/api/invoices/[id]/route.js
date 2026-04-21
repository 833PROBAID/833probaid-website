import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// GET /api/invoices/[id]
export const GET = requireAuth(async (_request, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { message: "Invalid invoice ID format" },
        { status: 400 }
      );
    }
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// PUT /api/invoices/[id]
export const PUT = requireAuth(async (request, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { message: "Invalid invoice ID format" },
        { status: 400 }
      );
    }
    const body = await request.json();

    if (body.invoiceNumber) {
      const existing = await Invoice.findOne({
        invoiceNumber: body.invoiceNumber,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Invoice number already exists" },
          { status: 409 }
        );
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(invoice);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Invoice number already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
});

// DELETE /api/invoices/[id]
export const DELETE = requireAuth(async (_request, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json(
        { message: "Invalid invoice ID format" },
        { status: 400 }
      );
    }
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Invoice deleted successfully",
      id,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
