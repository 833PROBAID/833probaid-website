"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { Typography } from "@material-tailwind/react";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import Swal from "sweetalert2";
import {
  DateSelector,
  FormSection,
  TextInput,
  TextArea,
  Checkbox,
} from "./SharedComponents";
import { invoiceAPI } from "../lib/api";
import {
  DEFAULT_INVOICE_NUMBER,
  deriveNextInvoiceNumber,
} from "../utils/invoiceNumber";
import InvoicePDF from "./InvoicePDF";

const INVOICE_FORM_NAV_STATE_KEY = "invoiceFormNavState";
const INVOICE_MANAGEMENT_ROUTE = "/dashboard/invoice-management";

const InvoiceForm = () => {
  const [showDashedBorders, setShowDashedBorders] = useState(false);
  const routeParams = useParams();
  const id = routeParams?.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Shim to emulate react-router `location` object.
  // Navigation `state` in Next.js is carried through sessionStorage under the key
  // "invoiceFormNavState" by the callers (see InvoiceManagement.jsx).
  const navState = useMemo(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem(INVOICE_FORM_NAV_STATE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const locationSearch = useMemo(() => {
    const queryString = searchParams?.toString();
    return queryString ? `?${queryString}` : "";
  }, [searchParams]);

  const location = {
    state: navState,
    search: locationSearch,
    pathname,
  };

  // navigate(path, options) - matches react-router call signature.
  // options.state is stashed in sessionStorage so the next page can read it.
  const navigate = useCallback(
    (path, options = {}) => {
      if (typeof window !== "undefined") {
        try {
          if (options?.state) {
            sessionStorage.setItem(
              INVOICE_FORM_NAV_STATE_KEY,
              JSON.stringify(options.state),
            );
          } else {
            sessionStorage.removeItem(INVOICE_FORM_NAV_STATE_KEY);
          }
        } catch {}
      }
      if (options?.replace) router.replace(path);
      else router.push(path);
    },
    [router],
  );
  const goToInvoiceManagement = useCallback(
    (options = {}) => navigate(INVOICE_MANAGEMENT_ROUTE, options),
    [navigate],
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const printRef = useRef(null);
  const formContainerRef = useRef(null);
  const phoneRef = useRef(null);
  const phone2Ref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(
    location.state?.viewMode !== undefined
      ? location.state.viewMode
      : id && id !== "new",
  );
  const [autoDownload, setAutoDownload] = useState(
    location.state?.autoDownload || false,
  );

  const showModifyParamEnabled = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("showModify") === "true";
  }, [location.search]);

  const prefilledInvoiceNumber = location.state?.prefilledInvoiceNumber;
  const lastInvoiceNumber = location.state?.lastInvoiceNumber;

  const derivedInvoiceNumber = useMemo(() => {
    if (prefilledInvoiceNumber) return prefilledInvoiceNumber;
    if (lastInvoiceNumber) return deriveNextInvoiceNumber(lastInvoiceNumber);
    return DEFAULT_INVOICE_NUMBER;
  }, [prefilledInvoiceNumber, lastInvoiceNumber]);

  const canUseArrayFieldControls = showModifyParamEnabled && !isViewMode;
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    billingContact: "Tigran Mkrtchian",
    fromAddress: "311 N. Robertson Blvd #444 Beverly Hills, CA 90211",
    companyName: "Law Offices of Lisa Fisher ",
    toAddress: "PO Box 91112, Long Beach, CA 90809",
    invoiceNumber: derivedInvoiceNumber,
    phone: "(562) 688-9109",
    phone2: "(562) 965-3267",
    email: "lfisher6736@yahoo.com",
    serviceFee: "850.00",
    totalDue: "850.00",
    payableTo: "Tigran Mkrtchian",
    mailingAddress: "311 N. Robertson Blvd #444 Beverly Hills, CA 90211",
    nameZelle: "Tigran Mkrtchian",
    phoneZelle: "(267) 888-8884",
    emailZelle: "info@833probaid.com",
    notes:
      "THE GREATEST COMPLIMENT we can receive is your REFERRAL of an Estate, Trust, or Conservatorship client in need of Real Estate Guidance and Support.",
    disclaimer:
      "This invoice is issued by 833PROBAID® for services rendered by Tigran Mkrtchian, as outlined above. Payment is respectfully due upon receipt. For any questions regarding this invoice or services provided, please contact our office at your earliest convenience. No legal or tax advice is provided or implied. All services are strictly real estate related. Clients should consult their attorney or tax professional for legal or financial matters.",
    serviceDate: new Date().toISOString().split("T")[0],
    descriptions: [
      "Subject Property: 419 N. Howard St. Glendale, CA 91206",
      "Professional Interior Valuation Walk-Through and As-Is Market Analysis.",
      "Valuation Provided to Assist GAL in Property-Related Case Review and Stipulation Purposes.",
    ],
    includedServices: [
      "Comprehensive On-Site Interior and Exterior Walk-Through",
      "Identification of Visible Deferred Maintenance and Risk Factors",
      "Customized Valuation Adjustments with Supporting Breakdown",
      "As-Is Valuation Summary for Guidance",
      "Findings Communicated to Attorney Lisa Fisher (GAL) and Family for Informed Next Steps ",
      "",
    ],
    includeBanner: true,
    bannerWidth: 55,
  });

  const [suggestions, setSuggestions] = useState({
    billingContact: [],
    fromAddress: [],
    companyName: [],
    toAddress: [],
    phone: [],
    phone2: [],
    email: [],
    payableTo: [],
    mailingAddress: [],
    nameZelle: [],
    phoneZelle: [],
    emailZelle: [],
    descriptions: [],
    includedServices: [],
    invoiceNumber: [],
    notes: [],
    disclaimer: [],
  });

  // Track loading state for each suggestion field
  const [loadingSuggestions, setLoadingSuggestions] = useState({});

  // Track which field is currently active for showing suggestions
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);

  // Debounce timeout refs for each field
  const suggestionTimeoutRefs = useRef({});

  // Fetch suggestions from API with search query (debounced)
  const searchSuggestions = useCallback(async (field, query) => {
    // Clear existing timeout for this field
    if (suggestionTimeoutRefs.current[field]) {
      clearTimeout(suggestionTimeoutRefs.current[field]);
    }

    // Set loading state
    setLoadingSuggestions((prev) => ({ ...prev, [field]: true }));

    // Debounce the API call
    suggestionTimeoutRefs.current[field] = setTimeout(async () => {
      try {
        const data = await invoiceAPI.getSuggestions(field, query);
        setSuggestions((prev) => ({ ...prev, [field]: data || [] }));
      } catch (error) {
        console.error(`Error fetching suggestions for ${field}:`, error);
      } finally {
        setLoadingSuggestions((prev) => ({ ...prev, [field]: false }));
      }
    }, 3000); //3 second debounce
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeoutRefs = suggestionTimeoutRefs.current;
    return () => {
      Object.values(timeoutRefs).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Load invoice data if editing
  useEffect(() => {
    let isCancelled = false;

    const loadInvoice = async () => {
      if (id && id !== "new") {
        setIsLoading(true);
        try {
          const invoice = await invoiceAPI.getById(id);
          if (isCancelled) return;

          // Migrate old format to new array format if needed
          const migratedInvoice = { ...invoice };

          // Migrate descriptions
          if (
            !invoice.descriptions &&
            (invoice.description1 ||
              invoice.description2 ||
              invoice.description3)
          ) {
            migratedInvoice.descriptions = [
              invoice.description1,
              invoice.description2,
              invoice.description3,
            ].filter((d) => d && d.trim());
          }

          // Migrate includedServices
          if (
            !invoice.includedServices &&
            (invoice.includedService1 ||
              invoice.includedService2 ||
              invoice.includedService3 ||
              invoice.includedService4 ||
              invoice.includedService5)
          ) {
            migratedInvoice.includedServices = [
              invoice.includedService1,
              invoice.includedService2,
              invoice.includedService3,
              invoice.includedService4,
              invoice.includedService5,
            ].filter((s) => s && s.trim());
          }

          // Ensure arrays exist
          if (!migratedInvoice.descriptions)
            migratedInvoice.descriptions = [""];
          if (!migratedInvoice.includedServices)
            migratedInvoice.includedServices = [""];

          setFormData(migratedInvoice);
        } catch (error) {
          if (isCancelled) return;
          console.error("Error loading invoice:", error);
          Swal.fire("Error", error.message || "Invoice not found", "error");
          goToInvoiceManagement({ replace: true });
        } finally {
          if (isCancelled) return;
          setIsLoading(false);
        }
      } else if (id === "new") {
        setFormData((prev) => ({
          ...prev,
          invoiceNumber: derivedInvoiceNumber,
          descriptions: [""],
          includedServices: [""],
        }));
      }
    };
    loadInvoice();
    return () => {
      isCancelled = true;
    };
  }, [id, goToInvoiceManagement, derivedInvoiceNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateFieldChange = useCallback((fieldName, date) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date ? date.toISOString().split("T")[0] : "",
    }));
  }, []);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const parts = [];
    if (match[1]) parts.push(`(${match[1]}`);
    if (match[2]) parts.push(`) ${match[2]}`);
    if (match[3]) parts.push(`-${match[3]}`);
    return parts.join("");
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, "");

    // Limit to 10 digits max
    if (cleaned.length > 10) return;

    const formatted = formatPhoneNumber(value);
    setFormData((prev) => ({ ...prev, [name]: formatted }));

    // Auto-focus to phone2 when phone is complete (10 digits)
    if (name === "phone" && cleaned.length === 10 && phone2Ref.current) {
      setTimeout(() => {
        phone2Ref.current?.focus();
      }, 0);
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (fieldName, index, value) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  };

  // Add new item to array field
  const addArrayItem = (fieldName) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      return { ...prev, [fieldName]: [...currentArray, ""] };
    });
  };

  // Remove item from array field
  const removeArrayItem = (fieldName, index) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      const newArray = currentArray.filter((_, i) => i !== index);
      return { ...prev, [fieldName]: newArray };
    });
  };

  const handleCancel = () => {
    goToInvoiceManagement();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.invoiceNumber || !formData.invoiceNumber.trim()) {
      Swal.fire("Validation Error", "Invoice number is required", "warning");
      return;
    }
    if (!formData.date) {
      Swal.fire("Validation Error", "Invoice Date is required", "warning");
      return;
    }

    setIsSaving(true);
    try {
      if (id && id !== "new") {
        await invoiceAPI.update(id, formData);
        Swal.fire("Success!", "Invoice updated successfully.", "success");
      } else {
        await invoiceAPI.create(formData);
        Swal.fire("Success!", "Invoice created successfully.", "success");
      }
      goToInvoiceManagement();
    } catch (error) {
      console.error("Error saving invoice:", error);
      const message =
        error.status === 409
          ? "Invoice number already exists. Please use a different number."
          : error.message || "Failed to save invoice. Please try again.";
      Swal.fire("Error", message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.25));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };



  const handleDownloadPdf = async () => {
    Swal.fire({
      title: "Generating PDF...",
      text: "Please wait while we prepare your invoice",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const logoUrl = `${window.location.origin}/833PROBAID-logo.png`;
      const bannerUrl = `${window.location.origin}/banner2.png`;
      const blob = await pdf(
        <InvoicePDF data={formData} logoUrl={logoUrl} bannerUrl={bannerUrl} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice_${formData.invoiceNumber || Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      await Swal.fire({
        icon: "success",
        title: "Downloaded!",
        html: `<div>Invoice <strong>Invoice_${formData.invoiceNumber || Date.now()}.pdf</strong> downloaded.</div>`,
        confirmButtonColor: "#0097A7",
        timer: 3000,
        timerProgressBar: true,
      });
      if (autoDownload) {
        goToInvoiceManagement();
      }
    } catch (err) {
      console.error("[PDF] Error generating PDF:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to generate PDF. Please try again.",
        confirmButtonColor: "#0097A7",
      });
    }
  };

  const handleFitToScreen = () => {
    if (formContainerRef.current && printRef.current) {
      const containerWidth = formContainerRef.current.offsetWidth;
      const contentWidth = printRef.current.offsetWidth;
      const newZoom = Math.min(containerWidth / contentWidth, 1);
      setZoomLevel(newZoom);
    }
  };

  useEffect(() => {
    handleFitToScreen();
    window.addEventListener("resize", handleFitToScreen);
    return () => window.removeEventListener("resize", handleFitToScreen);
  }, []);

  // Add keyboard shortcut for PDF download (Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        if (id && id !== "new") {
          handleDownloadPdf();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, formData]);

  // Auto-download PDF when autoDownload is true and invoice is loaded
  useEffect(() => {
    if (autoDownload && !isLoading && formData.invoiceNumber) {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        handleDownloadPdf();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoDownload, isLoading, formData.invoiceNumber]);

  const renderLabel = (text) => {
    const colonColor = "#0097A7"; // teal for separators
    const textColor = "#FD7702"; // orange for main text
    if (!text?.includes(":") && !text?.includes("/")) {
      return (
        <span className="font-bold min-w-max" style={{ color: textColor }}>
          {text}
        </span>
      );
    }

    return text.split(/(:|\/)/).map((part, index) => {
      if (part === ":" || part === "/") {
        return (
          <span
            key={index}
            className="font-bold text-xl"
            style={{ color: colonColor }}
          >
            {part}
          </span>
        );
      }
      return (
        <span
          key={index}
          className="font-bold min-w-max"
          style={{ color: textColor }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="p-3">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-[100] flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#0097A7] mb-4"></i>
            <p className="text-lg font-semibold text-gray-700">
              Loading invoice...
            </p>
          </div>
        </div>
      )}
      <style>{`
				* {
					font-family: "Poppins", sans-serif;
				}
				.form-canvas input:disabled,
				.form-canvas textarea:disabled,
				.form-canvas select:disabled {
					opacity: 1 !important;
					cursor: not-allowed;
				}
			`}</style>
      <div className="w-full" ref={formContainerRef}>
        {/* Mode Toggle and Zoom Controls */}
        <div className="sticky top-4 z-50 mb-4">
          {/* Back Button - Always visible */}
          <div className="flex justify-start mb-3">
            <button
              onClick={() => goToInvoiceManagement()}
              className="bg-gray-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm sm:text-base sm:px-4 sm:py-2"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="hidden sm:inline">Back to Invoice List</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>

          {/* Main Controls */}
          <div className="flex flex-col lg:flex-row gap-3 justify-center">
            {/* Left Section - Mode Toggle and PDF Download */}
            <div className="flex flex-col sm:flex-row gap-3 jsuttify-center items-center">
              {id && id !== "new" && (
                <div className="bg-white border-2 border-[#0097A7] rounded-lg shadow-lg px-3 py-2 sm:px-4">
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-3">
                    <span
                      className={`font-bold text-xs sm:text-sm ${
                        !isViewMode ? "text-[#0097A7]" : "text-gray-400"
                      }`}
                    >
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isViewMode}
                        onChange={(e) => setIsViewMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0097A7]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#0097A7]"></div>
                    </label>
                    <span
                      className={`font-bold text-xs sm:text-sm ${
                        isViewMode ? "text-[#0097A7]" : "text-gray-400"
                      }`}
                    >
                      <i className="fas fa-eye mr-1"></i>
                      View
                    </span>
                  </div>
                </div>
              )}

              {id && id !== "new" && isViewMode && (
                <div className="flex flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="bg-[#0097A7] text-white font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-[#007A87] transition-colors text-sm sm:text-base"
                  >
                    <i className="fas fa-download mr-1 sm:mr-2"></i>
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </button>
                  <Checkbox
                    type="checkbox"
                    checked={showDashedBorders}
                    onChange={(e) => setShowDashedBorders(e.target.checked)}
                    className="mr-1 accent-[#FD7702]"
                    style={{ width: 16, height: 16 }}
                    label="Page Guides"
                  />
                </div>
              )}
            </div>

            {/* Right Section - Zoom Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              {!isViewMode && (
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Checkbox
                    type="checkbox"
                    checked={showDashedBorders}
                    onChange={(e) => setShowDashedBorders(e.target.checked)}
                    className="mr-1 accent-[#FD7702]"
                    style={{ width: 16, height: 16 }}
                    label="Page Guides"
                  />
                </div>
              )}

              <div className="bg-white border-2 border-[#0097A7] rounded-lg shadow-lg px-3 py-2 sm:px-4 flex items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.25}
                  className="px-2 py-1 sm:px-3 bg-[#0097A7] text-white rounded hover:bg-[#007A87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  title="Zoom Out"
                >
                  <i className="fas fa-search-minus"></i>
                </button>
                <span className="text-xs sm:text-sm font-semibold text-[#0097A7] min-w-[50px] sm:min-w-[60px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2}
                  className="px-2 py-1 sm:px-3 bg-[#0097A7] text-white rounded hover:bg-[#007A87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  title="Zoom In"
                >
                  <i className="fas fa-search-plus"></i>
                </button>
                <div className="w-px h-4 sm:h-6 bg-gray-300 hidden sm:block"></div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={handleFitToScreen}
                    className="px-2 py-1 sm:px-3 bg-[#FD7702] text-white rounded hover:bg-[#E56902] transition-colors text-sm"
                    title="Fit to Screen"
                  >
                    <i className="fas fa-compress-alt"></i>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 sm:px-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                    title="Reset Zoom (100%)"
                  >
                    <i className="fas fa-undo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="large-div" style={{ overflow: "hidden", width: "100%" }}>
        <div
          ref={printRef}
          className="large-div-content"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
            marginBottom:
              printRef.current && zoomLevel < 1
                ? `${printRef.current.offsetHeight * (zoomLevel - 1)}px`
                : 0,
          }}
        >
          <div
            className="flex items-center justify-center w-full"
            id="printable-content"
          >
            <div
              className="w-full bg-white border border-gray-200 shadow-md form-canvas"
              style={{ margin: "0 auto" }}
            >
              {/* page header */}
              <div className="w-full bg-[#0097A7]" data-pdf-header="true">
                <div className="grid grid-cols-7 justify-center items-stretch py-6">
                  <div className="col-span-3 bg-white pr-12 py-2 pl-4 flex items-center">
                    <img
                      src="/833PROBAID-logo.png"
                      alt=""
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="bg-[#FD7702] -ml-9 border-[21px] border-r-0 border-[#0097A7] text-white px-6 py-4 font-bold text-[3.5rem] uppercase col-span-4 rounded-l-full flex items-center justify-end">
                    833PROBAID<sup>®</sup>- Invoice
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                className="my-4 px-2 mr-2.5 ml-5"
              >
                <div className={`relative`}>
                  {showDashedBorders ? (
                    <>
                      <div className="absolute left-[0.65rem] top-10 bottom-0 w-[6px] h-[347mm] bg-[#FD7702]"></div>
                      <div className="absolute left-[0.65rem] top-[470mm] bottom-0 w-[6px] h-[347mm] bg-[#FD7702]"></div>
                    </>
                  ) : (
                    <div className="absolute left-[0.65rem] top-10 bottom-0 w-[6px] bg-[#FD7702]"></div>
                  )}
                  <FormSection
                    title="833PROBAID® - Invoice"
                    icon="fa-file-invoice"
                  >
                    <div className="space-y-3.5">
                      <div className="flex justify-end gap-4">
                        <DateSelector
                          name="serviceDate"
                          label={renderLabel("Date of Service :")}
                          selected={
                            formData.serviceDate
                              ? new Date(formData.serviceDate)
                              : null
                          }
                          onChange={(date) => handleDateFieldChange("serviceDate", date)}
                          width="317px"
                          disabled={isViewMode}
                          variant="invoice"
                        />
                        <DateSelector
                          name="date"
                          label={renderLabel("Invoice Date :")}
                          selected={
                            formData.date ? new Date(formData.date) : null
                          }
                          onChange={(date) => handleDateFieldChange("date", date)}
                          width="295px"
                          disabled={isViewMode}
                          variant="invoice"
                        />
                        <TextInput
                          name="invoiceNumber"
                          label={renderLabel("Invoice # :")}
                          value={formData.invoiceNumber}
                          onChange={handleChange}
                          width="267px"
                          placeholder="e.g., INV-1024"
                          disabled={isViewMode}
                          variant="invoice"
                          suggestions={suggestions.invoiceNumber}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={
                            loadingSuggestions.invoiceNumber
                          }
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              invoiceNumber: value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-row justify-between items-center my-3.5 gap-0">
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorTeal text-white w-max px-2 py-1 uppercase"
                        >
                          From
                        </Typography>
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorTeal text-white w-max px-2.5 py-1 uppercase"
                        >
                          833PROBAID<sup>®</sup> Probate Real Estate Services
                        </Typography>
                      </div>

                      <div className="grid grid-cols-1 gap-3.5">
                        <TextInput
                          name="billingContact"
                          label={renderLabel("Billing Contact :")}
                          value={formData.billingContact}
                          onChange={handleChange}
                          width="full"
                          disabled={isViewMode}
                          suggestions={suggestions.billingContact}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={
                            loadingSuggestions.billingContact
                          }
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              billingContact: value,
                            }))
                          }
                          variant="invoice"
                        />
                        <TextInput
                          name="fromAddress"
                          label={renderLabel("Address :")}
                          value={formData.fromAddress}
                          onChange={handleChange}
                          width="full"
                          disabled={isViewMode}
                          suggestions={suggestions.fromAddress}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.fromAddress}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              fromAddress: value,
                            }))
                          }
                          variant="invoice"
                        />
                      </div>
                      <div className="bg-[#0097A7] text-white py-2 mt-3.5">
                        <div className="flex gap-3 justify-evenly text-2xl font-bold">
                          {/* Phone Section */}
                          <a
                            href="tel:8337762243"
                            className="flex items-center hover:text-[#FD7702] group text-center -ml-5"
                          >
                            <i className="fas fa-phone-volume text-4xl text-[#FD7702] group-hover:text-white mr-3"></i>
                            <div className="flex flex-col items-end leading-tight">
                              <div className="tracking-wide">(833) PROBAID</div>
                              <div className="tracking-wider lowercase -mt-1 w-max ml-px text-[27px]">
                                7762243
                              </div>
                            </div>
                          </a>
                          <div className="border-r-2 border-white"></div>

                          {/* Email Section */}
                          <a
                            href="mailto:Info@833probaid.com"
                            className="flex items-center border-white group"
                          >
                            <i className="fas fa-envelope text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                            <span>
                              <span className="text-black group-hover:text-white">
                                Info@
                              </span>
                              <span className="text-white group-hover:text-black">
                                833probaid
                              </span>
                              <span className="text-black group-hover:text-white">
                                .com
                              </span>
                            </span>
                          </a>

                          <div className="border-r-2 border-white"></div>
                          {/* Website Section */}
                          <a
                            href="https://www.833probaid.com"
                            className="flex items-center group"
                          >
                            <i className="fas fa-globe text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                            <span>
                              <span className="text-black group-hover:text-white">
                                www.
                              </span>
                              <span className="text-white group-hover:text-black">
                                833probaid
                              </span>
                              <span className="text-black group-hover:text-white">
                                .com
                              </span>
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="mt-3.5">
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorTeal text-white w-max px-2 py-1 uppercase"
                        >
                          To
                        </Typography>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        <TextInput
                          name="companyName"
                          label={renderLabel("Name / Company :")}
                          value={formData.companyName}
                          onChange={handleChange}
                          width="full"
                          placeholder="Client or organization name"
                          disabled={isViewMode}
                          suggestions={suggestions.companyName}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.companyName}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              companyName: value,
                            }))
                          }
                          variant="invoice"
                        />
                        <TextInput
                          name="toAddress"
                          label={renderLabel("Address :")}
                          value={formData.toAddress}
                          onChange={handleChange}
                          width="full"
                          placeholder="Street, City, State, ZIP"
                          disabled={isViewMode}
                          suggestions={suggestions.toAddress}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.toAddress}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              toAddress: value,
                            }))
                          }
                          variant="invoice"
                        />
                      </div>

                      <div className="flex gap-3.5 mt-3.5">
                        <div className="flex gap-3.5">
                          <TextInput
                            ref={phoneRef}
                            name="phone"
                            width="w-[280px]"
                            label={renderLabel("Phone :")}
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="(123) 456-7890"
                            disabled={isViewMode}
                            suggestions={suggestions.phone}
                            showSuggestions={!isViewMode}
                            onSearchSuggestions={searchSuggestions}
                            isLoadingSuggestions={loadingSuggestions.phone}
                            onSuggestionClick={(value) =>
                              setFormData((prev) => ({ ...prev, phone: value }))
                            }
                            variant="invoice"
                          />
                          <TextInput
                            ref={phone2Ref}
                            width="w-[205px]"
                            name="phone2"
                            value={formData.phone2}
                            onChange={handlePhoneChange}
                            placeholder="(123) 456-7890"
                            disabled={isViewMode}
                            suggestions={suggestions.phone2}
                            showSuggestions={!isViewMode}
                            onSearchSuggestions={searchSuggestions}
                            isLoadingSuggestions={loadingSuggestions.phone2}
                            onSuggestionClick={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone2: value,
                              }))
                            }
                            variant="invoice"
                          />
                        </div>
                        <TextInput
                          name="email"
                          label={renderLabel("Email :")}
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          width="full"
                          placeholder="name@example.com"
                          disabled={isViewMode}
                          suggestions={suggestions.email}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.email}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({ ...prev, email: value }))
                          }
                          variant="invoice"
                        />
                      </div>
                    </div>
                  </FormSection>
                  <FormSection
                    title="Description of Services"
                    icon="fa-clipboard-list"
                  >
                    <div className="space-y-3.5">
                      {(formData.descriptions || [""]).map(
                        (description, index) => {
                          // If in view mode and description is empty or just whitespace, show empty space
                          if (
                            isViewMode &&
                            (!description || !description.trim())
                          ) {
                            return (
                              <div
                                key={index}
                                className="h-3 flex items-center"
                              >
                                {/* Empty space to maintain layout */}
                              </div>
                            );
                          } // shoow a normal input if its edit mode and service is empty
                          else if (!description || !description.trim()) {
                            return (
                              <div
                                key={index}
                                className="flex justify-center gap-2"
                              >
                                <div
                                  type="text"
                                  name={`descriptions-${index}`}
                                  /* onClick={() =>
																		handleArrayFieldChange(
																			"descriptions",
																			index,
																			"Insert You Text",
																		)
																	} */
                                  className="h-3 flex items-center w-full  cursor-text"
                                ></div>
                                {canUseArrayFieldControls && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addArrayItem("descriptions")
                                      }
                                      className="h-3 text-[#0097A7]"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem("descriptions", index)
                                      }
                                      className="h-3 text-[#FD7702]"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <TextInput
                                name={`descriptions-${index}`}
                                value={description}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "descriptions",
                                    index,
                                    e.target.value,
                                  )
                                }
                                width="full"
                                disabled={isViewMode}
                                suggestions={suggestions.descriptions}
                                showSuggestions={
                                  !isViewMode &&
                                  activeSuggestionField ===
                                    `descriptions-${index}`
                                }
                                onSearchSuggestions={(field, query) => {
                                  setActiveSuggestionField(
                                    `descriptions-${index}`,
                                  );
                                  searchSuggestions("descriptions", query);
                                }}
                                onFocus={() => {
                                  setActiveSuggestionField(
                                    `descriptions-${index}`,
                                  );
                                  if (description) {
                                    searchSuggestions(
                                      "descriptions",
                                      description,
                                    );
                                  } else {
                                    searchSuggestions("descriptions", "");
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(
                                    () => setActiveSuggestionField(null),
                                    200,
                                  );
                                }}
                                isLoadingSuggestions={
                                  loadingSuggestions.descriptions
                                }
                                onSuggestionClick={(value) => {
                                  handleArrayFieldChange(
                                    "descriptions",
                                    index,
                                    value,
                                  );
                                  setActiveSuggestionField(null);
                                }}
                                variant="invoice"
                              />
                              {canUseArrayFieldControls && (
                                <>
                                  {index ===
                                    (formData.descriptions || [""]).length -
                                      1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addArrayItem("descriptions")
                                      }
                                      className="px-3 py-2 bg-[#0097A7] text-white rounded hover:bg-[#007a87] transition-colors"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>
                                  )}
                                  {(formData.descriptions || [""]).length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem("descriptions", index)
                                      }
                                      className="px-3 py-2 bg-[#FD7702] text-white rounded hover:bg-[#e66902] transition-colors"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        },
                      )}
                      <div className="flex justify-center items-center px-2 py-0.5 w-full bg-colorTeal">
                        <Typography
                          variant="h3"
                          className="text-center font-semibold text-white uppercase"
                        >
                          Included In Service
                        </Typography>
                        <div className="text-white text-4xl font-semibold ml-1.5 mb-1.5">
                          :
                        </div>
                      </div>
                      {(formData.includedServices || [""]).map(
                        (service, index) => {
                          // If in view mode and service is empty or just whitespace, show empty space
                          if (isViewMode && (!service || !service.trim())) {
                            return (
                              <div
                                key={index}
                                className="h-3 flex items-center"
                              >
                                {/* Empty space to maintain layout */}
                              </div>
                            );
                          }
                          // shoow a normal input if its edit mode and service is empty
                          else if (!service || !service.trim()) {
                            return (
                              <div
                                key={index}
                                className="flex justify-center gap-2"
                              >
                                <div
                                  type="text"
                                  name={`includedServices-${index}`}
                                  /* onClick={() =>
																		handleArrayFieldChange(
																			"includedServices",
																			index,
																			"Insert You Text",
																		)
																	} */
                                  className="h-3 flex items-center w-full  cursor-text"
                                ></div>
                                {canUseArrayFieldControls && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addArrayItem("includedServices")
                                      }
                                      className="h-3 text-[#0097A7]"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem(
                                          "includedServices",
                                          index,
                                        )
                                      }
                                      className="h-3 text-[#FD7702]"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <TextInput
                                name={`includedServices-${index}`}
                                value={service}
                                onChange={(e) =>
                                  handleArrayFieldChange(
                                    "includedServices",
                                    index,
                                    e.target.value,
                                  )
                                }
                                width="full"
                                disabled={isViewMode}
                                suggestions={suggestions.includedServices}
                                showSuggestions={
                                  !isViewMode &&
                                  activeSuggestionField ===
                                    `includedServices-${index}`
                                }
                                onSearchSuggestions={(field, query) => {
                                  setActiveSuggestionField(
                                    `includedServices-${index}`,
                                  );
                                  searchSuggestions("includedServices", query);
                                }}
                                onFocus={() => {
                                  setActiveSuggestionField(
                                    `includedServices-${index}`,
                                  );
                                  if (service) {
                                    searchSuggestions(
                                      "includedServices",
                                      service,
                                    );
                                  } else {
                                    searchSuggestions("includedServices", "");
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(
                                    () => setActiveSuggestionField(null),
                                    200,
                                  );
                                }}
                                isLoadingSuggestions={
                                  loadingSuggestions.includedServices
                                }
                                onSuggestionClick={(value) => {
                                  handleArrayFieldChange(
                                    "includedServices",
                                    index,
                                    value,
                                  );
                                  setActiveSuggestionField(null);
                                }}
                                variant="invoice"
                              />
                              {canUseArrayFieldControls && (
                                <>
                                  {index ===
                                    (formData.includedServices || [""]).length -
                                      1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addArrayItem("includedServices")
                                      }
                                      className="px-3 py-2 bg-[#0097A7] text-white rounded hover:bg-[#007a87] transition-colors"
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>
                                  )}
                                  {(formData.includedServices || [""]).length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem(
                                          "includedServices",
                                          index,
                                        )
                                      }
                                      className="px-3 py-2 bg-[#FD7702] text-white rounded hover:bg-[#e66902] transition-colors"
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </FormSection>
                  {/* Page Break Contact Information - Shows only when Page Guides enabled */}
                  {showDashedBorders && (
                    <>
                      <div className="bg-[#0097A7] text-white py-3 px-8 relative z-30 ml-[0.65rem]">
                        <div className="flex gap-3 justify-evenly text-2xl font-bold relative">
                          {/* Page number */}
                          <div
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white font-bold text-5xl"
                            data-hide-in-pdf="true"
                          >
                            1
                          </div>
                          {/* Phone Section */}
                          <a
                            href="tel:8337762243"
                            className="flex items-center hover:text-[#FD7702] group text-center"
                          >
                            <i className="fas fa-phone-volume text-4xl text-[#FD7702] group-hover:text-white mr-3"></i>
                            <div className="flex flex-col items-end leading-tight">
                              <div className="tracking-wide">(833) PROBAID</div>
                              <div className="tracking-wider lowercase -mt-1 w-max ml-px text-[27px]">
                                7762243
                              </div>
                            </div>
                          </a>
                          <div className="border-r-2 border-white"></div>

                          {/* Email Section */}
                          <a
                            href="mailto:Info@833probaid.com"
                            className="flex items-center border-white group"
                          >
                            <i className="fas fa-envelope text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                            <span>
                              <span className="text-black group-hover:text-white">
                                Info@
                              </span>
                              <span className="text-white group-hover:text-black">
                                833probaid
                              </span>
                              <span className="text-black group-hover:text-white">
                                .com
                              </span>
                            </span>
                          </a>

                          <div className="border-r-2 border-white"></div>
                          {/* Website Section */}
                          <a
                            href="https://www.833probaid.com"
                            className="flex items-center group"
                          >
                            <i className="fas fa-globe text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                            <span>
                              <span className="text-black group-hover:text-white">
                                www.
                              </span>
                              <span className="text-white group-hover:text-black">
                                833probaid
                              </span>
                              <span className="text-black group-hover:text-white">
                                .com
                              </span>
                            </span>
                          </a>
                        </div>
                      </div>

                      {/* Page Header */}
                      <div className="w-[103.9%] bg-[#0097A7] relative z-30 mt-4 mb-4 -ml-7">
                        <div className="grid grid-cols-7 justify-center items-stretch py-8">
                          <div className="col-span-3 bg-white pr-12 py-2 pl-4 flex items-center">
                            <img
                              src="/833PROBAID-logo.png"
                              alt=""
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="bg-[#FD7702] -ml-9 border-[21px] border-r-0 border-[#0097A7] text-white px-6 py-4 font-bold text-[3.4rem] uppercase col-span-4 rounded-l-full flex items-center justify-end">
                            833PROBAID® - Invoice
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <FormSection title="Service Summary" icon="fa-calculator">
                    <div className="space-y-3.5">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2 bg-colorTeal text-white px-2 py-1">
                          <div className="flex justify-center items-center px-2 py-1 w-full bg-colorTeal">
                            <Typography
                              variant="h3"
                              className="text-center font-semibold text-white uppercase"
                            >
                              Service Fee
                            </Typography>
                            <div className="text-white text-4xl font-semibold ml-1.5 mb-1.5">
                              :
                            </div>
                            <Typography
                              variant="h3"
                              className="text-center font-semibold text-white uppercase ml-1.5 -mr-2"
                            >
                              $
                            </Typography>
                          </div>
                          {isViewMode ? (
                            <Typography
                              variant="h3"
                              className="font-bold uppercase"
                            >
                              {parseFloat(formData.serviceFee).toFixed(2) ||
                                "0.00"}
                            </Typography>
                          ) : (
                            <input
                              type="number"
                              name="serviceFee"
                              value={formData.serviceFee}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  serviceFee: e.target.value,
                                  totalDue: e.target.value,
                                }))
                              }
                              onBlur={(e) => {
                                const numValue = parseFloat(e.target.value);
                                const formatted =
                                  !isNaN(numValue) && e.target.value !== ""
                                    ? numValue.toFixed(2)
                                    : "";
                                setFormData((prev) => ({
                                  ...prev,
                                  serviceFee: formatted,
                                  totalDue: formatted,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const numValue = parseFloat(e.target.value);
                                  const formatted =
                                    !isNaN(numValue) && e.target.value !== ""
                                      ? numValue.toFixed(2)
                                      : "";
                                  setFormData((prev) => ({
                                    ...prev,
                                    serviceFee: formatted,
                                    totalDue: formatted,
                                  }));
                                }
                              }}
                              placeholder="0.00"
                              className="w-32 px-2 py-1 border-2 border-white bg-white text-colorTeal font-bold text-center focus:outline-none focus:ring-2 focus:ring-colorOrange text-2xl"
                              step="0.01"
                              min="0"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 bg-colorOrange text-white px-2 py-1">
                          <div className="flex justify-center items-center px-2 py-1 w-full bg-colorOrange">
                            <Typography
                              variant="h3"
                              className="text-center font-semibold text-white uppercase"
                            >
                              Total Due
                            </Typography>
                            <div className="text-white text-4xl font-semibold ml-1.5 mb-1.5">
                              :
                            </div>
                            <Typography
                              variant="h3"
                              className="text-center font-semibold text-white uppercase ml-1.5 -mr-2"
                            >
                              $
                            </Typography>
                          </div>
                          {isViewMode ? (
                            <Typography
                              variant="h3"
                              className="font-bold uppercase"
                            >
                              {parseFloat(formData.totalDue).toFixed(2) ||
                                "0.00"}
                            </Typography>
                          ) : (
                            <input
                              type="number"
                              name="totalDue"
                              value={formData.totalDue}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  totalDue: e.target.value,
                                }))
                              }
                              onBlur={(e) => {
                                const numValue = parseFloat(e.target.value);
                                const formatted =
                                  !isNaN(numValue) && e.target.value !== ""
                                    ? numValue.toFixed(2)
                                    : "";
                                setFormData((prev) => ({
                                  ...prev,
                                  totalDue: formatted,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const numValue = parseFloat(e.target.value);
                                  const formatted =
                                    !isNaN(numValue) && e.target.value !== ""
                                      ? numValue.toFixed(2)
                                      : "";
                                  setFormData((prev) => ({
                                    ...prev,
                                    totalDue: formatted,
                                  }));
                                }
                              }}
                              placeholder="0.00"
                              className="w-32 px-2 py-1 border-2 border-white bg-white text-colorOrange font-bold text-center focus:outline-none focus:ring-2 focus:ring-colorTeal text-2xl"
                              step="0.01"
                              min="0"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorOrange text-white px-2 py-1 uppercase w-max"
                        >
                          Payment Due Upon Receipt
                        </Typography>
                      </div>
                    </div>
                  </FormSection>
                  <FormSection
                    title="Please Choose One Of The Following Payment Method"
                    icon="fa-credit-card"
                    data-section="payment-method"
                  >
                    <div className="space-y-3.5">
                      <div className="mb-3">
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorTeal text-white w-max px-2 py-1 uppercase"
                        >
                          Check
                        </Typography>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <div className="w-auto">
                          <Typography
                            variant="h5"
                            className="font-semibold bg-colorOrange text-white w-max px-2 py-1 uppercase"
                          >
                            Make Checks Payable To :
                          </Typography>
                        </div>
                        <TextInput
                          name="payableTo"
                          value={formData.payableTo}
                          onChange={handleChange}
                          width="full"
                          disabled={isViewMode}
                          suggestions={suggestions.payableTo}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.payableTo}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              payableTo: value,
                            }))
                          }
                          variant="invoice"
                        />
                      </div>
                      <TextInput
                        name="mailingAddress"
                        value={formData.mailingAddress}
                        onChange={handleChange}
                        width="full"
                        label={renderLabel("Mailing Address :")}
                        disabled={isViewMode}
                        suggestions={suggestions.mailingAddress}
                        showSuggestions={!isViewMode}
                        onSearchSuggestions={searchSuggestions}
                        isLoadingSuggestions={loadingSuggestions.mailingAddress}
                        onSuggestionClick={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            mailingAddress: value,
                          }))
                        }
                        variant="invoice"
                      />
                      <div>
                        <Typography
                          variant="h3"
                          className="font-semibold bg-colorTeal text-white w-max px-2 py-1 uppercase"
                        >
                          ZELLE
                        </Typography>
                      </div>
                      <TextInput
                        name="nameZelle"
                        label={renderLabel("Name :")}
                        value={formData.nameZelle}
                        onChange={handleChange}
                        width="full"
                        placeholder="Full name for Zelle"
                        disabled={isViewMode}
                        suggestions={suggestions.nameZelle}
                        showSuggestions={!isViewMode}
                        onSearchSuggestions={searchSuggestions}
                        isLoadingSuggestions={loadingSuggestions.nameZelle}
                        onSuggestionClick={(value) =>
                          setFormData((prev) => ({ ...prev, nameZelle: value }))
                        }
                        variant="invoice"
                      />
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <TextInput
                          name="phoneZelle"
                          label={renderLabel("Phone:")}
                          value={formData.phoneZelle}
                          onChange={handlePhoneChange}
                          width="full"
                          placeholder="(123) 456-7890"
                          disabled={isViewMode}
                          suggestions={suggestions.phoneZelle}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.phoneZelle}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              phoneZelle: value,
                            }))
                          }
                          variant="invoice"
                        />
                        <TextInput
                          name="emailZelle"
                          label={renderLabel("Email :")}
                          type="email"
                          value={formData.emailZelle}
                          onChange={handleChange}
                          width="full"
                          placeholder="name@example.com"
                          disabled={isViewMode}
                          suggestions={suggestions.emailZelle}
                          showSuggestions={!isViewMode}
                          onSearchSuggestions={searchSuggestions}
                          isLoadingSuggestions={loadingSuggestions.emailZelle}
                          onSuggestionClick={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              emailZelle: value,
                            }))
                          }
                          variant="invoice"
                        />
                      </div>

                      <div className="notes_disclaimer-section mt-6 relative">
                        <div className="absolute left-60 top-4 z-10">
                          {canUseArrayFieldControls && (
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.includeBanner || false}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      includeBanner: e.target.checked,
                                    }))
                                  }
                                  className="w-6 h-6 accent-[#0097A7]"
                                />
                                <span className="text-lg font-bold text-[#0097A7]">
                                  Include Banner
                                </span>
                              </label>
                              {formData.includeBanner && (
                                <div className="flex items-center gap-2">
                                  <label className="text-sm font-bold text-[#0097A7]">
                                    Width:
                                  </label>
                                  <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={formData.bannerWidth || 90}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        bannerWidth:
                                          parseInt(e.target.value) || 90,
                                      }))
                                    }
                                    className="w-16 px-2 py-1 border-2 border-[#0097A7] rounded text-center font-bold"
                                  />
                                  <span className="text-sm font-bold text-[#0097A7]">
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {formData.includeBanner && (
                          <div className="w-full my-[4.6rem]">
                            <img
                              src="/banner2.png"
                              alt="Banner"
                              className="h-auto mx-auto"
                              style={{
                                width: `${formData.bannerWidth || 90}%`,
                              }}
                            />
                          </div>
                        )}
                        {/* Disclaimer Section */}
                        {(!isViewMode || formData.disclaimer) && (
                          <div data-section="disclaimer" className="pb-2">
                            <Typography
                              variant="h3"
                              className="font-semibold bg-colorOrange text-white w-max px-2 py-1 uppercase"
                            >
                              Disclaimer
                            </Typography>
                            {isViewMode ? (
                              <div
                                className="mt-2 bg-colorOrange text-white p-3 font-bold leading-relaxed text-xl"
                                dangerouslySetInnerHTML={{
                                  __html: formData.disclaimer || "",
                                }}
                              ></div>
                            ) : (
                              <TextArea
                                name="disclaimer"
                                value={formData.disclaimer || ""}
                                onChange={handleChange}
                                placeholder="Enter disclaimer text (optional)..."
                                rows={2}
                                disabled={isViewMode}
                                suggestions={suggestions.disclaimer}
                                showSuggestions={
                                  !isViewMode &&
                                  activeSuggestionField === "disclaimer"
                                }
                                onSearchSuggestions={(field, query) => {
                                  setActiveSuggestionField("disclaimer");
                                  searchSuggestions("disclaimer", query);
                                }}
                                onFocus={() => {
                                  setActiveSuggestionField("disclaimer");
                                  if (formData.disclaimer) {
                                    searchSuggestions(
                                      "disclaimer",
                                      formData.disclaimer,
                                    );
                                  } else {
                                    searchSuggestions("disclaimer", "");
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(
                                    () => setActiveSuggestionField(null),
                                    200,
                                  );
                                }}
                                isLoadingSuggestions={
                                  loadingSuggestions.disclaimer
                                }
                                onSuggestionClick={(value) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    disclaimer: value,
                                  }));
                                  setActiveSuggestionField(null);
                                }}
                                variant="invoice"
                                inputClass="mt-2 rounded-lg"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </FormSection>
                  {/* Footer Contact Information */}

                  <div
                    className="bg-[#0097A7] text-white py-2 px-8 relative z-30 ml-[0.65rem]"
                    data-pdf-footer="true"
                  >
                    <div className="flex gap-3 justify-evenly text-2xl font-bold relative">
                      {/* Page number */}
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-white font-bold text-5xl"
                        data-hide-in-pdf="true"
                      >
                        2
                      </div>
                      {/* Phone Section */}
                      <a
                        href="tel:8337762243"
                        className="flex items-center hover:text-[#FD7702] group text-center"
                      >
                        <i className="fas fa-phone-volume text-4xl text-[#FD7702] group-hover:text-white mr-3"></i>
                        <div className="flex flex-col items-end leading-tight">
                          <div className="tracking-wide">(833) PROBAID</div>
                          <div className="tracking-wider lowercase -mt-1 w-max ml-px text-[27px]">
                            7762243
                          </div>
                        </div>
                      </a>
                      <div className="border-r-2 border-white"></div>

                      {/* Email Section */}
                      <a
                        href="mailto:Info@833probaid.com"
                        className="flex items-center border-white group"
                      >
                        <i className="fas fa-envelope text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                        <span>
                          <span className="text-black group-hover:text-white">
                            Info@
                          </span>
                          <span className="text-white group-hover:text-black">
                            833probaid
                          </span>
                          <span className="text-black group-hover:text-white">
                            .com
                          </span>
                        </span>
                      </a>

                      <div className="border-r-2 border-white"></div>
                      {/* Website Section */}
                      <a
                        href="https://www.833probaid.com"
                        className="flex items-center group"
                      >
                        <i className="fas fa-globe text-[#FD7702] group-hover:text-white text-4xl mr-3"></i>
                        <span>
                          <span className="text-black group-hover:text-white">
                            www.
                          </span>
                          <span className="text-white group-hover:text-black">
                            833probaid
                          </span>
                          <span className="text-black group-hover:text-white">
                            .com
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                {!isViewMode && (
                  <div
                    className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 mt-8 sm:mt-14"
                    id="invoice-action-buttons"
                  >
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-gray-500 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#0097A7] text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[#007a87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      {isSaving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          {id && id !== "new"
                            ? "Update Invoice"
                            : "Save Invoice"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
