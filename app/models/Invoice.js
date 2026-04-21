import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    serviceDate: { type: Date },
    invoiceNumber: { type: String, required: true, unique: true },
    billingContact: String,
    fromAddress: String,
    companyName: String,
    toAddress: String,
    phone: String,
    phone2: String,
    email: String,
    serviceFee: Number,
    totalDue: Number,
    payableTo: String,
    mailingAddress: String,
    nameZelle: String,
    phoneZelle: String,
    emailZelle: String,
    descriptions: { type: [String], default: [] },
    includedServices: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    dueDate: Date,
    sentDate: Date,
    paidDate: Date,
    notes: String,
    includeBanner: { type: Boolean, default: false },
    bannerWidth: { type: Number, default: 90 },
    disclaimer: {
      type: String,
      default:
        "Please note that this invoice is for services rendered by 833PROBAID®. Payment is due upon receipt of this invoice. Late payments may be subject to additional fees as outlined in our service agreement. If you have any questions regarding this invoice, please contact our billing department at your earliest convenience.",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
