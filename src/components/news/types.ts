export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  fullContent?: string;
  author?: string;
  thumbnail?: string;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  isDefault?: boolean;
}
