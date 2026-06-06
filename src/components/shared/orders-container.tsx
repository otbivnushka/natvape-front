import clsx from 'clsx';
import React from 'react';
import type { Order } from '../../types';
import { Package } from 'lucide-react';
import { EmptyState } from './empty-state';
import { OrderCard } from './order-card';
import { Spinner } from '../ui';

interface OrdersContainerProps {
  className?: string;
  orders: Order[];
  ordersLoading: boolean;
}

const OrdersContainer: React.FC<OrdersContainerProps> = ({ className, orders, ordersLoading }) => {
  return (
    <div className={clsx('mb-12', className)}>
      <h2 className="text-lg font-semibold text-muted mb-3">История заказов</h2>
      {ordersLoading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <EmptyState icon={<Package size={48} />} title="Нет заказов" />
      ) : (
        
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};

export { OrdersContainer };
