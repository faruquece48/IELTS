import type { Metadata } from "next";
import TrafficTracker from "./TrafficTracker";

export const metadata:Metadata={title:"Traffic | Personal Utilities",description:"Plan Google Maps routes and record travel-time details."};
export default function TrafficPage(){return <TrafficTracker/>}
