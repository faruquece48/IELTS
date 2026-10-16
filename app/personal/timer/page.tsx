import type { Metadata } from "next";
import SpeakingTimer from "./SpeakingTimer";

export const metadata: Metadata = {
  title: "Speaking Timer | Personal",
  description: "A simple countdown timer for IELTS speaking practice.",
};

export default function TimerPage() {
  return <SpeakingTimer />;
}
