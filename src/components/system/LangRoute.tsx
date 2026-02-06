import React from "react";
import { useParams } from "react-router-dom";

type LangRouteProps = {
  id: React.ReactElement;
  en: React.ReactElement;
};

export default function LangRoute({ id, en }: LangRouteProps) {
  const { lang } = useParams();
  // Default to "en", only use "id" if explicitly requested
  const safeLang = lang === "id" ? "id" : "en";
  return safeLang === "en" ? en : id;
}
