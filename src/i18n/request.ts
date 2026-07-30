import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to read from accept-language or cookie, default to 'en'
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const defaultLocale = acceptLanguage?.includes('ar') ? 'ar' : 'en';

  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
