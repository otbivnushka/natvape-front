import { useNavigate, useParams } from 'react-router-dom';
import { OrderDetailModal } from '@/components/widgets/modals';

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return <OrderDetailModal open onClose={() => navigate('/admin/orders')} orderId={Number(id)} />;
};

export { AdminOrderPage };
