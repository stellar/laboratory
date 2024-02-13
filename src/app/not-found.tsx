"use client";

import Link from "next/link";

import { Routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={Routes.ROOT}>Return Home</Link>
    </div>
  );
}
