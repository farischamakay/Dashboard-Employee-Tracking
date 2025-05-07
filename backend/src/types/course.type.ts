export interface CourseModel {
  courseId: string;
  code: string;
  title: string;
  description?: string | null;
  order?: number | null;
  data?: JSON | null;
  tag?: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}
