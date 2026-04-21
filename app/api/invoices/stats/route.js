import { NextResponse } from "next/server";
import connectToDatabase from "@/app/utils/db.js";
import Invoice from "@/app/models/Invoice";
import { requireAuth } from "@/app/utils/requireAuth.js";

export const GET = requireAuth(async () => {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().split("T")[0];

    const [totalStats, monthStats] = await Promise.all([
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: {
              $sum: {
                $cond: [
                  { $ne: ["$totalDue", ""] },
                  { $toDouble: { $ifNull: ["$totalDue", "0"] } },
                  0,
                ],
              },
            },
          },
        },
      ]),
      Invoice.aggregate([
        { $match: { date: { $gte: startOfMonthStr } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: {
              $sum: {
                $cond: [
                  { $ne: ["$totalDue", ""] },
                  { $toDouble: { $ifNull: ["$totalDue", "0"] } },
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      total: totalStats[0]?.count || 0,
      totalAmount: totalStats[0]?.totalAmount || 0,
      thisMonth: monthStats[0]?.count || 0,
      thisMonthAmount: monthStats[0]?.totalAmount || 0,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
