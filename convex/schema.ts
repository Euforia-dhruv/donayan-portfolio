import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()),
  }).index("email", ["email"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    client: v.optional(v.string()),
    brand: v.optional(v.string()),
    campaign: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    role: v.optional(v.string()),
    year: v.optional(v.string()),
    featured: v.boolean(),
    published: v.boolean(),
    status: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
    thumbnail: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    gallery: v.array(v.string()),
    video: v.optional(v.string()),
    videos: v.array(v.string()),
    instagramUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    documents: v.array(v.object({ label: v.string(), fileId: v.optional(v.id("_storage")), url: v.optional(v.string()) })),
    orientation: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    mediaType: v.optional(v.string()), // "image" | "video" | "mixed"
    autoThumbnail: v.optional(v.boolean()),
    tags: v.array(v.string()),
    credits: v.optional(v.array(v.string())),
    bts: v.optional(v.array(v.string())),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    altText: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  })
    .index("by_published", ["published"])
    .index("by_featured", ["featured"])
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_year", ["year"]),

  wall: defineTable({
    projectId: v.optional(v.id("projects")),
    image: v.optional(v.id("_storage")),
    video: v.optional(v.string()),
    rotation: v.optional(v.number()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    zIndex: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    featured: v.boolean(),
    published: v.boolean(),
    sortOrder: v.optional(v.number()),
  }).index("by_published", ["published"]).index("by_featured", ["featured"]),

  brands: defineTable({
    name: v.string(),
    logo: v.optional(v.id("_storage")),
    website: v.optional(v.string()),
    featured: v.boolean(),
    sortOrder: v.optional(v.number()),
  }).index("by_featured", ["featured"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    sortOrder: v.optional(v.number()),
    color: v.optional(v.string()),
  }),

  timeline: defineTable({
    company: v.string(),
    roleTitle: v.optional(v.string()),
    position: v.optional(v.string()),
    productionHouseId: v.optional(v.string()),
    employmentType: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    description: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    skills: v.array(v.string()),
    location: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    associated: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
  }).index("by_order", ["sortOrder"]),

  testimonials: defineTable({
    name: v.string(),
    company: v.optional(v.string()),
    quote: v.string(),
    image: v.optional(v.id("_storage")),
    featured: v.boolean(),
  }).index("by_featured", ["featured"]),

  about: defineTable({
    bio: v.string(),
    resume: v.optional(v.id("_storage")),
    skills: v.array(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
  }),

  settings: defineTable({
    siteTitle: v.string(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    youtube: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    footer: v.optional(v.string()),
    copyright: v.optional(v.string()),
  }),

  hero: defineTable({
    bgPhotoId: v.optional(v.id("_storage")),
    bgVideoId: v.optional(v.id("_storage")),
    headline: v.optional(v.string()),
    freelance: v.optional(v.string()),
    role1: v.optional(v.string()),
    role2: v.optional(v.string()),
    description: v.optional(v.string()),
    ctaPrimary: v.optional(v.string()),
    ctaSecondary: v.optional(v.string()),
    stats: v.optional(v.array(v.object({ value: v.string(), label: v.string() }))),
    availableFor: v.optional(v.array(v.string())),
  }),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    status: v.string(),
  }).index("by_status", ["status"]),

  media: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    type: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
  }).index("by_type", ["type"]),

  analyticsEvents: defineTable({
    type: v.string(),
    path: v.optional(v.string()),
    refId: v.optional(v.string()),
    refTitle: v.optional(v.string()),
    label: v.optional(v.string()),
    referrer: v.optional(v.string()),
    ua: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    browser: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    ts: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_ts", ["ts"])
    .index("by_session", ["sessionId"]),
});
