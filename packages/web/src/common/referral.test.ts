import { getCurrReferralTier } from './referral';
import { ReferralTiers } from '@caravanapp/types';

const tiers: ReferralTiers = {
  tiers: [
    {
      tierNumber: 1,
      referralCount: 3,
      title: 'Wanderer',
      badgeKey: 'ref1',
      discordRole: '605424217026199573',
    },
    {
      tierNumber: 2,
      referralCount: 5,
      title: 'Traveller',
      badgeKey: 'ref2',
      discordRole: '605424678198312980',
    },
    {
      tierNumber: 3,
      referralCount: 10,
      title: 'Explorer',
      badgeKey: 'ref3',
      discordRole: '605424863267782697',
    },
    {
      tierNumber: 4,
      referralCount: 20,
      title: 'Adventurer',
      badgeKey: 'ref4',
      discordRole: '605424952656658432',
    },
    {
      tierNumber: 5,
      referralCount: 30,
      title: 'Trailblazer',
      badgeKey: 'ref5',
      discordRole: '605425124207755264',
    },
  ],
};

const findTier = (tierNum: number) =>
  tiers.tiers.find(t => t.tierNumber === tierNum) || null;

const countsToCheck = [
  { count: 0, expectedTier: findTier(0) },
  { count: 1, expectedTier: findTier(0) },
  { count: 2, expectedTier: findTier(0) },
  { count: 3, expectedTier: findTier(1) },
  { count: 4, expectedTier: findTier(1) },
  { count: 5, expectedTier: findTier(2) },
  { count: 6, expectedTier: findTier(2) },
  { count: 9, expectedTier: findTier(2) },
  { count: 10, expectedTier: findTier(3) },
  { count: 11, expectedTier: findTier(3) },
  { count: 29, expectedTier: findTier(4) },
  { count: 30, expectedTier: findTier(5) },
  { count: 31, expectedTier: findTier(5) },
  { count: 20000, expectedTier: findTier(5) },
];

it('gets the correct tier from your current tier', () => {
  countsToCheck.forEach(countToCheck => {
    const user1Result = getCurrReferralTier(countToCheck.count, tiers);
    if (countToCheck.expectedTier) {
      expect(user1Result).not.toBeNull();
      expect(user1Result!.tierNumber).toEqual(
        countToCheck.expectedTier.tierNumber
      );
    } else {
      expect(user1Result).toBeNull();
    }
  });
});
