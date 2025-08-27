import { headers } from 'next/headers';
export const getData = async () => {
  const header = await headers();
  const ip1=header.get('x-forwarded-for');
  const ip2=header.get('x-vercel-ip');
  const uag=header.get('user-agent')
  const date=header.get('date')
  return {ip1, ip2, uag, date};
};