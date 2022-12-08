import axios from 'axios'
import { COLORS } from '../shared/constants.js'
import { generateGravatarHash } from '../shared/uuid.js'

export async function getGravatar(email) {
  try {
    const hashedEmail = generateGravatarHash(email)
    const gravatarUrl = `https://en.gravatar.com/${hashedEmail}.json`
    const response = await axios.get(gravatarUrl)
    const { data: { entry: [gravatar] = [] } = {}, status } = response

    if (status !== 200) {
      return
    }

    return gravatar && gravatar.thumbnailUrl
  } catch {
    return
  }
}

export function getAvatarInSvg({ position, backgroundColor = COLORS.gray }) {
  const colors = Object.values(COLORS)
  const filteredColors = colors.filter((color) => color !== backgroundColor)
  const index = position % filteredColors.length || 0
  const color = filteredColors[index]

  return `
    <svg width="480" height="480" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect width="480" height="480" fill="${backgroundColor}" />
        <path d="M40 40V120H120V200H200V280H280V200H360V120H440V40H40Z" fill="${color}" />
        <path d="M360 280H440V440H40V280H120V360H360V280Z" fill="${color}" />
      </g>
    </svg>
  `
}
