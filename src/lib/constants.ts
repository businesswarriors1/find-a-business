// ============================================================
// findabusiness.com.au — Site Constants
// ============================================================

export const SITE_NAME = "findabusiness.com.au";
export const SITE_URL = "https://findabusiness.com.au";
export const SITE_DESCRIPTION =
  "Find any business, anywhere in Australia. Free Australian business directory — search by category, state, or suburb.";
export const SITE_OG_IMAGE = "/og-image.png";

// ---------------------------------------------------------------------------
// Australian States (8 states/territories)
// ---------------------------------------------------------------------------

export type StateConstant = { id: string; name: string; slug: string; abbreviation: string };
export type CategoryConstant = { id: string; name: string; slug: string; icon: string; sort_order: number };
export type SubcategoryConstant = { id: string; name: string; slug: string; parent_id: string };
export type SuburbConstant = { id: string; name: string; slug: string; postcode: string; state_id: string };

export const AUSTRALIAN_STATES: StateConstant[] = [
  { id: "nsw", name: "New South Wales", abbreviation: "NSW", slug: "nsw" },
  { id: "vic", name: "Victoria", abbreviation: "VIC", slug: "vic" },
  { id: "qld", name: "Queensland", abbreviation: "QLD", slug: "qld" },
  { id: "wa", name: "Western Australia", abbreviation: "WA", slug: "wa" },
  { id: "sa", name: "South Australia", abbreviation: "SA", slug: "sa" },
  { id: "tas", name: "Tasmania", abbreviation: "TAS", slug: "tas" },
  { id: "nt", name: "Northern Territory", abbreviation: "NT", slug: "nt" },
  { id: "act", name: "Australian Capital Territory", abbreviation: "ACT", slug: "act" },
];

// Backward-compat alias
export const STATES = AUSTRALIAN_STATES;

// ---------------------------------------------------------------------------
// Primary Categories (20) with IDs and sort_order
// ---------------------------------------------------------------------------

export const PRIMARY_CATEGORIES: CategoryConstant[] = [
  { id: "cat-plumbers", slug: "plumbers", name: "Plumbers", icon: "Wrench", sort_order: 1 },
  { id: "cat-electricians", slug: "electricians", name: "Electricians", icon: "Zap", sort_order: 2 },
  { id: "cat-builders", slug: "builders", name: "Builders", icon: "HardHat", sort_order: 3 },
  { id: "cat-cleaners", slug: "cleaners", name: "Cleaners", icon: "Sparkles", sort_order: 4 },
  { id: "cat-painters", slug: "painters", name: "Painters", icon: "Paintbrush", sort_order: 5 },
  { id: "cat-gardeners", slug: "gardeners", name: "Gardeners", icon: "Flower2", sort_order: 6 },
  { id: "cat-removalists", slug: "removalists", name: "Removalists", icon: "Truck", sort_order: 7 },
  { id: "cat-dentists", slug: "dentists", name: "Dentists", icon: "Smile", sort_order: 8 },
  { id: "cat-doctors", slug: "doctors", name: "Doctors", icon: "Stethoscope", sort_order: 9 },
  { id: "cat-vets", slug: "vets", name: "Vets", icon: "PawPrint", sort_order: 10 },
  { id: "cat-accountants", slug: "accountants", name: "Accountants", icon: "Calculator", sort_order: 11 },
  { id: "cat-lawyers", slug: "lawyers", name: "Lawyers", icon: "Scale", sort_order: 12 },
  { id: "cat-real-estate-agents", slug: "real-estate-agents", name: "Real Estate Agents", icon: "Home", sort_order: 13 },
  { id: "cat-mechanics", slug: "mechanics", name: "Mechanics", icon: "Car", sort_order: 14 },
  { id: "cat-cafes", slug: "cafes", name: "Cafes", icon: "Coffee", sort_order: 15 },
  { id: "cat-restaurants", slug: "restaurants", name: "Restaurants", icon: "UtensilsCrossed", sort_order: 16 },
  { id: "cat-hairdressers", slug: "hairdressers", name: "Hairdressers", icon: "Scissors", sort_order: 17 },
  { id: "cat-photographers", slug: "photographers", name: "Photographers", icon: "Camera", sort_order: 18 },
  { id: "cat-it-support", slug: "it-support", name: "IT Support", icon: "Monitor", sort_order: 19 },
  { id: "cat-childcare", slug: "childcare", name: "Childcare", icon: "Baby", sort_order: 20 },
];

export const POPULAR_CATEGORIES = PRIMARY_CATEGORIES.slice(0, 5);

export const AUSTRALIAN_CITIES_SUBURBS: Record<string, string[]> = {
  nsw: ["Sydney", "Newcastle", "Wollongong", "Parramatta", "Chatswood"],
  vic: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Richmond"],
  qld: ["Brisbane", "Gold Coast", "Cairns", "Toowoomba", "Sunshine Coast"],
  wa: ["Perth", "Fremantle", "Bunbury", "Joondalup", "Mandurah"],
  sa: ["Adelaide", "Mount Gambier", "Whyalla", "Port Lincoln", "Glenelg"],
  tas: ["Hobart", "Launceston", "Devonport", "Burnie", "Kingston"],
  nt: ["Darwin", "Alice Springs", "Palmerston", "Katherine", "Nhulunbuy"],
  act: ["Canberra", "Belconnen", "Gungahlin", "Tuggeranong", "Woden"],
};

export const ITEMS_PER_PAGE = 20;

export const GET_LISTED_FAQS = [
  {
    q: "How long does it take to get listed?",
    a: "Your business listing typically goes live within 24 hours after you chat with us. We just need to verify a few details to ensure accuracy.",
  },
  {
    q: "Is it really free?",
    a: "Yes! A basic listing on findabusiness.com.au is 100% free, forever. There are no hidden fees or credit card requirements. We may introduce optional premium features in the future, but the basic listing always stays free.",
  },
  {
    q: "What information do I need to provide?",
    a: "You'll need your business name, category, phone number, address (street, suburb, state, postcode), and a short description. A logo and website URL are optional but recommended.",
  },
  {
    q: "Can I update my listing later?",
    a: "Absolutely. Once listed, you can request updates at any time — just get in touch with us and we'll make changes for you.",
  },
  {
    q: "What areas do you cover?",
    a: "We cover all of Australia — every state, territory, city, and suburb. Whether you're in Sydney, Melbourne, Brisbane, or regional Australia, you can list your business.",
  },
  {
    q: "Why do I need to chat first?",
    a: "We chat with you to verify your business details and ensure accuracy. It only takes a couple of minutes, and it helps us keep the directory trustworthy and accurate for everyone.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    icon: "MessageCircle",
    title: "Chat with Us",
    description:
      "Tell us about your business in a quick two-minute chat. Our friendly AI assistant will guide you through the process.",
  },
  {
    icon: "ClipboardList",
    title: "Get Listed Free",
    description:
      "We'll create your listing and verify your details. Your business goes live — no fees, no credit card required.",
  },
  {
    icon: "Search",
    title: "Get Found",
    description:
      "Australians searching for businesses like yours will find you. Your listing appears in relevant category, state, and suburb pages.",
  },
];
