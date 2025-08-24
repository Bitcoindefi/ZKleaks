import { MIDNIGHT_ADDR_REGEX } from "./midnight"

// Validation utilities
export const validators = {
  // Midnight address validation
  midnightAddress: (address: string): boolean => {
    return MIDNIGHT_ADDR_REGEX.test(address.trim())
  },

  // Amount validation (positive number with up to specified decimals)
  amount: (value: string, maxDecimals = 18): boolean => {
    if (!value.trim()) return false
    const regex = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`)
    return regex.test(value.trim()) && Number.parseFloat(value) > 0
  },

  // File validation
  file: (file: File, maxSizeMB = 100): { valid: boolean; error?: string } => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
    }
    return { valid: true }
  },

  // Title validation
  title: (title: string): boolean => {
    return title.trim().length >= 3 && title.trim().length <= 200
  },

  // Message validation
  message: (message: string): boolean => {
    return message.trim().length >= 10 && message.trim().length <= 5000
  },
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => boolean | { valid: boolean; error?: string }>,
): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {}
  let valid = true

  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field])

    if (typeof result === "boolean") {
      if (!result) {
        errors[field as keyof T] = `Invalid ${field}`
        valid = false
      }
    } else {
      if (!result.valid) {
        errors[field as keyof T] = result.error || `Invalid ${field}`
        valid = false
      }
    }
  }

  return { valid, errors }
}
