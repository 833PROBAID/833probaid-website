"use client";

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const TEAL = "#0097A7";
const ORANGE = "#FD7702";
const DARK = "#333333";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#FFFFFF",
  },
  // Header
  header: {
    backgroundColor: TEAL,
    flexDirection: "row",
    alignItems: "stretch",
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  headerLogoArea: {
    backgroundColor: "#FFFFFF",
    width: "38%",
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 28,
    justifyContent: "center",
  },
  headerTitleArea: {
    flex: 1,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginLeft: -22,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  headerTitleText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    textTransform: "uppercase",
    textAlign: "right",
  },
  // Meta row
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
  },
  labelOrange: {
    color: ORANGE,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginRight: 3,
  },
  valueText: {
    color: DARK,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  // Section header bar
  sectionHeader: {
    backgroundColor: TEAL,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    marginTop: 6,
  },
  sectionHeaderText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textTransform: "uppercase",
  },
  // Tags
  tagTeal: {
    backgroundColor: TEAL,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  tagOrange: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  tagText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  tagTextLg: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    textTransform: "uppercase",
  },
  // Body pad
  body: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  // Field rows
  fieldRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  fieldLabel: {
    color: ORANGE,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    width: 108,
    flexShrink: 0,
  },
  fieldValue: {
    flex: 1,
    color: DARK,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  // Contact bar
  contactBar: {
    backgroundColor: TEAL,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 6,
  },
  contactBarText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  contactBarDivider: {
    color: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 11,
  },
  // Bullet items
  bulletItem: {
    color: DARK,
    fontFamily: "Helvetica",
    fontSize: 10,
    marginBottom: 4,
  },
  // Included in Service bar
  includedBar: {
    backgroundColor: TEAL,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginTop: 8,
    marginBottom: 8,
  },
  includedBarText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    textAlign: "center",
  },
  // Fee row
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  feeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  feeLabelText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    textTransform: "uppercase",
    marginRight: 4,
  },
  feeAmountText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
  },
  // Payment Due Upon Receipt
  paymentDueBanner: {
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
    marginBottom: 10,
  },
  paymentDueText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    textTransform: "uppercase",
  },
  // Disclaimer
  disclaimerHeader: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  disclaimerBox: {
    backgroundColor: ORANGE,
    padding: 10,
  },
  disclaimerText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    backgroundColor: TEAL,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  footerText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
});

const fmtDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const fmtAmount = (v) =>
  v !== undefined && v !== null && v !== ""
    ? parseFloat(v).toFixed(2)
    : "0.00";

const InvoicePDF = ({ data, logoUrl, bannerUrl }) => {
  const descriptions = (data.descriptions || []).filter((d) => d?.trim());
  const services = (data.includedServices || []).filter((s) => s?.trim());
  const bannerWidthPct = `${data.bannerWidth || 90}%`;

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLogoArea}>
            <Image src={logoUrl} />
          </View>
          <View style={s.headerTitleArea}>
            <Text style={s.headerTitleText}>
              833PROBAID{"®"} - Invoice
            </Text>
          </View>
        </View>

        {/* ── Invoice Meta ────────────────────────────────────────── */}
        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Text style={s.labelOrange}>Date of Service: </Text>
            <Text style={s.valueText}>{fmtDate(data.serviceDate)}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.labelOrange}>Invoice Date: </Text>
            <Text style={s.valueText}>{fmtDate(data.date)}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.labelOrange}>Invoice #: </Text>
            <Text style={s.valueText}>{data.invoiceNumber || ""}</Text>
          </View>
        </View>

        {/* ── Invoice Info Section ─────────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>
            833PROBAID{"®"} - Invoice
          </Text>
        </View>
        <View style={s.body}>
          {/* FROM */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={s.tagTeal}>
              <Text style={s.tagTextLg}>From</Text>
            </View>
            <View style={s.tagTeal}>
              <Text style={s.tagText}>
                833PROBAID{"®"} Probate Real Estate Services
              </Text>
            </View>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Billing Contact: </Text>
            <Text style={s.fieldValue}>{data.billingContact || ""}</Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Address: </Text>
            <Text style={s.fieldValue}>{data.fromAddress || ""}</Text>
          </View>
        </View>

        {/* ── Contact Bar ─────────────────────────────────────────── */}
        <View style={s.contactBar}>
          <Text style={s.contactBarText}>(833) PROBAID</Text>
          <Text style={s.contactBarDivider}> | </Text>
          <Text style={s.contactBarText}>Info@833probaid.com</Text>
          <Text style={s.contactBarDivider}> | </Text>
          <Text style={s.contactBarText}>www.833probaid.com</Text>
        </View>

        {/* ── TO ──────────────────────────────────────────────────── */}
        <View style={s.body}>
          <View style={[s.tagTeal, { marginBottom: 8 }]}>
            <Text style={s.tagTextLg}>To</Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Name / Company: </Text>
            <Text style={s.fieldValue}>{data.companyName || ""}</Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Address: </Text>
            <Text style={s.fieldValue}>{data.toAddress || ""}</Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Phone: </Text>
            <Text style={s.fieldValue}>
              {data.phone || ""}
              {data.phone2 ? `  |  ${data.phone2}` : ""}
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Email: </Text>
            <Text style={s.fieldValue}>{data.email || ""}</Text>
          </View>
        </View>

        {/* ── Description of Services ─────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Description of Services</Text>
        </View>
        <View style={s.body}>
          {descriptions.map((desc, i) => (
            <Text key={i} style={s.bulletItem}>
              {"•"} {desc}
            </Text>
          ))}

          <View style={s.includedBar}>
            <Text style={s.includedBarText}>Included in Service :</Text>
          </View>
          {services.map((svc, i) => (
            <Text key={i} style={s.bulletItem}>
              {"•"} {svc}
            </Text>
          ))}
        </View>

        {/* ── Service Summary ──────────────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>Service Summary</Text>
        </View>
        <View style={s.body}>
          <View style={s.feeRow}>
            <View style={[s.feeBox, { backgroundColor: TEAL }]}>
              <Text style={s.feeLabelText}>Service Fee: $</Text>
              <Text style={s.feeAmountText}>{fmtAmount(data.serviceFee)}</Text>
            </View>
            <View style={[s.feeBox, { backgroundColor: ORANGE }]}>
              <Text style={s.feeLabelText}>Total Due: $</Text>
              <Text style={s.feeAmountText}>{fmtAmount(data.totalDue)}</Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={s.paymentDueBanner}>
              <Text style={s.paymentDueText}>Payment Due Upon Receipt</Text>
            </View>
          </View>
        </View>

        {/* ── Payment Methods ──────────────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>
            Please Choose One of the Following Payment Methods
          </Text>
        </View>
        <View style={s.body}>
          {/* Check */}
          <View style={[s.tagTeal, { marginBottom: 8 }]}>
            <Text style={s.tagTextLg}>Check</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <View style={[s.tagOrange, { marginRight: 8 }]}>
              <Text style={s.tagText}>Make Checks Payable To:</Text>
            </View>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: 10,
                color: DARK,
              }}
            >
              {data.payableTo || ""}
            </Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Mailing Address: </Text>
            <Text style={s.fieldValue}>{data.mailingAddress || ""}</Text>
          </View>

          {/* Zelle */}
          <View style={[s.tagTeal, { marginTop: 10, marginBottom: 8 }]}>
            <Text style={s.tagTextLg}>Zelle</Text>
          </View>
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>Name: </Text>
            <Text style={s.fieldValue}>{data.nameZelle || ""}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={s.fieldLabel}>Phone: </Text>
              <Text style={s.fieldValue}>{data.phoneZelle || ""}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={s.fieldLabel}>Email: </Text>
              <Text style={s.fieldValue}>{data.emailZelle || ""}</Text>
            </View>
          </View>
        </View>

        {/* ── Optional Banner ──────────────────────────────────────── */}
        {data.includeBanner && bannerUrl && (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <Image src={bannerUrl} style={{ width: bannerWidthPct }} />
          </View>
        )}

        {/* ── Disclaimer ───────────────────────────────────────────── */}
        {data.disclaimer ? (
          <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
            <View style={s.disclaimerHeader}>
              <Text style={s.tagText}>Disclaimer</Text>
            </View>
            <View style={s.disclaimerBox}>
              <Text style={s.disclaimerText}>{data.disclaimer}</Text>
            </View>
          </View>
        ) : null}

        {/* ── Footer ───────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={s.footerText}>(833) PROBAID</Text>
          <Text style={s.contactBarDivider}> | </Text>
          <Text style={s.footerText}>Info@833probaid.com</Text>
          <Text style={s.contactBarDivider}> | </Text>
          <Text style={s.footerText}>www.833probaid.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
