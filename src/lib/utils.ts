import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Replace the first path segment of a URL with a new value
 * @param href
 * @param teamId
 * @param entry - If true, the returned url will be an entry url
 * @returns
 */
export function replaceTeamId(href: string, teamId: string, entry?: boolean) {
  const currentUrl = new URL(href)
  const pathSegments = currentUrl.pathname.split('/')
  pathSegments[1] = teamId // Replace the first path segment with the activeTeamId
  if (entry) {
    // Remove all segments after the first one
    pathSegments.length = 3
  }
  return pathSegments.join('/')
}

/**
 * Takes a timestamp and returns a human-readable string
 * @param timestamp
 * @returns string
 */
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  }
  return date.toLocaleDateString('en-US', options)
}

/**
 * A promise that will resolve after a predefined amount of time
 * @param time A timeout in milliseconds
 */
export async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Done waiting')
    }, time)
  })
}
