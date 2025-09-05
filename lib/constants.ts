export const MALAWI_DISTRICTS = [
  "Balaka",
  "Blantyre",
  "Chikwawa", 
  "Chiradzulu",
  "Chitipa",
  "Dedza",
  "Dowa",
  "Karonga",
  "Kasungu",
  "Likoma",
  "Lilongwe",
  "Machinga",
  "Mangochi",
  "Mchinji",
  "Mulanje",
  "Mwanza",
  "Mzimba",
  "Neno",
  "Nkhotakota",
  "Nsanje",
  "Ntcheu",
  "Ntchisi",
  "Phalombe",
  "Rumphi",
  "Salima",
  "Thyolo",
  "Zomba",
  "Nkhata Bay"
] as const;

export const CAR_MAKES = [
  "Toyota",
  "Honda",
  "Mazda",
  "Nissan",
  "Ford",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Subaru",
  "Mitsubishi",
  "Suzuki",
  "Isuzu",
  "Land Rover",
  "Jeep",
  "Volvo",
  "Peugeot",
  "Renault",
  "Citroen",
  "Fiat",
  "Chevrolet",
  "Daihatsu",
  "Other"
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "CVT", label: "CVT" }
] as const;

export const FUEL_TYPE_OPTIONS = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ELECTRIC", label: "Electric" }
] as const;

export const CAR_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SOLD", label: "Sold" },
  { value: "EXPIRED", label: "Expired" },
  { value: "DRAFT", label: "Draft" }
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 1000000, label: "Under MK 1M" },
  { min: 1000000, max: 2000000, label: "MK 1M - 2M" },
  { min: 2000000, max: 5000000, label: "MK 2M - 5M" },
  { min: 5000000, max: 10000000, label: "MK 5M - 10M" },
  { min: 10000000, max: 20000000, label: "MK 10M - 20M" },
  { min: 20000000, max: null, label: "Above MK 20M" }
] as const;

// Currency formatter for MWK
export const formatMWK = (amount: number) => {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Date utilities
export const addOneMonth = (date: Date = new Date()) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
};

export const isExpiringSoon = (expiresAt: Date, daysThreshold: number = 7) => {
  const now = new Date();
  const diffTime = expiresAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold && diffDays > 0;
};

export const isExpired = (expiresAt: Date) => {
  return new Date() > expiresAt;
};