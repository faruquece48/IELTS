import type { Metadata } from "next";
import DhakaRouteMap from "./DhakaRouteMap";

export const metadata: Metadata = {
  title: "Dhaka Route Map | Personal Utilities",
  description: "Explore the ten Dhaka traffic routes monitored by the project.",
};

export default function DhakaRouteMapPage() {
  return <DhakaRouteMap />;
}
