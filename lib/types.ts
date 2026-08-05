export type TimeSlot = {
  id: string;
  date: string;
  time: string;
};

export type Booking = {
  id: string;
  slotId: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  guests: number;
  createdAt: string;
};

export type BookingFormData = {
  fullName: string;
  phone: string;
  guests: number;
};
