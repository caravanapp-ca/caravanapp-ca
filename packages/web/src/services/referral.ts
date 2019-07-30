import axios from 'axios';
import { setCookie } from '../common/cookies';

const referralRoute = '/api/referrals';

export async function handleReferral(
  referrerId: string,
  utmSource: string | undefined | null
) {
  const res = await axios.post(
    `${referralRoute}/handleReferralClick/${referrerId}`,
    {
      utmSource,
    }
  );
  if (res.status === 200) {
    setCookie('refClickComplete', 'true', 3);
  }
  return res;
}
