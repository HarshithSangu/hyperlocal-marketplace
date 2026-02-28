import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { apiCall } from "../api";

const AdminApprovedSellersContext = createContext(null);

export function AdminApprovedSellersProvider({ children }) {
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [approvedLoading, setApprovedLoading] = useState(true);
  const [approvedError, setApprovedError] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      const load = async () => {
        try {
          setApprovedLoading(true);
          setApprovedError("");
          const data = await apiCall("/admin/approved-sellers");
          setApprovedSellers(Array.isArray(data) ? data : []);
        } catch (err) {
          setApprovedError(err.message || "Failed to load approved sellers");
        } finally {
          setApprovedLoading(false);
        }
      };
      load();
    }
  }, []);

  return (
    <AdminApprovedSellersContext.Provider
      value={{ approvedSellers, approvedLoading, approvedError }}
    >
      {children}
    </AdminApprovedSellersContext.Provider>
  );
}

export function useAdminApprovedSellers() {
  const ctx = useContext(AdminApprovedSellersContext);
  if (!ctx) throw new Error("useAdminApprovedSellers must be used within AdminApprovedSellersProvider");
  return ctx;
}
