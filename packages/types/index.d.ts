import { Omit } from 'utility-types';
import { CLUB_BOT_SETTINGS_KEYS_DESCRIPTIONS } from '../web/src/common/globalConstants';

declare module '@caravan/buddy-reading-types' {
  export type FilterAutoMongoKeys<Base> = Omit<
    Base,
    'createdAt' | 'updatedAt' | '__v' | '_id'
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type SameKeysAs<Base> = { [Key in keyof Base]: any };

  export interface DocumentFields {
    _id: string;
    __v?: number;
  }

  export interface MongoTimestamps {
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  export type ClubScheduleEvent = 'startDate' | 'endDate' | 'discussionDate';

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

  export interface ClubBotSettings {
    intros: boolean;
    // Index signature for iterating
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  export interface Club extends DocumentFields, MongoTimestamps {
    bio?: string;
    botSettings: ClubBotSettings;
    channelId: string;
    channelSource: ChannelSource;
    genres: SelectedGenre[];
    maxMembers: number;
    members: User[];
    name: string;
    newShelf: ClubShelf;
    ownerId: string;
    ownerDiscordId?: string;
    readingSpeed?: ReadingSpeed;
    schedules: ClubReadingSchedule[];
    shelf?: ShelfEntry[];
    unlisted: boolean;
    vibe?: GroupVibe;
  }

  // This format of the Club has the current schedule extracted for quicker access, and a reason for recommendation, if any.
  export interface ClubTransformed {
    club: Services.GetClubs['clubs'][0];
    schedule?: ClubReadingSchedule | null;
    recommendation?: ClubRecommendation;
    isMember?: boolean;
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
    client: OAuth2Client;
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

  export interface UserShelfEntry extends ShelfEntry {
    clubId?: string;
    club?: Services.GetClubs['clubs'][0];
  }

  export type UserShelfType = {
    [K in UserShelfReadingState]: UserShelfEntry[];
  };

  interface UserShelf extends UserShelfType {
    current?: UserShelfEntry[];
  }

  export type ClubShelf = { [K in ReadingState]: ShelfEntry[] };

  export type UninitClubShelfType = {
    [K in ReadingState]: FilterAutoMongoKeys<ShelfEntry>[];
  };

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
    shelf: UserShelf;
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
    profileBgSets: PaletteSet[];
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

  export interface Post extends DocumentFields, MongoTimestamps {
    authorId: string;
    content: PostContent;
  }

  export interface PostUserInfo {
    userId: string;
    name: string;
    urlSlug: string;
    photoUrl: string;
    discordId: string;
  }

  export interface PostWithAuthorInfoAndLikes {
    post: Post;
    authorInfo: PostUserInfo;
    likes: PostUserInfo[];
    likeUserIds: string[];
    numLikes: number;
  }

  export interface ShelfPost {
    postType: 'shelf';
    shelf: FilterAutoMongoKeys<ShelfEntry>[];
    title: string;
    description?: string;
    genres?: SelectedGenre[];
    interests?: Interest[];
  }

  export interface ProgressUpdatePost {
    postType: 'progressUpdate';
    book: FilterAutoMongoKeys<ShelfEntry>;
    progressUpdateType: ProgressUpdateType;
    containsSpoiler: boolean;
    description: string;
  }

  export interface WantToReadAboutPost {
    postType: 'wantToReadAbout';
    genres?: SelectedGenre[];
    interests?: Interest[];
    description: string;
  }

  export interface Interest {
    key: string;
    name: string;
    imageUrl?: string;
  }

  // Key will be the post id
  export interface Likes extends DocumentFields, MongoTimestamps {
    postId: string;
    likes: string[];
    numLikes: number;
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
    // Index signature for iterating
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

  export type ClubRecommendationKey =
    | 'currReadTBR'
    | 'tBRMatch'
    | 'genreMatch'
    | 'new';

  export interface ClubRecommendation {
    key: ClubRecommendationKey;
    description: string;
  }

  export interface ClubWithRecommendation {
    club: Services.GetClubs['clubs'][0];
    recommendation: ClubRecommendation;
    tbrMatches: UserShelfEntry[];
    genreMatches: SelectedGenre[];
    isMember: boolean;
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

  export type OAuth2Client = 'discord' | 'discordBot';

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

  export type UserSearchField = 'bookTitle' | 'bookAuthor' | 'username';

  export type PostSearchField = 'bookTitle' | 'bookAuthor' | 'postTitle';

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

  export type PostType = 'shelf' | 'progressUpdate' | 'wantToReadAbout';

  export type LikeAction = 'like' | 'unlike';

  export type PostContent =
    | ShelfPost
    | ProgressUpdatePost
    | WantToReadAboutPost;

  export type ProgressUpdateType =
    | 'starting'
    | 'chapterUpdate'
    | 'plotUpdate'
    | 'finished';

  export type GroupVibe =
    | 'chill'
    | 'power'
    | 'learning'
    | 'first-timers'
    | 'nerdy';

  export type UnlimitedClubMembersValue = -1;

  // Don't use this... I did what I do had to do - Matt C.
  export interface ClubWUninitSchedules
    extends Omit<Services.GetClubById, 'schedules'> {
    schedules: (
      | ClubReadingSchedule
      | FilterAutoMongoKeys<ClubReadingSchedule>)[];
  }

  /** Google Cloud Pub/Sub and Functions */

  export namespace PubSub {
    export type Topic = 'club-membership';

    export namespace Message {
      export interface ClubMembershipChange {
        clubId: string;
        clubMembership: 'joined' | 'left';
        userId: string;
      }
    }
  }

  export namespace Firestore {
    export type CollectionName =
      /** The Document ID is the pub/sub eventId */
      'discordBotMessages';
  }

  export namespace Services {
    export interface GetClubs {
      clubs: {
        _id: string;
        bio?: string;
        botSettings: ClubBotSettings;
        channelId: string;
        channelSource?: ChannelSource;
        createdAt: string;
        genres: SelectedGenre[];
        guildId: string;
        maxMembers: number;
        memberCount: number;
        name: string;
        newShelf: ClubShelf;
        ownerId: string;
        ownerName: string;
        readingSpeed?: ReadingSpeed;
        schedules: ClubReadingSchedule[];
        shelf?: ShelfEntry[];
        unlisted: boolean;
        updatedAt: string;
        vibe?: GroupVibe;
      }[];
    }
    export interface GetClubById {
      _id: string;
      bio: string;
      botSettings: ClubBotSettings;
      channelId: string;
      channelSource: ChannelSource;
      createdAt: string;
      genres: SelectedGenre[];
      guildId: string;
      maxMembers: number;
      members: User[];
      name: string;
      newShelf: ClubShelf;
      ownerDiscordId: string;
      ownerId: string;
      readingSpeed: ReadingSpeed;
      schedules: ClubReadingSchedule[];
      shelf?: ShelfEntry[];
      unlisted: boolean;
      updatedAt: string;
      vibe: GroupVibe;
    }
    export interface CreateClubProps {
      bio: string;
      botSettings: ClubBotSettings;
      channelSource: ChannelSource;
      genres: SelectedGenre[];
      maxMembers: number;
      name: string;
      newShelf?: UninitClubShelfType;
      readingSpeed: ReadingSpeed;
      unlisted: boolean;
      usersToInviteIds: string[];
      currUser: User | null;
      vibe: string;
    }
    export interface CreateClubResult {
      club: Club;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      discord: any;
    }
    export interface UploadPostResult {
      post: Post;
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
        shelf: UserShelf;
        onboardingVersion: number;
        palette: PaletteObject | null;
        badges: UserBadge[];
        createdAt: string;
        updatedAt: string;
      }[];
    }
    export interface GetPosts {
      posts: {
        _id: string;
        createdAt: string;
        updatedAt: string;
        authorId: string;
        content: PostContent;
      }[];
    }
    export interface GetPostsWithAuthorInfoAndLikes {
      posts: {
        post: Post;
        authorInfo: PostUserInfo;
        likes: PostUserInfo[];
        likeUserIds: string[];
        numLikes: number;
      }[];
    }
  }

  export namespace GoogleBooks {
    // Generated by https://quicktype.io
    // Modified to change enums to types

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

    export type AccessViewStatus = 'FULL_PUBLIC_DOMAIN' | 'SAMPLE';

    export type Country = 'CA';

    export interface Epub {
      isAvailable: boolean;
      downloadLink?: string;
      acsTokenLink?: string;
    }

    export type TextToSpeechPermission =
      | 'ALLOWED'
      | 'ALLOWED_FOR_ACCESSIBILITY';

    export type Viewability = 'ALL_PAGES' | 'PARTIAL';

    export type Kind = 'books#volume';

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

    export type Saleability = 'FOR_SALE' | 'FREE' | 'NOT_FOR_SALE';

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

    export type Type = 'ISBN_10' | 'ISBN_13' | 'OTHER';

    export type Language = 'en';

    export type MaturityRating = 'NOT_MATURE';

    export interface PanelizationSummary {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    }

    export type PrintType = 'BOOK';

    export interface ReadingModes {
      text: boolean;
      image: boolean;
    }
  }
}
