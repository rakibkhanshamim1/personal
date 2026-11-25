import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess, PaginationMeta } from "@/types";

export function ok<T>(
  data: T,
  init?: { status?: number; meta?: PaginationMeta },
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true as const, data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200 },
  );
}

export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return ok(data, { status: 201 });
}

export function fail(
  error: string,
  status = 400,
  fieldErrors?: Record<string, string[]>,
): NextResponse<ApiFailure> {
  return NextResponse.json(
    { success: false as const, error, ...(fieldErrors ? { fieldErrors } : {}) },
    { status },
  );
}
