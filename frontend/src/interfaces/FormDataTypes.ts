export interface FormData {
    creditCard: string;
    points: number;
    destination: string;
    destinationType: string; 
    departureCity: string;
    departureDate: Date;
    departureAirport: string;
    returnDate: Date | null;
    flightType: string;
    classType: string;
  }
  