import { getDictItems } from '@/api/assessApis'

export async function getDictItemByCode(code) {
  try {
    const res = await getDictItems(code)
    if (res.success) {
      return res.result
    } else {
      throw new Error('Failed to fetch dictionary items')
    }
  } catch (error) {
    console.error(error)
    return null
  }
}