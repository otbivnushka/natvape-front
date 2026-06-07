import { ApiRoutes } from '../constants';
import type { ApiOrder, CreateOrderDto, ApiOrderItem } from '../dto/order.dto';
import type { Order, OrderItem } from '../../types';
import { axiosInstance } from '../instance';

function mapOrderItem(i: ApiOrderItem): OrderItem {
  return i;
}

function mapOrder(o: ApiOrder): Order {
  return {
    ...o,
    items: (o.items ?? []).map(mapOrderItem),
  };
}

export const create = async (dto: CreateOrderDto): Promise<Order> => {
  const { data } = await axiosInstance.post<ApiOrder>(ApiRoutes.ORDERS, dto);
  return mapOrder(data);
};

export const getAll = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<ApiOrder[]>(ApiRoutes.ORDERS);
  return data.map(mapOrder);
};

export const getById = async (id: number): Promise<Order> => {
  const { data } = await axiosInstance.get<ApiOrder>(
    ApiRoutes.ORDER_BY_ID.replace(':id', String(id)),
  );
  return mapOrder(data);
};
