export function pick<TRaw>(obj: TRaw, keys: (keyof typeof obj)[]) {
  const result = {} as any
  for (const key of keys) {
    result[key] = JSON.parse(JSON.stringify(obj[key]))
  }
  return result
}
