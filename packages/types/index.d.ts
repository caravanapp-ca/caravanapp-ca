import { GuildMember } from 'discord.js';
import { Document, Types as MongooseTypes } from 'mongoose';
import { Omit } from 'utility-types';

declare module '@caravan/buddy-reading-types' {
  export type FilterAutoMongoKeys<Base> = Omit<
    Base,
    'createdAt' | 'updatedAt' | '__v' | '_id'
  >;
  // TODO: Improve by nesting the SameKeysAs
  export type SameKeysAs<Base> = { [Key in keyof Base]: any };

  export interface DocumentFields {
    _id: string;
    __v?: number;
  }

  export interface MongoTimestamps {
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  export interface Discussion {
    date: Date;
    label: string;
    format: 'text' | 'voice' | 'video';
  }

  export interface ClubReadingSchedule extends DocumentFields, MongoTimestamps {
    shelfEntryId: string;
    startDate: Date | null;
    duration: number | null;
    discussionFrequency: number | null;
    discussions: Discussion[];
  }

  export interface Club extends DocumentFields, MongoTimestamps {
    name: string;
    ownerId: string;
    ownerDiscordId?: string;
    shelf: ShelfEntry[];
    schedules: ClubReadingSchedule[];
    bio?: string;
    members: User[];
    maxMembers: number;
    vibe?: GroupVibe;
    readingSpeed?: ReadingSpeed;
    genres: SelectedGenre[];
    channelSource: ChannelSource;
    channelId: string;
    unlisted: boolean;
  }

  // This format of the Club has the current book, schedule, and owner extracted for quicker access.
  export interface ClubTransformed {
    club: Services.GetClubs['clubs'][0];
    currentlyReading: ShelfEntry | null;
    schedule: ClubReadingSchedule | null;
  }

  export interface ClubWithMemberIds {
    club: Services.GetClubById;
    memberIds: string[];
  }

  export interface GroupMember extends DocumentFields, MongoTimestamps {
    userId: string;
    role: string;
  }

  export interface Session extends DocumentFields {
    accessToken: string;
    /** Milliseconds since January 1st, 1970 (use Date.now() to get current value) */
    accessTokenExpiresAt: number;
    refreshToken: string;
    scope: string;
    tokenType: 'Bearer';
    client: string;
    userId: string;
  }

  export interface ShelfEntry extends DocumentFields, MongoTimestamps {
    sourceId: string;
    source: BookSource;
    isbn?: string;
    readingState: ReadingState;
    startedReading?: Date;
    finishedReading?: Date;
    title: string;
    author?: string;
    publishedDate?: string;
    coverImageURL?: string;
    genres: string[];
    amazonLink?: string;
  }

  export interface UserShelfEntry extends Omit<ShelfEntry, 'readingState'> {
    readingState: ReadingState;
    clubId?: string;
    club?: Services.GetClubs['clubs'][0];
  }

  export type UserShelfType = { [K in ReadingState]: UserShelfEntry[] };

  export interface SelectedGenre {
    key: string;
    name: string;
  }

  export interface User extends DocumentFields, MongoTimestamps {
    bio?: string;
    discordId: string;
    discordUsername?: string;
    goodreadsUrl?: string;
    website?: string;
    name?: string;
    photoUrl?: string;
    smallPhotoUrl?: string;
    readingSpeed?: ReadingSpeed;
    age?: number;
    gender?: string;
    location?: string;
    isBot: boolean;
    urlSlug: string;
    selectedGenres: SelectedGenre[];
    questions: UserQA[];
    shelf: { [key in UserShelfReadingState]: UserShelfEntry[] };
    onboardingVersion: number;
    palette: PaletteObject | null;
    badges: UserBadge[];
  }

  export interface UserBadge {
    key: string;
    name: string;
    awardedOn: Date;
    description?: string;
  }

  export interface Badge {
    key: string;
    name: string;
    description?: string;
  }

  export interface Badges extends DocumentFields {
    badgeKeys: string[];
    badges: {
      [key: string]: Badge;
    };
  }

  export interface UserWithInvitableClubs {
    user: User;
    invitableClubs: ClubWithMemberIds[];
  }

  export interface Genres {
    _id: string;
    mainGenres: string[];
    genres: {
      [key: string]: Genre;
    };
  }

  export interface Genre extends DocumentFields {
    key: string;
    name: string;
    subgenres: string[];
  }

  export interface UserQA {
    id: string;
    title: string;
    answer: string;
    userVisible: boolean;
    sort: number;
  }

  export interface ProfileQuestions {
    _id: string;
    questions: ProfileQuestion[];
  }

  export interface ProfileQuestion extends DocumentFields {
    id: string;
    title: string;
    subtitle: string;
    required: boolean;
    min: number;
    max: number;
  }

  export interface UserReferredAction {
    action: ReferralAction;
    timestamp: Date | string;
  }

  export interface ReferralTier {
    tierNumber: number;
    referralCount?: number;
    title: string;
    badgeKey?: string;
    discordRole?: string;
  }

  export interface ReferralTiers {
    tiers: ReferralTier[];
  }

  export interface ReferredUser {
    referredUserId: string;
    timestamp: Date | string;
  }

  export interface Referral extends DocumentFields, MongoTimestamps {
    userId: string;
    referredUsers: ReferredUser[];
    actions: UserReferredAction[];
    referralCount: number;
    referredById?: string;
    source: ReferralSource;
    referralDestination: ReferralDestination;
    referredAndNotJoined: boolean;
  }

  export interface Referrals {
    _id: string;
    referrals: Referral[];
  }

  export interface FilterChip {
    type: FilterChipType;
    name: string;
    key: string;
  }

  export interface ActiveFilter {
    genres: FilterChip[];
    speed: FilterChip[];
    capacity: FilterChip[];
    membership: FilterChip[];
  }

  export type PaletteSet = 'colour' | 'nature' | 'quote';

  export interface PaletteObject {
    // id refers to the unique identifier
    id: string;
    // key refers to the primary colour
    key: string;
    textColor: 'primary' | 'white';
    bgImage?: string;
    set?: PaletteSet;
    // Use this attribute to set which portion of the bgImage displays on mobile
    // Will default to center if not provided.
    mobileAlignment?: 'left' | 'center' | 'right';
  }

  export interface EmailSettings {
    reminders: boolean;
    recs: boolean;
    updates: boolean;
    // Type signature for indexing
    [key: string]: boolean;
  }

  export interface UserSettings extends DocumentFields, MongoTimestamps {
    userId: string;
    emailSettings: EmailSettings;
    email?: string;
  }

  export interface UserPalettes extends DocumentFields, MongoTimestamps {
    userId: string;
    hasSets?: PaletteSet[];
    hasIndividuals?: string[];
  }

  export type EditableUserField =
    | 'bio'
    | 'goodreadsUrl'
    | 'website'
    | 'name'
    | 'photoUrl'
    | 'readingSpeed'
    | 'age'
    | 'gender'
    | 'location'
    | 'selectedGenres'
    | 'questions'
    | 'shelf'
    | 'palette';

  export type BookSource =
    | 'google'
    | 'wattpad'
    | 'amazon'
    | 'goodreads'
    | 'custom'
    | 'unknown';

  export type ChannelSource = 'discord';

  export type MembershipStatus = 'notMember' | 'member' | 'owner';

  export type LoadableMemberStatus = MembershipStatus | 'loading';

  export type UserShelfReadingState = 'notStarted' | 'read';

  export type ReadingState = 'notStarted' | 'current' | 'read';

  export type CurrBookAction = ReadingState | 'delete';

  export type ReadingSpeed = 'slow' | 'moderate' | 'fast';

  export type Capacity = 'full' | 'spotsAvailable';

  export type Membership = 'myClubs' | 'clubsImNotIn';

  export type FilterChipType = 'genres' | 'speed' | 'capacity' | 'membership';

  export type ReferralAction =
    | 'click'
    | 'login'
    | 'onboarded'
    | 'joinClub'
    | 'createClub';

  export type ReferralSource =
    | 'fb'
    | 'tw'
    | 'gr'
    | 'em'
    | 'rd'
    | 'cpp'
    | 'cph'
    | 'cpc';

  export type ReferralDestination = 'home' | 'club';

  export type GroupVibe =
    | 'chill'
    | 'power'
    | 'learning'
    | 'first-timers'
    | 'nerdy';

  // Don't use this... I did what I do had to do - Matt C.
  export interface ClubWUninitSchedules
    extends Omit<Services.GetClubById, 'schedules'> {
    schedules: (
      | ClubReadingSchedule
      | FilterAutoMongoKeys<ClubReadingSchedule>)[];
  }

  export namespace Services {
    export interface GetClubs {
      clubs: {
        _id: string;
        name: string;
        ownerId: string;
        ownerName: string;
        guildId: string;
        shelf: ShelfEntry[];
        schedules: ClubReadingSchedule[];
        bio?: string;
        maxMembers: number;
        memberCount: number;
        vibe?: GroupVibe;
        readingSpeed?: ReadingSpeed;
        genres: SelectedGenre[];
        channelSource?: ChannelSource;
        channelId: string;
        createdAt: string;
        updatedAt: string;
        unlisted: boolean;
      }[];
    }
    export interface GetClubById {
      _id: string;
      name: string;
      ownerId: string;
      ownerDiscordId: string;
      shelf: ShelfEntry[];
      schedules: ClubReadingSchedule[];
      bio: string;
      members: User[];
      maxMembers: number;
      vibe: GroupVibe;
      readingSpeed: ReadingSpeed;
      genres: SelectedGenre[];
      guildId: string;
      channelSource: ChannelSource;
      channelId: string;
      createdAt: string;
      updatedAt: string;
      unlisted: boolean;
    }
    export interface CreateClubResult {
      club: Club;
      discord: any;
    }
    export interface GetGenres extends Omit<Genres, '_id'> {}
    export interface ReadingPreferencesResult {
      genres: string[];
      readingSpeed: string;
    }
    export interface GetProfileQuestions
      extends Omit<ProfileQuestions, '_id'> {}

    export interface GetReferrals extends Omit<Referrals, '_id'> {}

    export interface GetUsers {
      users: {
        _id: string;
        bio?: string;
        discordId: string;
        discordUsername?: string;
        goodreadsUrl?: string;
        website?: string;
        name?: string;
        photoUrl?: string;
        smallPhotoUrl?: string;
        readingSpeed?: ReadingSpeed;
        age?: number;
        gender?: string;
        location?: string;
        isBot: boolean;
        urlSlug: string;
        selectedGenres: SelectedGenre[];
        questions: UserQA[];
        shelf: { [key in UserShelfReadingState]: UserShelfEntry[] };
        onboardingVersion: number;
        palette: PaletteObject | null;
        badges: UserBadge[];
        createdAt: string;
        updatedAt: string;
      }[];
    }
  }

  export namespace GoogleBooks {
    // Generated by https://quicktype.io
    //
    // To change quicktype's target language, run command:
    //
    //   "Set quicktype target language"

    export interface Books {
      kind: string;
      totalItems: number;
      items: Item[];
    }

    export interface Item {
      kind: Kind;
      id: string;
      etag: string;
      selfLink: string;
      volumeInfo: VolumeInfo;
      saleInfo: SaleInfo;
      accessInfo: AccessInfo;
      searchInfo?: SearchInfo;
    }

    export interface AccessInfo {
      country: Country;
      viewability: Viewability;
      embeddable: boolean;
      publicDomain: boolean;
      textToSpeechPermission: TextToSpeechPermission;
      epub: Epub;
      pdf: Epub;
      webReaderLink: string;
      accessViewStatus: AccessViewStatus;
      quoteSharingAllowed: boolean;
    }

    export enum AccessViewStatus {
      FullPublicDomain = 'FULL_PUBLIC_DOMAIN',
      Sample = 'SAMPLE',
    }

    export enum Country {
      CA = 'CA',
    }

    export interface Epub {
      isAvailable: boolean;
      downloadLink?: string;
      acsTokenLink?: string;
    }

    export enum TextToSpeechPermission {
      Allowed = 'ALLOWED',
      AllowedForAccessibility = 'ALLOWED_FOR_ACCESSIBILITY',
    }

    export enum Viewability {
      AllPages = 'ALL_PAGES',
      Partial = 'PARTIAL',
    }

    export enum Kind {
      BooksVolume = 'books#volume',
    }

    export interface SaleInfo {
      country: Country;
      saleability: Saleability;
      isEbook: boolean;
      buyLink?: string;
      listPrice?: SaleInfoListPrice;
      retailPrice?: SaleInfoListPrice;
      offers?: Offer[];
    }

    export interface SaleInfoListPrice {
      amount: number;
      currencyCode: string;
    }

    export interface Offer {
      finskyOfferType: number;
      listPrice: OfferListPrice;
      retailPrice: OfferListPrice;
      giftable: boolean;
    }

    export interface OfferListPrice {
      amountInMicros: number;
      currencyCode: string;
    }

    export enum Saleability {
      ForSale = 'FOR_SALE',
      Free = 'FREE',
      NotForSale = 'NOT_FOR_SALE',
    }

    export interface SearchInfo {
      textSnippet: string;
    }

    export interface VolumeInfo {
      title: string;
      authors: string[];
      publishedDate: string;
      industryIdentifiers: IndustryIdentifier[];
      readingModes: ReadingModes;
      pageCount?: number;
      printType: PrintType;
      maturityRating: MaturityRating;
      allowAnonLogging: boolean;
      contentVersion: string;
      panelizationSummary?: PanelizationSummary;
      imageLinks: ImageLinks;
      language: Language;
      previewLink: string;
      infoLink: string;
      canonicalVolumeLink: string;
      publisher?: string;
      description?: string;
      categories?: string[];
      averageRating?: number;
      ratingsCount?: number;
      subtitle?: string;
    }

    export interface ImageLinks {
      smallThumbnail: string;
      thumbnail: string;
    }

    export interface IndustryIdentifier {
      type: Type;
      identifier: string;
    }

    export enum Type {
      Isbn10 = 'ISBN_10',
      Isbn13 = 'ISBN_13',
      Other = 'OTHER',
    }

    export enum Language {
      En = 'en',
    }

    export enum MaturityRating {
      NotMature = 'NOT_MATURE',
    }

    export interface PanelizationSummary {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    }

    export enum PrintType {
      Book = 'BOOK',
    }

    export interface ReadingModes {
      text: boolean;
      image: boolean;
    }
  }
}
