// Frontend API client for invoice endpoints.
// Uses the project's httpOnly auth cookie via credentials: "include"
// + localStorage auth_token fallback (same pattern as app/lib/api/client.js).

const normalizeApiBaseUrl = (value) => {
  const base = (value || "").trim();
  if (!base) return "/api";
  if (base.endsWith("/api")) return base;
  return `${base.replace(/\/$/, "")}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : ""
);

class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");
  }

  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Let the project's AuthGuard handle redirect via event
        window.dispatchEvent(
          new CustomEvent("authError", {
            detail: {
              status: response.status,
              message: data?.message || "Unauthorized",
              endpoint,
            },
          })
        );
      }
      throw new APIError(
        data?.message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }
    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(error.message || "Network error occurred", 0, null);
  }
}

export const invoiceAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_k, v]) => v !== undefined && v !== "")
    ).toString();
    return apiRequest(`/invoices${queryString ? `?${queryString}` : ""}`);
  },
  getById: async (id) => {
    if (!id) throw new APIError("Invoice ID is required", 400);
    return apiRequest(`/invoices/${id}`);
  },
  create: async (data) => {
    if (!data.invoiceNumber)
      throw new APIError("Invoice number is required", 400);
    if (!data.date) throw new APIError("Date is required", 400);
    return apiRequest("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateStatus: async (id, status) => {
    if (!id) throw new APIError("Invoice ID is required", 400);
    if (!status) throw new APIError("Status is required", 400);
    return apiRequest(`/invoices/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  update: async (id, data) => {
    if (!id) throw new APIError("Invoice ID is required", 400);
    const { _id, __v, createdAt, updatedAt, ...updateData } = data;
    return apiRequest(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },
  delete: async (id) => {
    if (!id) throw new APIError("Invoice ID is required", 400);
    return apiRequest(`/invoices/${id}`, { method: "DELETE" });
  },
  getSuggestions: async (field, query = "") => {
    const allowedFields = [
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
    if (!allowedFields.includes(field)) {
      console.warn(`Invalid field for suggestions: ${field}`);
      return [];
    }
    try {
      const queryString = query ? `?query=${encodeURIComponent(query)}` : "";
      const data = await apiRequest(
        `/invoices/suggestions/${field}${queryString}`
      );
      return Array.isArray(data) ? data.map((item) => item.value) : [];
    } catch (error) {
      console.error(`Error fetching suggestions for ${field}:`, error);
      return [];
    }
  },
  getNextInvoiceNumber: async () => {
    try {
      const data = await apiRequest("/invoices/next-number");
      return data.nextNumber;
    } catch {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `INV-${year}${month}-${random}`;
    }
  },
  getStats: async () => {
    try {
      return await apiRequest("/invoices/stats");
    } catch {
      return { total: 0, totalAmount: 0, thisMonth: 0, thisMonthAmount: 0 };
    }
  },
};

export { APIError };
export default invoiceAPI;
