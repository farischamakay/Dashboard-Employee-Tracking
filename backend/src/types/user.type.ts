export interface UserModel {
  userId: string;
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  active: number;
  data?: JSON | null;
  createdAt: Date;
  updatedAt: Date;
}
