import { getCookiesName } from '@/backend/helpers';
import NewVariationOptimized from '@/components/admin/NewVariationOptimized';
import { cookies } from 'next/headers';

const NewProductPage = () => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const currentCookies = `${cookieName}=${nextAuthSessionToken?.value}`;

  return <NewVariationOptimized currentCookies={currentCookies} />;
};

export default NewProductPage;
