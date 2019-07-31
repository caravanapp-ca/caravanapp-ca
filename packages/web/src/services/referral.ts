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

export async function getReferralCount(referrerId: string) {
  const res = await axios.get<number>(`${referralRoute}/count/${referrerId}`);
  return res;
}

// Currently unused, potentially useful if we show tiers on the front-end
// export async function getReferralTiers() {
//   const res = await axios.get<ReferralTiers>(`${referralRoute}/tiers`);
//   return res;
// }
