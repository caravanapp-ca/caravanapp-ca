import axios from 'axios';
import { Services } from '@caravan/buddy-reading-types';
import { ReferralSource } from '@caravan/buddy-reading-types';
import { setCookie } from '../common/cookies';

const referralRoute = '/api/referrals';

interface ReferralParams {
  ref?: string;
  utm_source?: ReferralSource;
  utm_medium?: string;
}

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
