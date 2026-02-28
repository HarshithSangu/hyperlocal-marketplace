import React from "react";
import { Outlet } from "react-router-dom";
import { AdminApprovedSellersProvider } from "../context/AdminApprovedSellersContext";

export function AdminLayout() {
  return (
    <AdminApprovedSellersProvider>
      <Outlet />
    </AdminApprovedSellersProvider>
  );
}
