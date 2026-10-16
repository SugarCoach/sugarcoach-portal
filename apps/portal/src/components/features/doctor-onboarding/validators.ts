// Validadores puros de formato. Sin dependencias, fáciles de testear.

/** Luhn estándar sobre una cadena de dígitos. */
function luhnValid(digits: string): boolean {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48
    if (double) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    double = !double
  }
  return sum % 10 === 0
}

/** NPI: 10 dígitos; el Luhn se calcula con el prefijo 80840 (estándar CMS). */
export function isValidNpi(value: string): boolean {
  return /^\d{10}$/.test(value) && luhnValid(`80840${value}`)
}

/** EIN: XX-XXXXXXX */
export function isValidEin(value: string): boolean {
  return /^\d{2}-\d{7}$/.test(value)
}

/** Teléfono US: 10 dígitos, admite +1 y separadores comunes. */
export function isValidUsPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

/** ZIP US: 12345 o 12345-6789 */
export function isValidZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value)
}

/** Mayoría de edad para una fecha YYYY-MM-DD. */
export function isAdult(isoDate: string, minAge = 18, today = new Date()): boolean {
  const dob = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(dob.getTime()) || dob > today) return false
  let age = today.getFullYear() - dob.getFullYear()
  const beforeBirthday =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  if (beforeBirthday) age -= 1
  return age >= minAge && age <= 120
}

/** Comparación de nombres ignorando mayúsculas, tildes y espacios repetidos. */
export function sameName(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  return norm(a) === norm(b)
}
