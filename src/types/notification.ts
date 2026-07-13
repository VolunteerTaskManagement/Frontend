export interface NotificationLog {
  id: number;
  title: string;
  type: string;
  usersId: number[];
  isSeen: boolean;
  createDateFa: string;
}