export interface GroupModel {
  groupId: string;
  parentId?: string | null;
  code: string;
  title: string;
  data?: JSON | null;
  tag?: string | null;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}
