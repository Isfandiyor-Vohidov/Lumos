export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  ENROLLED: 'enrolled',
  REJECTED: 'rejected',
} as const;

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

export const PAYMENT_PROVIDER = {
  STRIPE: 'stripe',
  YOOKASSA: 'yookassa',
} as const;

export const CURRENCY = {
  RUB: 'rub',
  USD: 'usd',
} as const;