"use client";

import dynamic from "next/dynamic";

const LandingBackground = dynamic(
  () => import("@/components/LandingBackground"),
  { ssr: false },
);

export default function LandingBackgroundClient() {
  return <LandingBackground />;
}
