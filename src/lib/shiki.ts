import { createHighlighter } from 'shiki'
import { bundledLanguages } from 'shiki/bundle/web'

// Singleton highlighter instance
let highlighterPromise: Promise<any> | null = null

async function getSingletonHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark', 'aurora-x', 'monokai'],
      langs: [...Object.keys(bundledLanguages)],
    })
  }
  return highlighterPromise
}

export const codeToHtml = async ({ code, language }: { code: string; language: string }) => {
  const highlighter = await getSingletonHighlighter()
  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      dark: 'github-dark',
      light: 'aurora-x',
    },
  })
}
