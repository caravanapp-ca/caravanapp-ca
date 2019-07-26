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

const validUtmSources: { [key in ReferralSource]: boolean } = {
  facebook: true,
  personal: true,
  twitter: true,
};

export async function handleReferral(referrerId: string) {
  const res = await axios.post(
    `${referralRoute}/handleReferralClick/${referrerId}`,
    {}
  );
  if (res.status === 200) {
    setCookie('compRef', 'true', 3);
  }
  return res;
}
