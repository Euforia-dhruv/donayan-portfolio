"use client";

import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";

export interface UploadedAsset {
  storageId: string;
  url: string;
}

export function useConvexUpload() {
  const convex = useConvex();

  return async function upload(file: File): Promise<UploadedAsset> {
    const uploadUrl: string = await convex.mutation(
      api.media.generateUploadUrl,
      {},
    );
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed");
    const { storageId } = (await res.json()) as { storageId: string };
    const url: string | null = await convex.query(api.media.getUrl, {
      fileId: storageId as any,
    });
    return { storageId, url: url ?? "" };
  };
}
