export type UserRole = 'traveller' | 'driver';

export type VehicleCategory = 
  | 'Jeep / Cruiser'
  | 'Tata Magic / Mini-Van'
  | 'Auto / E-Rickshaw'
  | 'Rural Express Bus'
  | 'Private Car / Shared Taxi'
  | 'Bike / Scooter';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  village_town: string;
  avatar_url?: string;
  rating?: number;
  total_trips?: number;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: VehicleCategory;
  model_name: string;
  plate_number: string;
  total_seats: number;
  has_carrier: boolean;
  is_ac: boolean;
  color?: string;
}

export interface SharedRoute {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_rating: number;
  driver_avatar?: string;
  vehicle_type: VehicleCategory;
  vehicle_model: string;
  plate_number: string;
  origin: string;
  destination: string;
  intermediate_stops: string[];
  departure_time: string;
  departure_date?: string;
  frequency: string;
  price_per_seat: number;
  available_seats: number;
  total_seats: number;
  luggage_space?: string;
  has_carrier?: boolean;
  is_ac?: boolean;
  status: 'active' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
}

export interface Booking {
  id: string;
  route_id: string;
  traveller_id: string;
  passenger_name: string;
  passenger_phone: string;
  pickup_point: string;
  drop_point: string;
  seats_booked: number;
  total_fare: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  payment_status: 'cash_on_ride' | 'upi_paid' | 'wallet';
  created_at: string;
  route?: SharedRoute;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  date: string;
  vehicleType: string;
  requiredSeats: number;
}
