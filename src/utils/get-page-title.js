import defaultSettings from '@/settings'

const title = defaultSettings.title || '微应用框架'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
