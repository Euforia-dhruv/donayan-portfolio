export interface WallItem {
  id: string;
  number: number;
  kind: "video" | "image";
  cover: string;
  gallery: string[];
  grouping: boolean;
  source: string;
  title: string;
  brand?: string;
  category: string;
  year: string;
  platform: string;
  description: string;
  aspect: string;
  collab: boolean;
  filters: string[];
}
