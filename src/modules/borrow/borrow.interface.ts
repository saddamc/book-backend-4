import { Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  borrowerName: string;
  quantity: number;
  dueDate: Date;
}
