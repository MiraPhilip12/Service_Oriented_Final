export class CreateDeliveryPersonnelDto {
  profileId: string;
  name: string;
  phone: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

export class UpdateLocationDto {
  lat: number;
  lng: number;
}

export class AssignDeliveryDto {
  orderId: number;
  deliveryPersonId: number;
}

export class DeliveryPersonResponseDto {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
  currentLat: number | null;
  currentLng: number | null;
  totalDeliveries: number;
  rating: number;
  vehicleType: string | null;
}

export class DeliveryStatusDto {
  orderId: number;
  deliveryPersonId: number;
  deliveryPersonName: string;
  deliveryPersonPhone: string;
  estimatedArrivalMinutes: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
}