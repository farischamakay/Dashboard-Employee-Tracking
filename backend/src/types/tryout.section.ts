export interface TryoutSectionModel {
  tryoutId: string;
  code: string;
  description?: string | null;
  title: string;
  order?: number | null;
  data?: JSON | null;
  tag?: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}
