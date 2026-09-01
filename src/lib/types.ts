export type UserRole = 'traveller' | 'driver';

export type Language = 'en' | 'hi';

export type VehicleCategory = 
  | 'E-Rickshaw Shared (Toto / Electric)'
  | 'Shared CNG Auto (6-Seater)'
  | 'Full Auto (Private Booking)'
  | 'Auto Parcel / Agri Cargo'
  | 'Rural Jeep / Cruiser';

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
  is_electric: boolean;
  battery_range?: string;
  color?: string;
}

export interface SharedRoute {
  id: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_rating: number;
  driver_avatar?: string;
  driver_experience?: string;
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
  full_vehicle_price?: number;
  available_seats: number;
  total_seats: number;
  luggage_space?: string;
  has_carrier?: boolean;
  is_electric?: boolean;
  eta_mins?: number;
  distance_km?: number;
  status: 'active' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  current_location?: { x: number; y: number; label: string };
  created_at?: string;
}

export interface Booking {
  id: string;
  otp: string; // 4-digit ride start OTP
  route_id: string;
  traveller_id: string;
  passenger_name: string;
  passenger_phone: string;
  pickup_point: string;
  drop_point: string;
  seats_booked: number;
  booking_type: 'shared_seat' | 'full_auto' | 'parcel';
  total_fare: number;
  status: 'confirmed' | 'in_transit' | 'completed' | 'cancelled';
  payment_status: 'cash_on_ride' | 'upi_paid' | 'wallet';
  created_at: string;
  route?: SharedRoute;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  vehicleType: string;
  bookingType: 'all' | 'shared' | 'full';
  maxFare?: number;
}
