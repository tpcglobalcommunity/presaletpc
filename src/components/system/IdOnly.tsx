import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";

export default function IdOnly({ children }: { children: React.ReactElement }) {
  const { lang } = useParams();
  if (lang !== "id") return <NotFound />;
  return children;
}
