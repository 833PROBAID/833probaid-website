import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

// GET /api/invoices - list with filters & pagination
export const GET = requireAuth(async (request) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const skip = (page - 1) * limit;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const filter = {};
    const search = searchParams.get("search");
    if (search) {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [
        { invoiceNumber: searchRegex },
        { billingContact: searchRegex },
        { companyName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { toAddress: searchRegex },
      ];
    }

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const status = searchParams.get("status");
    if (status && status !== "all") filter.status = status;

    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    if (minAmount || maxAmount) {
      const conditions = [];
      if (minAmount) {
        conditions.push({
          $gte: [
            { $toDouble: { $ifNull: ["$totalDue", "0"] } },
            parseFloat(minAmount),
          ],
        });
      }
      if (maxAmount) {
        conditions.push({
          $lte: [
            { $toDouble: { $ifNull: ["$totalDue", "0"] } },
            parseFloat(maxAmount),
          ],
        });
      }
      if (conditions.length === 1) filter.$expr = conditions[0];
      else if (conditions.length === 2) filter.$expr = { $and: conditions };
    }

    const [total, invoices] = await Promise.all([
      Invoice.countDocuments(filter),
      Invoice.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return NextResponse.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalInvoices: total,
      hasMore: skip + invoices.length < total,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// POST /api/invoices - create
export const POST = requireAuth(async (request) => {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { invoiceNumber, date } = body;

    const errors = [];
    if (!invoiceNumber || invoiceNumber.trim() === "")
      errors.push("Invoice number is required");
    if (!date || date.trim() === "") errors.push("Date is required");
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const existing = await Invoice.findOne({ invoiceNumber });
    if (existing) {
      return NextResponse.json(
        { message: "Invoice number already exists" },
        { status: 409 }
      );
    }

    const invoice = new Invoice(body);
    const newInvoice = await invoice.save();
    return NextResponse.json(newInvoice, { status: 201 });
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
