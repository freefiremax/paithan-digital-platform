/**
 * Site navigation tree.
 *
 * Single source of truth shared by the header and the footer so the two cannot drift.
 * Mirrors the sitemap in `architecture.md` §2 and the section list in `prd.md` §6 exactly —
 * per `rules.md` §3, no route appears here that is not already in that sitemap.
 */

export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
}

export interface NavSection {
  readonly label: string;
  readonly labelMr: string;
  readonly href: string;
  readonly children: readonly NavLink[];
}

export const navSections: readonly NavSection[] = [
  {
    label: "Nagar Parishad",
    labelMr: "नगर परिषद",
    href: "/nagar-parishad",
    children: [
      {
        label: "About Nagar Parishad",
        href: "/nagar-parishad",
        description: "Departments, administrative structure and office contact",
      },
      {
        label: "Public representatives",
        href: "/nagar-parishad/representatives",
        description: "MLA, MP, council administration and ward corporators",
      },
      { label: "Ward map", href: "/nagar-parishad/ward-map", description: "All 17 ward boundaries" },
      {
        label: "Nagar Sevak (ward-wise)",
        href: "/nagar-parishad/nagar-sevak",
        description: "Representative and activity for each ward",
      },
      {
        label: "Development works",
        href: "/nagar-parishad/development-works",
        description: "Filter by ward and by status",
      },
      { label: "Projects", href: "/nagar-parishad/projects", description: "Larger council projects" },
      {
        label: "Notifications",
        href: "/nagar-parishad/notifications",
        description: "Announcements, schemes, tenders and public notices",
      },
    ],
  },
  {
    label: "Heritage",
    labelMr: "वारसा",
    href: "/heritage/history",
    children: [
      {
        label: "Paithan Museum",
        href: "/heritage/museum",
        description: "Dr. Balasaheb Patil Archaeological Museum",
      },
      { label: "Artifacts", href: "/heritage/artifacts", description: "Catalogued objects and their periods" },
      { label: "3D models", href: "/heritage/3d-models", description: "Rotate and zoom scanned objects" },
      { label: "History", href: "/heritage/history", description: "Pratishthana to modern Paithan" },
      {
        label: "Cultural heritage",
        href: "/heritage/cultural-heritage",
        description: "Manuscripts, monuments, traditions and personalities",
      },
    ],
  },
  {
    label: "Tourism",
    labelMr: "पर्यटन",
    href: "/tourism/places-to-visit",
    children: [
      { label: "Jayakwadi", href: "/tourism/jayakwadi", description: "Dam information and visitor guidance" },
      { label: "Nath Sagar", href: "/tourism/nath-sagar", description: "Reservoir, activities and access" },
      { label: "Heritage sites", href: "/tourism/heritage-sites", description: "Temples, ghats and monuments" },
      { label: "Places to visit", href: "/tourism/places-to-visit", description: "Curated list across the town" },
      { label: "Routes and itineraries", href: "/tourism/routes", description: "One-day, heritage and nature routes" },
      { label: "Tourist map", href: "/tourism/map", description: "Every place on one map" },
    ],
  },
];

/** Top-level items rendered flat in the navigation bar, after the sections. */
export const navDirectLinks: readonly NavLink[] = [
  { label: "Notifications", href: "/nagar-parishad/notifications" },
  { label: "Ask about Paithan", href: "/chatbot" },
];

export const homeLink: NavLink = { label: "Home", href: "/" };
