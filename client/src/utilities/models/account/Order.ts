import Address from "./Address"
import { FullOrderItem } from "./OrderItem"

export interface Order {
    id: string,
    uniqueId: string,
    orderSum: string,
    status: OrderStatusEnum,
    orderDate: Date
}

export interface OrderWithItems extends Order{
    orderItems: FullOrderItem[],
    address: Address
}

export enum OrderStatusEnum{
    New,
    Approved,
    Processed,
    Shipped,
    Delivered,
    Cancelled
} 