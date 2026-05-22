export function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneValue)
  }

  if (value && typeof value === 'object') {
    const result = {}

    for (const [key, nestedValue] of Object.entries(value)) {
      result[key] = cloneValue(nestedValue)
    }

    return result
  }

  return value
}

export function deepMerge(base, override) {
  if (!override) {
    return cloneValue(base)
  }

  if (Array.isArray(base) || Array.isArray(override)) {
    return cloneValue(override)
  }

  const result = { ...(base ?? {}) }

  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = cloneValue(value)
    }
  }

  return result
}

export function randomRange(min, max, step) {
  const steps = Math.round((max - min) / step)
  return Number((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(1))
}
