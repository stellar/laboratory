"use client";

import Link from "next/link";

import { Routes } from "@/constants/routes";
import { LayoutContentContainer } from "@/components/layout/LayoutContentContainer";

// TODO: update 404
export default function NotFound() {
  return (
    <LayoutContentContainer>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={Routes.ROOT}>Return Home</Link>
    </LayoutContentContainer>
  );
}
