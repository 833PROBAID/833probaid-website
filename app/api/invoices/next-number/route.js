import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

export const GET = requireAuth(async () => {
  try {
    await connectToDatabase();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const prefix = `INV-${year}${month}-`;

    const lastInvoice = await Invoice.findOne({
      invoiceNumber: { $regex: `^${prefix}` },
    }).sort({ invoiceNumber: -1 });

    let nextNum = 1;
    if (lastInvoice) {
      const lastNum =
        parseInt(lastInvoice.invoiceNumber.replace(prefix, ""), 10) || 0;
      nextNum = lastNum + 1;
    }

    return NextResponse.json({
      nextNumber: `${prefix}${String(nextNum).padStart(3, "0")}`,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
