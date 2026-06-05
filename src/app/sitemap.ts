import type { MetadataRoute } from "next";
import {
  SITE_URL,
  AUSTRALIAN_STATES,
  PRIMARY_CATEGORIES,
  AUSTRALIAN_CITIES_SUBURBS,
} from "@/lib/constants";
import { getAllBusinessSlugs } from "@/lib/supabase/server";

// Revalidate the sitemap once a day.
export const revalidate = 86400;

function slugifySuburb(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPaths = ["", "/get-listed", "/about", "/contact", "/privacy", "/terms"];
  for (const path of staticPaths) {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "monthly",
      priority: path === "" ? 1 : 0.5,
    });
  }

  // Category hubs
  for (const cat of PRIMARY_CATEGORIES) {
    entries.push({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // State hubs + state x category + suburb hubs + suburb x category (money pages)
  for (const state of AUSTRALIAN_STATES) {
    entries.push({
      url: `${SITE_URL}/state/${state.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    for (const cat of PRIMARY_CATEGORIES) {
      entries.push({
        url: `${SITE_URL}/state/${state.slug}/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const suburbs = AUSTRALIAN_CITIES_SUBURBS[state.slug] ?? [];
    for (const suburb of suburbs) {
      const suburbSlug = slugifySuburb(suburb);
      entries.push({
        url: `${SITE_URL}/state/${state.slug}/${suburbSlug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });

      for (const cat of PRIMARY_CATEGORIES) {
        entries.push({
          url: `${SITE_URL}/state/${state.slug}/${suburbSlug}/${cat.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  // Individual business listings (from the DB; empty until seeded)
  const businesses = await getAllBusinessSlugs();
  for (const b of businesses) {
    entries.push({
      url: `${SITE_URL}/business/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
