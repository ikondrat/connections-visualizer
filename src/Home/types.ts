export interface Connection {
  position: Position;
  checkIn: string;
  checkOut: string;
}

export interface Position {
  lat: number;
  lng: number;
}
