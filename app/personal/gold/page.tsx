import type { Metadata } from "next";
import GoldDashboard from "./GoldDashboard";

export const metadata: Metadata = {
  title: "Gold Forecast | Personal",
  description: "Live gold price monitoring and an experimental 24-hour hourly forecast.",
};

export default function GoldPage() {
  return <GoldDashboard />;
}
