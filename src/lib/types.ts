export type Lead = {
  inquiryId: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  product?: string;
  shape?: string;
  material?: string;
  message: string;
  country?: string;
  budget?: string;
  sourceUrl?: string;
  customConfig?: Record<string, unknown>;
  geo?: string;
};
