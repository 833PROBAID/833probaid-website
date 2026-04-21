import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

const VALID_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];

export const PATCH = requireAuth(async (request, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status. Must be one of: draft, sent, paid, overdue, cancelled",
        },
        { status: 400 }
      );
    }

    const update = { status };
    const today = new Date().toISOString().split("T")[0];
    if (status === "sent") update.sentDate = today;
    if (status === "paid") update.paidDate = today;

    const invoice = await Invoice.findByIdAndUpdate(id, update, {
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
