export type ArtworkPublic = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  sold?: boolean;
};
