import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

const ALLOWED_FIELDS = [
  "billingContact",
  "fromAddress",
  "companyName",
  "toAddress",
  "phone",
  "phone2",
  "email",
  "payableTo",
  "mailingAddress",
  "nameZelle",
  "phoneZelle",
  "emailZelle",
  "descriptions",
  "includedServices",
  "invoiceNumber",
  "notes",
  "disclaimer",
];

const ARRAY_FIELDS = ["descriptions", "includedServices"];

export const GET = requireAuth(async (request, { params }) => {
  try {
    await connectToDatabase();
    const { field } = params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json({ message: "Invalid field" }, { status: 400 });
    }

    if (ARRAY_FIELDS.includes(field)) {
      const pipeline = [
        { $unwind: `$${field}` },
        {
          $match: {
            [field]: { $exists: true, $nin: [null, ""] },
          },
        },
      ];

      if (query) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        pipeline.push({
          $match: { [field]: { $regex: escapedQuery, $options: "i" } },
        });
      }

      pipeline.push(
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 },
            lastUsed: { $max: "$createdAt" },
          },
        },
        {
          $project: { _id: 0, value: "$_id", count: 1, lastUsed: 1 },
        },
        { $sort: { count: -1, lastUsed: -1 } },
        { $limit: 10 }
      );

      const suggestions = await Invoice.aggregate(pipeline);
      return NextResponse.json(suggestions);
    }

    const pipeline = [
      {
        $match: {
          [field]: { $exists: true, $nin: [null, ""] },
        },
      },
    ];

    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      pipeline.push({
        $match: { [field]: { $regex: escapedQuery, $options: "i" } },
      });
    }

    pipeline.push(
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
          lastUsed: { $max: "$createdAt" },
        },
      },
      {
        $project: { _id: 0, value: "$_id", count: 1, lastUsed: 1 },
      },
      { $sort: { count: -1, lastUsed: -1 } },
      { $limit: 10 }
    );

    const suggestions = await Invoice.aggregate(pipeline);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("[Suggestions] Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
