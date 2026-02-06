import React from "react";
import { useParams, Navigate } from "react-router-dom";

interface RedirectLegacyRouteProps {
  to: string;
}

// Helper component to redirect legacy /:lang/member and /:lang/admin routes
export default function RedirectLegacyRoute({ to }: RedirectLegacyRouteProps) {
  const params = useParams();
  const lang = params.lang;
  const rest = params['*'] || '';
  
  // Only redirect if lang is present, otherwise let 404 handle
  if (lang) {
    const targetPath = `/${to}${rest ? '/' + rest : ''}`;
    return <Navigate to={targetPath} replace />;
  }
  
  return <Navigate to="/404" replace />;
}
