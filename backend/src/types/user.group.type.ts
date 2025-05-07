export interface UserGroupModel {
  userGroupId: string;
  userId: string;
  groupId: string;
  data?: JSON | null;
  createdAt: Date;
  updatedAt: Date;
}
