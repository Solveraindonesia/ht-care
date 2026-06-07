import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'id'

  return {
    locale,
    messages: {
      common: (await import(`../../messages/${locale}/common.json`)).default,
      auth: (await import(`../../messages/${locale}/auth.json`)).default,
      report: (await import(`../../messages/${locale}/report.json`)).default,
      sidebar: (await import(`../../messages/${locale}/sidebar.json`)).default,
      ht: (await import(`../../messages/${locale}/ht.json`)).default,
      borrower: (await import(`../../messages/${locale}/borrower.json`)).default,
      transaction: (await import(`../../messages/${locale}/transaction.json`)).default,
      dashboard: (await import(`../../messages/${locale}/dashboard.json`)).default,
      settings: (await import(`../../messages/${locale}/settings.json`)).default
    }
  }
})
