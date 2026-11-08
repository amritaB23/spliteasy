import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import HandshakeIcon from '@mui/icons-material/Handshake';
import type { Category } from '../types';

const ICONS: Record<Category, typeof RestaurantIcon> = {
  Food: RestaurantIcon,
  Travel: FlightIcon,
  Stay: HotelIcon,
  Shopping: ShoppingBagIcon,
  Bills: ReceiptIcon,
  Other: CategoryIcon,
  Settlement: HandshakeIcon,
};

export default function CategoryIconView({ category }: { category: Category }) {
  const Icon = ICONS[category];
  return <Icon fontSize="small" />;
}
