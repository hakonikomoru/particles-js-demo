import { categories } from './categories'
import { demos } from './demos'

export function getCatalog() {
  const demosByCategory = categories.map((category) => ({
    ...category,
    demos: demos.filter((demo) => demo.categoryId === category.id),
  }))

  return {
    categories,
    demos,
    demosByCategory,
  }
}
