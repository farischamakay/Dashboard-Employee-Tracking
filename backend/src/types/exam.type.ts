export interface ExamModel {
  examId: string;
  userId: string;
  data?: JSON | null;
  tag?: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}
