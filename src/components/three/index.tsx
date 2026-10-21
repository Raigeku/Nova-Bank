"use client";

import dynamic from "next/dynamic";

// WebGL is browser-only; load it after the page renders
export const BankScene = dynamic(() => import("./BankScene"), { ssr: false });
