// Development email helper - prints to console instead of sending
export function logMagicLinkInDev(to: string, magicLink: string) {
  console.log('\n=================================')
  console.log('🔗 MAGIC LINK (DEV MODE)')
  console.log('=================================')
  console.log('To:', to)
  console.log('Link:', magicLink)
  console.log('=================================\n')
}

export function logCourseEmailInDev(
  to: string,
  emailNumber: number,
  subject: string,
  content: string
) {
  console.log('\n=================================')
  console.log(`📧 COURSE EMAIL #${emailNumber} (DEV MODE)`)
  console.log('=================================')
  console.log('To:', to)
  console.log('Subject:', subject)
  console.log('Content:', content.substring(0, 200) + '...')
  console.log('=================================\n')
}
