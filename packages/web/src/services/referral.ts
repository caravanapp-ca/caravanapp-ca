import axios from 'axios';
import {
  Referral,
  ReferralSource,
  ReferralTiers,
} from '@caravan/buddy-reading-types';
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

export async function getUserReferrals(referrerId: string) {
  const res = await axios.get<Referral>(`${referralRoute}/${referrerId}`);
  return res;
}

export async function getReferralTiers() {
  const res = await axios.get<ReferralTiers[]>(`${referralRoute}/tiers`);
  return res;
}
