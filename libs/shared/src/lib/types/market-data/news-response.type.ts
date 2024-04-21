export type NewsResponseType = {
  news: {
    author: string;
    content: string;
    created_at: string;
    headline: string;
    id: number;
    images: { size: string; url: string }[];
    source: string;
    summary: string;
    symbols: string[];
    updated_at: string;
    url: string;
  }[];
  next_page_token: string;
};
