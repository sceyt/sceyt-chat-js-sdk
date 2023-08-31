export default SceytChat;

declare class SceytChat {
  readonly user: User;
  readonly connectionState: ConnectionState;
  readonly settings: Settings
  readonly requestTimeout: number;
  readonly apiUrl: string;
  readonly appId: string;
  readonly accessToken: string;
  readonly clientId: string;
  enableAutoSendMessageStatusDelivered: boolean;
  consecutiveFailures: number;
  channelListeners: {[key: string]: ChannelListener};
  connectionListeners: {[key: string]: ChannelListener};

  constructor(apiUrl: string, appId: string, clientId: string, requestTimeout?: number);

  addChannelListener: (uniqueListenerId: string, channelListener: ChannelListener) => void;
  removeChannelListener: (uniqueListenerId: string) => void;
  addConnectionListener: (uniqueListenerId: string, connectionListener: ConnectionListener) => void;
  removeConnectionListener: (uniqueListenerId: string) => void;
  connect: (accessToken: string) => Promise<void | SceytChatError>;
  disconnect: () => void;
  setLogLevel: (level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent') => void;
  updateToken: (accessToken: string) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<User>;
  mute: (muteExpireTime: number) => Promise<Settings>;
  unmute: () => Promise<Settings>;
  getUsers: (usersIds: string[]) => Promise<User[]>;
  blockUsers: (usersIds: string[]) => Promise<User[]>;
  unblockUsers: (usersIds: string[]) => Promise<User[]>;
  uploadFile: (file: { data: File, progress?: (percent: number) => void }) => Promise<string>;
  getRoles: () => Promise<Role[]>;
  getChannel: (id: string) => Promise<Channel>;
  getTotalUnreads: () => Promise<{ totalUnread: number, unreadChannels: number }>;
  channelReport: (report: string, channelId: string, description?: string, messageIds?: string[]) => Promise<void>;
  messageReport: (report: string, channelId: string, messageIds: string[], description?: string) => Promise<void>;
  userReport: (report: string, userId: string, messageIds?: string[], description?: string) => Promise<void>;
  setPresence: (state: UserPresenceState, status?: string) => Promise<void>;
  getAllContacts: () => Promise<Contact[]>;
  addContactDiscoveries: (contactDiscoveries: ContactDiscovery[]) => Promise<ContactDiscovery[]>;
  deleteAllContactDiscoveries: () => Promise<void>;
  sendDirectMessage: (message: Message, userId: string) => Promise<Message>;

  Channel(): Channel
  ConnectionListener(): ConnectionListener;
  ChannelListener(): ChannelListener;
  ChannelListQueryBuilder(): ChannelListQueryBuilder;
  MemberListQueryBuilder(channelId: string): MemberListQueryBuilder;
  BlockedMemberListQueryBuilder(): BlockedMemberListQueryBuilder;
  MessageListQueryBuilder(channelId: string): MessageListQueryBuilder;
  MessageListByTypeQueryBuilder(channelId: string, type: string): MessageListByTypeQueryBuilder;
  MessageMarkerListQueryBuilder(channelId: string, messageId: string, markers: string[]): MessageMarkerListQueryBuilder;
  ReactionListQueryBuilder( messageId: string): ReactionListQueryBuilder;
  UserListQueryBuilder(): UserListQueryBuilder;
  BlockedUserListQueryBuilder(): BlockedUserListQueryBuilder;
  BlockedChannelListQuery(): BlockedChannelListQueryBuilder;
  HiddenChannelListQueryBuilder(): HiddenChannelListQueryBuilder;
  AttachmentListQueryBuilder(): AttachmentListQueryBuilder;
}

declare class ConnectionListener {
  onConnectionStateChanged: (status: ConnectionState) => void;
  onTokenWillExpire: (timeInterval: number) => void;
  onTokenExpired: () => void;
}

declare class ChannelListener {
  onCreated: (channel: Channel) => void;
  onUpdated: (channel: Channel) => void;
  onDeleted: (channelId: string) => void;
  onReceivedMessageListMarker: (channelId: string, markers: MessageListMarker[]) => void;
  onTotalUnreadCountUpdated: (channel: Channel, totalUnreadChannelCount: number, totalUnreadMessageCount: number, channelUnreadMessageCount: number, channelUnreadMentionCount, channelUnreadReactionCount) => void;
  onHidden: (channel: Channel) => void;
  onShown: (channel: Channel) => void;
  onMuted: (channel: Channel) => void;
  onUnmuted: (channel: Channel) => void;
  onBlocked: (channel: Channel) => void;
  onUnblocked: (channel: Channel) => void;
  onHistoryCleared: (channel: Channel) => void;
  onDeletedAllMessages: (channel: Channel) => void;
  onMarkedAsUnread: (channel: Channel) => void;
  onOwnerChanged: (channel: Channel, newOwner: Member, oldOwner: Member) => void;
  onMemberJoined: (channel: Channel, member: Member) => void;
  onMembersAdded: (channel: Channel, members: Member[]) => void;
  onMemberLeft: (channel: Channel, member: Member) => void;
  onMembersKicked: (channel: Channel, members: Member[]) => void;
  onMembersRoleChanged: (channel: Channel, members: Member[]) => void;
  onMembersBlocked: (channel: Channel, members: Member[]) => void;
  onMembersUnblocked: (channel: Channel, members: Member[]) => void;
  onMessage: (channel: Channel, message: Message) => void;
  onMessageEdited: (channel: Channel, user: User, message: Message) => void;
  onMessageDeleted: (channel: Channel, user: User, message: Message) => void;
  onReactionAdded: (channel: Channel, user: User, message: Message, reaction: Reaction) => void;
  onReactionDeleted: (channel: Channel, user: User, message: Message, reaction: Reaction) => void;
  onMemberStartedTyping: (channel: Channel, member: Member) => void;
  onMemberStoppedTyping: (channel: Channel, member: Member) => void;
}

declare interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  metadata: string;
  blocked: boolean;
  presence: {
    state: UserPresenceState,
    status: string,
    lastActiveAt: Date
  };
  state: 'active' | 'inactive' | "deleted"
}

declare interface Contact {
  id: string
  firstName?: string;
  lastName?: string;
  metadata?: string;
  keys: any[];
  user: User;
}

interface Channel {
  id: string;
  parentId?: string;
  uri?: string;
  type: string;
  subject?: string;
  avatarUrl?: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date | null
  messagesClearedAt: Date | null
  createdBy?: User;
  memberCount: number;
  userRole: string;
  unread: boolean;
  newMessageCount: number;
  newMentionCount: number;
  newReactedMessageCount: number;
  hidden: boolean
  archived: boolean
  muted: boolean;
  mutedTill: Date | null;
  pinnedAt: Date | null;
  lastReceivedMsgId: string;
  lastDisplayedMsgId: string;
  messageRetentionPeriod?: number
  lastMessage: Message | null;
  messages: Message[];
  members: Member[]
  newReactions: Reaction[];
  delete: () => Promise<void>;
  deleteAllMessages: (forEveryone?: boolean) => Promise<void>;
  hide: () => Promise<void>;
  unhide: () => Promise<void>;
  markAsUnRead: () => Promise<Channel>;
  markAsRead: () => Promise<Channel>;
  mute: (muteExpireTime: number) => Promise<Channel>;
  unmute: () => Promise<Channel>;
  markMessagesAsReceived: (messageIds: string[]) => Promise<MessageListMarker>;
  markMessagesAsDisplayed: (messageIds: string[]) => Promise<MessageListMarker>;
  startTyping: () => void;
  stopTyping: () => void;
  sendMessage: (message: Message) => Promise<Message>;
  editMessage: (message: Message) => Promise<Message>;
  reSendMessage: (failedMessage: Message) => Promise<Message>;
  deleteMessageById: (messageId: string) => Promise<Message>;
  deleteMessage: (message: Message) => Promise<Message>;
  addReaction: (messageId: string, key: string, score: number, reason: string, enforceUnique: boolean) => Promise<{ message: Message, reaction: Reaction }>
  deleteReaction: (messageId: string, key: string) => Promise<{ message: Message, reaction: Reaction }>
  createMessageBuilder: () => MessageBuilder;
  createAttachmentBuilder: (url: string, type: string) => AttachmentBuilder;
  createThread: (messageId: string) => Channel;
  getMessagesById: (messageIds: string[]) => Message[];
  update: (updateChannelData: UpdateChannel) => Promise<Channel>;
  join: () => Promise<Member>;
  createMemberBuilder: (id: string) => MemberBuilder;
  changeOwner: (newOwnerId: string) => Promise<Member[]>;
  changeMembersRole: (members: MemberParams[]) => Promise<Member[]>;
  addMembers: (members: MemberParams[]) => Promise<Member[]>;
  kickMembers: (memberIds: string[]) => Promise<Member[]>;
  blockMembers: (memberIds: string[]) => Promise<Member[]>;
  unBlockMembers: (memberIds: string[]) => Promise<Member[]>;
  leave: () => Promise<void>;
  block: () => Promise<void>;
  unblock: () => Promise<void>;

  create(channelData: CreateChannel): Promise<Channel>;
}

declare class MemberBuilder {
  constructor(id: string);

  setRole: (roleName: string) => this;
  create: () => Member;
}

interface Member extends User {
  role: string;
}

interface Message {
  id: string;
  tid?: number;
  channelId: string;
  parentMessage?: Message | null;
  type: string;
  state: 'unmodified' | 'edited' | 'deleted';
  deliveryStatus:  'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  transient: boolean;
  silent: boolean;
  body: string;
  metadata?: string;
  user?: User;
  mentionedUsers: User[];
  attachments: Attachment[];
  reactionTotals: ReactionTotal [];
  userReactions: Reaction[];
  markerTotals?: MarkerTotal[];
  userMarkers:  Marker[];
  forwardingDetails?: {
    channelId: string
    hops: number
    messageId: string
    user: User
  }
  replyCount?: number;
  createdAt: Date;
  updatedAt?: Date;
  autoDeleteDate?: Date
  requestedMentionUserIds?: string[];
  replyInThread?: boolean;
  incoming: boolean;

  mentionUserIds: () => string[];
}

declare class MessageBuilder {
  constructor(user: User, channelId: string);
  setBody: (text: string) => this;
  setMetadata: (metadata: string) => this;
  setType: (type: string) => this;
  setTransient: (isTransient: boolean) => this;
  setSilent: (isSilent: boolean) => this;
  setAttachments: (attachments: AttachmentParams[]) => this;
  setMentionUserIds: (userIds: string[]) => this;
  setParentMessageId: (messageId: string) => this;
  setReplyInThread: () => this;
  setForwardingMessageId: (messageId: string) => this;
  create: () => Message;
}

interface Attachment {
  id: string;
  messageId: string;
  name: string;
  type: string;
  metadata: string;
  url: string;
  size?: string;
  createdAt: Date | null
  upload: boolean
  user?: User
}

declare class AttachmentBuilder {
  url: string;
  type: string;
  name?: string;
  metadata?: string;
  upload?: boolean;

  constructor(url: string, type: string);

  setName: (name: string) => this;
  setMetadata: (metadata: string) => this;
  setUpload: (upload: boolean) => this;
  create: () => Attachment;
}

interface Reaction {
  key: string;
  score: number;
  reason: string;
  updatedAt: Date;
  user: User
}

interface ReactionTotal {
  key: string;
  score: number;
  count: number;
}

declare class QueryBuilder {
  count: number;
}

declare class UserListQueryBuilder extends QueryBuilder {
  constructor();
  limit: (count: number) => this;
  offset: (offset: number) => this;
  query: (query: string) => this;
  orderByFirstname: () => this;
  orderByLastname: () => this;
  orderByUsername: () => this;
  filterByAll: () => this;
  filterByFirstname: () => this;
  filterByLastname: () => this;
  filterByUsername: () => this;
  build: () => UsersListQuery;
}

interface UsersListQuery {
  offset: number;
  limit: number;
  hasNext: boolean;
  loading: boolean;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
}

declare class BlockedUserListQueryBuilder extends QueryBuilder {
  constructor();
  limit: (count: number) => this;
  offset: (offset: number) => this;
  build: () => BlockedUserListQuery;
}

interface BlockedUserListQuery {
  offset: number;
  limit: number;
  hasNext: boolean;
  loading: boolean;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
}

declare class ChannelListQueryBuilder extends QueryBuilder {
  type: (type: string[]) => this
  limit: (count: number) => this;
  sortByLastMessage: () => this;
  sortByCreationDate: () => this;
  uriBeginsWith: (word: string) => this;
  uriEquals: (word: string) => this;
  uriContains: (word: string) => this;
  subjectBeginsWith: (word: string) => this;
  subjectEquals: (word: string) => this;
  subjectContains: (word: string) => this;
  userBeginsWith: (word: string) => this;
  userEquals: (word: string) => this;
  userContains: (word: string) => this;
  labelEquals: (word: string) => this;
  build: () => ChannelListQuery;
}

interface ChannelListQuery {
  readonly type: string;
  readonly hasNext: boolean;
  readonly loading: boolean;
  offset: number;
  limit: number;
  readonly totalUnreadChannelCount: number;
  readonly totalUnreadMessageCount: number;
  readonly totalChannelCount;
  loadNextPage: () => Promise<{
    channels: Channel[];
    totalUnreadChannelCount: number;
    totalUnreadMessageCount: number;
    hasNext: boolean;
  }>;
}

declare class HiddenChannelListQueryBuilder extends QueryBuilder {
  limit: (limit: number) => this;
  build: () => HiddenChannelListQuery;
}

interface HiddenChannelListQuery {
  limit: number;
  hasNext: boolean;
  readonly offset: number;
  loadNextPage: () => Promise<{
    hiddenChannels: Channel[];
    hasNext: boolean;
  }>;
}

declare class BlockedChannelListQueryBuilder extends QueryBuilder {
  limit: (limit: number) => this;
  constructor();
  build: () => BlockedChannelListQuery;
}

interface BlockedChannelListQuery {
  readonly offset: number;
  limit: number;
  loadNextPage: () => Promise<{
    blockedChannels: Channel[];
    hasNext: boolean
  }>;
}

declare class MemberListQueryBuilder extends QueryBuilder {
  channelId: string;
  constructor(channelId: string);
  limit: (limit: number) => this;
  privileged: () => this;
  all: () => this;
  byAscendingOrder: () => this;
  byDescendingOrder: () => this;
  byAffiliationOrder: () => this;
  orderKeyByUsername: () => this;
  orderKeyByFirstname: () => this;
  orderKeyByLastname: () => this;
  build: () => MemberListQuery;
}

interface MemberListQuery {
  channelId: string;
  offset: number;
  limit: number;
  readonly queryType: 'All' | 'Privileged';
  readonly orderType: 'Affilation' | 'Asc' | 'Desc';
  readonly orderKey: 'Username' | 'Firstname' | 'Lastname';
  loadNextPage: () => Promise<{
    members: Member[];
    hasNext: boolean;
  }>;
}

declare class BlockedMemberListQueryBuilder extends QueryBuilder {
  channelId: string;
  i: number;
  hasNext: boolean;
  constructor(channelPartialId: string);
  limit: (count: number) => this;
  build: () => BlockedMemberListQuery;
}

interface BlockedMemberListQuery {
  channelId: string;
  index: number;
  loadNextPage: () => Promise<Member[]>;
}

declare class MessageListQueryBuilder extends QueryBuilder {
  channelId: string;
  reversed: boolean;
  searchThread: boolean;
  constructor(channelId: string);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => this;
  searchInThread: () => this;
  build: () => MessageListQuery;
}

interface MessageListQuery {
  channelId: string;
  loading: boolean;
  hasNext: boolean;
  reversed: boolean;
  limit: number;

  loadNext: () => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadNextMessageId: (messageId: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadNextTimestamp: (timeStamp: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadPrevious: () => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadPreviousMessageId: (messageId: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadPreviousTimestamp: (timeStamp: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadNear: () => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadNearMessageId: (messageId: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
  loadNearTimestamp: (timeStamp: number) => Promise<{
    messages: Message[];
    hasNext: boolean;
  }>;
}

declare class MessageListByTypeQueryBuilder extends QueryBuilder {
  constructor(channelId: string, type: string);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => void;
  build: () => MessageListByTypeQuery;
}

interface MessageListByTypeQuery {
  channelId: string;
  readonly type: string;
  reverse: boolean;
  loading: boolean;
  hasNext: boolean;
  limit: number;

  loadNext: () => Promise<{
    messages: Message[];
    complete: boolean;
  }>;
  loadNextMessageId: (messageId: string) => Promise<{
    messages: Message[];
    complete: boolean;
  }>;
  loadNextTimestamp: (timestamp: number) => Promise<{
    messages: Message[];
    complete: boolean;
  }>;
}

declare class MessageMarkerListQueryBuilder extends QueryBuilder {
  constructor(channelId: string, messageId: string, markers: string[]);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => void;
  build: () => MessageMarkerListQuery;
}

interface MessageMarkerListQuery {
  readonly channelId: string;
  readonly messageId: string;
  readonly markers: string[];
  reverse: boolean;
  loading: boolean;
  hasNext: boolean;
  limit: number;

  loadNext: () => Promise<{ markers: MessageMarker[], hasNext: boolean }>;
}

declare class AttachmentListQueryBuilder extends QueryBuilder {
  channelId: string;
  reversed: boolean;
  searchThread: boolean;
  attachmentTypes: string[];
  constructor(channelId: string, attachmentTypes: string[]);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => this;
  searchInThread: () => this;
  build: () => AttachmentListQuery;
}

interface AttachmentListQuery {
  channelId: string;
  loading: boolean;
  hasNext: boolean;
  reversed: boolean;
  attachmentTypes: string[];
  limit: number;

  loadNext: () => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadNextAttachmentId: (attachmentId: string) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadNextTimestamp: (timeStamp: number) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadPrevious: () => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadPreviousAttachmentId: (attachmentId: string) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadPreviousTimestamp: (timeStamp: number) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadNear: () => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadNearAttachmentId: (attachmentId: string) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
  loadNearTimestamp: (timeStamp: number) => Promise<{
    messages: Attachment[];
    hasNext: boolean;
  }>;
}

declare class ReactionListQueryBuilder extends QueryBuilder {
  constructor( messageId: string);
  limit: (limit: number) => this;
  setKey: (key: string) => this;
  build: () => ReactionListQuery;
}

interface ReactionListQuery {
  readonly messageId: string;
  readonly reactionKey: boolean;
  readonly hasNext: boolean;
  limit: number;

  loadNext: () => Promise<{ reactions: Reaction[], hasNext: boolean }>;
  loadNextReactionId: (reactionId: string) => Promise<{ reactions: Reaction[], hasNext: boolean }>;
}

export interface Settings {
  muted: boolean;
  muteExpireDate: Date | null;
  uploadSizeLimit: number
}

export declare type UploadProgress = (progressPercent: number) => void;
export declare type UploadCompletion = (attachment: Attachment, err: SceytChatError) => void;

interface ContactDiscovery {
  key: string
  firstName?: string;
  lastName?: string
  metadata?: string
}
interface MemberParams {
  role: string;
  id: string;
}

interface CreateChannel {
  type: string
  members: Member[];
  subject: string;
  metadata: string;
  avatarUrl: string;
  label: string;
  uri: string;
}

export interface UpdateChannel {
  subject: string;
  metadata: string;
  avatarUrl: string;
  label: string;
  uri: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  metadata?: string;
}

interface AttachmentParams {
  uploadedFileSize?: number;
  data?: File;
  metadata?: string;
  name?: string;
  type: string;
  url?: string;
  upload: boolean;
  progress?: UploadProgress;
  completion?: UploadCompletion;
}

interface Role {
  name: string
  permissions: string[]
  priority: number
}

interface MessageMarker {
  messageId: string;
  user: User;
  name: string;
  createAt: Date
}

interface MessageListMarker {
  messageIds: string[];
  user: User;
  name: string;
  createAt: Date
}

interface MarkerTotal {
  name: string;
  count: Date
}

interface Marker {
  name: string;
  messageId: string;
  createdAt: Date;
  user: User | null
}

type ConnectionState = 'Connecting' | 'Connected' | 'Disconnected' | 'Failed' | 'Reconnecting'

type UserPresenceState = 'offline' | 'online' | 'invisible' | 'away' | 'dnd'

interface SceytChatError extends Error{
  message: string,
  code: number
}
