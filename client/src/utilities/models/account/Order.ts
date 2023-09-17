import Address from "./Address";
import { FullOrderItem } from "./OrderItem";

export interface Order {
  id: string;
  uniqueId: string;
  orderSum: string;
  status: OrderStatusEnum;
  orderDate: Date;
}

export interface OrderWithItems extends Order {
  orderItems: FullOrderItem[];
  address: Address;
}

export enum OrderStatusEnum {
  New,
  Approved,
  Processed,
  Shipped,
  Delivered,
  Cancelled,
}

export const statuses = [
  { key: "New", id: 0 },
  { key: "Approved", id: 1 },
  { key: "Processed", id: 2 },
  { key: "Shipped", id: 3 },
  { key: "Delivered", id: 4 },
  { key: "Cancelled", id: 5 },
];
