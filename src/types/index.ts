export interface ListingRequest {
  id: string;
  business_name: string;
  category?: string;
  suburb?: string;
  state?: string;
  phone?: string;
  website?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  status: "pending" | "approved" | "rejected";
  source: "chat" | "form";
  business_id?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
  suburb_id?: string;
  state?: string;
  suburb?: string;
  phone?: string;
  website?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  status: "active" | "suspended";
  claimed: boolean;
  claimed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  reviewer_name?: string;
  reviewer_email?: string;
  rating: number;
  content?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
}

export interface Suburb {
  id: string;
  name: string;
  state: string;
  postcode?: string;
  created_at: string;
}

export interface AdminStats {
  new_requests_today: number;
  pending_review: number;
  total_live_listings: number;
  reviews_pending: number;
}
