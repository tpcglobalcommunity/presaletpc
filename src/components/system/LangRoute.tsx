import React from "react";
import { useParams } from "react-router-dom";

type LangRouteProps = {
  id: React.ReactElement;
  en: React.ReactElement;
};

export default function LangRoute({ id, en }: LangRouteProps) {
  const { lang } = useParams();
  // Default to "id", only use "en" if explicitly requested
  const safeLang = lang === "en" ? "en" : "id";
  return safeLang === "en" ? en : id;
}
