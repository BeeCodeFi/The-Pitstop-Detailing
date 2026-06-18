import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Complete car detailing services — exterior detailing, interior cleaning, ceramic coating, PPF, paint correction, and vehicle pickup & delivery.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
