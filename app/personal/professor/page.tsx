import type { Metadata } from "next";
import ProfessorTracker from "./ProfessorTracker";

export const metadata: Metadata = { title: "Professor Tracker | Personal" };

export default function ProfessorPage() {
  return <ProfessorTracker />;
}
