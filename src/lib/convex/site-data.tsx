"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

type Project = Doc<"projects">;
type WallItem = Doc<"wall">;
type Brand = Doc<"brands">;
type Category = Doc<"categories">;
type TimelineEntry = Doc<"timeline">;
type Testimonial = Doc<"testimonials">;
type AboutData = Doc<"about">;
type SiteSettings = Doc<"settings">;

interface SiteDataContextValue {
  projects: Project[];
  brands: Brand[];
  wallItems: WallItem[];
  timeline: TimelineEntry[];
  testimonials: Testimonial[];
  categories: Category[];
  settings: SiteSettings | null | undefined;
  about: AboutData | null | undefined;
  loading: boolean;
}

const SiteDataContext = createContext<SiteDataContextValue>({
  projects: [],
  brands: [],
  wallItems: [],
  timeline: [],
  testimonials: [],
  categories: [],
  settings: null,
  about: null,
  loading: true,
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const projects = useQuery(api.projects.list, { published: true });
  const brands = useQuery(api.brands.list, {});
  const wallItems = useQuery(api.wall.list, { published: true });
  const timeline = useQuery(api.timeline.list);
  const testimonials = useQuery(api.testimonials.list, {});
  const categories = useQuery(api.categories.list);
  const settings = useQuery(api.settings.get);
  const about = useQuery(api.about.get);

  const loading = projects === undefined || brands === undefined || wallItems === undefined ||
    timeline === undefined || testimonials === undefined || categories === undefined ||
    settings === undefined || about === undefined;

  return (
    <SiteDataContext.Provider
      value={{
        projects: projects || [],
        brands: brands || [],
        wallItems: wallItems || [],
        timeline: timeline || [],
        testimonials: testimonials || [],
        categories: categories || [],
        settings,
        about,
        loading,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}

export function useProjects() {
  const { projects, loading } = useContext(SiteDataContext);
  return { projects, loading };
}

export function useBrands() {
  const { brands, loading } = useContext(SiteDataContext);
  return { brands, loading };
}

export function useWallItems() {
  const { wallItems, loading } = useContext(SiteDataContext);
  return { wallItems, loading };
}

export function useTimeline() {
  const { timeline, loading } = useContext(SiteDataContext);
  return { timeline, loading };
}

export function useTestimonials() {
  const { testimonials, loading } = useContext(SiteDataContext);
  return { testimonials, loading };
}

export function useCategories() {
  const { categories, loading } = useContext(SiteDataContext);
  return { categories, loading };
}

export function useSettings() {
  const { settings, loading } = useContext(SiteDataContext);
  return { settings, loading };
}

export function useAbout() {
  const { about, loading } = useContext(SiteDataContext);
  return { about, loading };
}