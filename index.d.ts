export default SceytChat;

declare class SceytChat {
  chatClient: ChatClient;
  clientId: string;
  constructor(apiUrl: string, appId: string, clientId: string, connectionTimeout?: number);
  ConnectionListener(): ConnectionListener;
  ChannelListener(): ChannelListener;
  user: User;
  addChannelListener: (uniqueListenerId: string, channelListener: ChannelListener) => void;
  removeChannelListener: (uniqueListenerId: string) => void;
  addConnectionListener: (uniqueListenerId: string, connectionListener: ConnectionListener) => void;
  removeConnectionListener: (uniqueListenerId: string) => void;
  connect: (jwt: string) => Promise<void | SceytChatError>;
  disconnect: () => void;
}

declare class ChatClient {
  user: User;
  connectStatus: string;
  readonly settings: ISettings

  connectionTimeout: number;
  appId: string;
  authToken: string;
  clientId: string;
  connectUrl: string;
  enableAutoSendMessageStatusDelivered: boolean;
  channelListeners: ChannelListener;
  connectionListeners: ConnectionListener;
  setLogLevel: (level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent') => void;
  updateToken: (jwt: string) => Promise<unknown>;
  setProfile: (profile: IUserProfile) => Promise<User>;
  mute: (muteExpireTime: number) => Promise<ISettings>;
  unmute: () => Promise<ISettings>;
  getUsers: (usersIds: string[]) => Promise<User[]>;
  blockUsers: (usersIds: string[]) => Promise<User[]>;
  unblockUsers: (usersIds: string[]) => Promise<User[]>;
  uploadFile: (file: { data: File, progress?: (percent: number) => void }) => Promise<string>;
  getRoles: () => Promise<string[]>;
  getChannel: (id: string) => Promise<Channel>;
  getTotalUnreads: () => Promise<{ totalUnread: number, unreadChannels: number }>;
  consecutiveFailures: number;
  PublicChannel: PublicChannel;
  PrivateChannel: PrivateChannel;
  DirectChannel: DirectChannel;
  authState: 'NOT_AUTHENTICATED' | 'HTTP_AUTH_FAILED' | 'SOCKET_AUTH_FAILED' | 'HTTP_AUTHENTICATING'
      | 'SOCKET_AUTHENTICATING' | 'HTTP_AUTHENTICATED' | 'SOCKET_AUTHENTICATED' | 'AUTHENTICATED' | 'CONNECTION_TIMEOUT';
  channelReport(report: string, channelId: string, description?: string, messageIds?: string[]): Promise<void>;
  messageReport(report: string, channelId: string, messageIds: string[], description?: string): Promise<void>;
  userReport(report: string, userId: string, messageIds?: string[], description?: string): Promise<void>;
  setPresence(state: 'Offline' | 'Online' | 'Invisible' | 'Away' | 'DND', status?: string): Promise<void>;
  ChannelListQueryBuilder(): ChannelListQueryBuilder;
  MemberListQueryBuilder(channelId: string): MemberListQueryBuilder;
  BlockedMemberListQueryBuilder(): BlockedMemberListQueryBuilder;
  MessageListQueryBuilder(channelId: string): MessageListQueryBuilder;
  MessageListByTypeQueryBuilder(channelId: string, type: string): MessageListByTypeQueryBuilder;
  MessageMarkerListQueryBuilder(channelId: string, messageId: string, markers: string[]): MessageMarkerListQueryBuilder;
  UserListQueryBuilder(): UserListQueryBuilder;
  BlockedUserListQueryBuilder(): BlockedUserListQueryBuilder;
  BlockedChannelListQuery(): BlockedChannelListQueryBuilder;
  HiddenChannelListQueryBuilder(): HiddenChannelListQueryBuilder;
  AttachmentListQueryBuilder(): AttachmentListQueryBuilder;
}

interface SceytChatError extends Error{
  message: string,
  code: number
}

interface ICreatePublicChannel {
  members: IMemberParams[];
  metadata?: string;
  subject: string;
  avatarUrl?: string;
  label?: string;
  uri: string;
}

interface ICreatePrivateChannel {
  members: IMemberParams[];
  metadata?: string;
  subject: string;
  avatarUrl?: string;
  label?: string;
}
interface ICreateDirectChannel {
  userId: string;
  metadata?: string;
  label?: string;
}

export interface IPublicChannelConfig {
  uri: string;
  subject: string;
  metadata: string;
  avatar: string;
  label: string;
}

export interface IPrivateChannelConfig {
  subject: string;
  metadata: string;
  avatar: string;
  label: string;
}

export interface IDirectChannelConfig {
  metadata: string;
  label: string;
}

interface IMemberParams {
  role: string;
  id: string;
}

export interface ISettings {
  muted: boolean;
  muteExpireDate: Date | null;
  uploadSizeLimit: number
}

export declare type IUploadProgress = (progressPercent: number) => void;
export declare type IUploadCompletion = (attachment: Attachment, err: SceytChatError) => void;

interface IAttachmentParams {
  uploadedFileSize?: number;
  data?: File;
  metadata?: string;
  name?: string;
  type: string;
  url?: string;
  upload: boolean;
  progress?: IUploadProgress;
  completion?: IUploadCompletion;
}

interface IUserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  metadata?: string;
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
  public: () => this;
  private: () => this;
  direct: () => this;
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
  hasNext: boolean;
  loading: boolean;
  offset: number;
  limit: number;
  readonly totalUnreadChannelsCount;
  readonly totalUnreadMessagesCount;
  readonly totalChannelsCount;
  loadNextPage: () => Promise<{
    channels: (PrivateChannel | PublicChannel | DirectChannel)[];
    totalUnreadChannelsCount: number;
    totalUnreadMessagesCount;
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

interface MessageListQuery{
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

interface AttachmentListQuery{
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

declare class MessageBuilder {
  constructor(user: User, channelId: string);
  setBody: (text: string) => this;
  setMetadata: (metadata: string) => this;
  setType: (type: string) => this;
  setTransient: (isTransient: boolean) => this;
  setSilent: (isSilent: boolean) => this;
  setAttachments: (attachments: IAttachmentParams[]) => this;
  setMentionUserIds: (userIds: string[]) => this;
  setParentMessageId: (messageId: string) => this;
  setReplyInThread: () => this;
  setForwardingMessageId: (messageId: string) => this;
  create: () => Message;
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


declare class MemberBuilder {
  constructor(id: string);

  setRole: (roleName: string) => this;
  create: () => Member;
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
    complete: boolean | undefined;
  }>;
  loadNextMessageId: (messageId: string) => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  loadNextTimestamp: (timestamp: number) => Promise<{
    messages: Message[];
    complete: boolean | undefined;
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

declare class ChannelListener {
  onCreated: (channel: Channel) => void;
  onUpdated: (channel: Channel) => void;
  onDeleted: (channelId: string) => void;
  onReceivedMessageListMarker: (channelId: string, markers: MessageListMarker[]) => void;
  onTotalUnreadCountUpdated: (channel: Channel, totalUnreadChannelCount: number, totalUnreadMessageCount: number, channelUnreadMessagesCount: number) => void;
  onHidden: (channel: Channel) => void;
  onShown: (channel: Channel) => void;
  onMuted: (channel: Channel) => void;
  onUnmuted: (channel: Channel) => void;
  onBlocked: (channel: GroupChannel) => void;
  onUnblocked: (channel: GroupChannel) => void;
  onHistoryCleared: (channel: Channel) => void;
  onDeletedAllMessages: (channel: Channel) => void;
  onMarkedAsUnread: (channel: Channel) => void;
  onOwnerChanged: (channel: GroupChannel, newOwner: Member, oldOwner: Member) => void;
  onMemberJoined: (channel: PublicChannel, member: Member) => void;
  onMembersAdded: (channel: GroupChannel, members: Member[]) => void;
  onMemberLeft: (channel: GroupChannel, member: Member) => void;
  onMembersKicked: (channel: GroupChannel, members: Member[]) => void;
  onMembersRoleChanged: (channel: GroupChannel, members: Member[]) => void;
  onMembersBlocked: (channel: GroupChannel, members: Member[]) => void;
  onMembersUnblocked: (channel: GroupChannel, members: Member[]) => void;
  onMessage: (channel: Channel, message: Message) => void;
  onMessageEdited: (channel: Channel, user: User, message: Message) => void;
  onMessageDeleted: (channel: Channel, user: User, message: Message) => void;
  onReactionAdded: (channel: Channel, user: User, message: Message, reaction: Reaction) => void;
  onReactionDeleted: (channel: Channel, user: User, message: Message, reaction: Reaction) => void;
  onMemberStartedTyping: (channel: Channel, member: Member) => void;
  onMemberStoppedTyping: (channel: Channel, member: Member) => void;
}

declare class ConnectionListener {
  onConnectionStatusChanged: (status: string) => void;
  onTokenWillExpire: (timeInterval: number) => void;
  onTokenExpired: () => void;
}

declare class User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  metadata: string | null;
  blocked: boolean;
  presence: {
    state: string,
    status: string,
    lastActiveAt: Date
  };
  activityState: 'Active' | 'Inactive' | "Deleted"
}

interface Member extends User {
  role: Role;
}

interface Message {
  id: string;
  tid?: number;
  text: string;
  type: string;
  metadata?: string;
  createdAt: Date | number;
  updatedAt: Date | number;
  incoming: boolean;
  user: User;
  state: 'None' | 'Edited' | 'Deleted';
  deliveryStatus:  'Pending' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  selfMarkers:  string[];
  attachments: Attachment[];
  selfReactions: Reaction[];
  lastReactions: Reaction[];
  reactionScores: { [key: string]: number } | null;
  mentionedUsers: User[];
  requestedMentionUserIds?: string[];
  parent?: Message;
  replyInThread?: boolean;
  replyCount?: number;
  transient: boolean;
  silent: boolean;
  forwardingDetails?: {
    channelId: string
    hops: number
    messageId: string
    user: User
  }

  mentionUserIds: () => string[];
}

interface Attachment {
  id: string;
  createdAt: Date;
  url: string;
  type: string;
  name: string;
  metadata?: string;
  uploadedFileSize?: number;
  user: User;
}

interface Reaction {
  key: string;
  score: number;
  reason: string;
  updatedAt: Date;
  user: User
}

interface Role {
  name: string
}

interface Channel {
  id: string;
  createdAt: Date | number;
  updatedAt: Date | number;
  unreadMessageCount: number;
  unreadMentionsCount: number;
  unreadReactionsCount: number;
  lastReadMessageId: number;
  lastDeliveredMessageId: number;
  lastMessage: Message | null;
  memberCount: number;
  markedAsUnread: boolean;
  muted: boolean;
  muteExpireTime: Date | number;
  type: 'Public' | 'Private' | 'Direct';
  delete: () => Promise<void>;
  deleteAllMessages: (deleteForMe?: boolean) => Promise<void>;
  hide: () => Promise<void>;
  unhide: () => Promise<void>;
  markAsUnRead: () => Promise<Channel>;
  markAsRead: () => Promise<Channel>;
  mute: (muteExpireTime: number) => Promise<Channel>;
  unmute: () => Promise<Channel>;
  markMessagesAsDelivered: (messageIds: string[]) => Promise<void>;
  markMessagesAsRead: (messageIds: string[]) => Promise<void>;
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
}

interface GroupChannel extends Channel {
  subject: string;
  label?: string;
  metadata?: string;
  avatarUrl?: string;
  myRole: Role;

  createMemberBuilder: (id: string) => MemberBuilder;

  changeOwner: (newOwnerId: string) => Promise<Member[]>;
  changeMembersRole: (members: IMemberParams[]) => Promise<Member[]>;
  addMembers: (members: IMemberParams[]) => Promise<Member[]>;
  kickMembers: (memberIds: string[]) => Promise<Member[]>;
  blockMembers: (memberIds: string[]) => Promise<Member[]>;
  unBlockMembers: (memberIds: string[]) => Promise<Member[]>;
  leave: () => Promise<void>;
  block: () => Promise<void>;
  unblock: () => Promise<void>;
}

interface DirectChannel extends Channel {
  peer: Member;
  label?: string;
  metadata?: string;
  update: (channelConfig: IDirectChannelConfig) => Promise<DirectChannel>;
  create(channelData: ICreateDirectChannel): Promise<DirectChannel>;
}

interface PrivateChannel extends GroupChannel {
  update: (channelConfig: IPrivateChannelConfig) => Promise<PrivateChannel>;
  create(channelData: ICreatePrivateChannel): Promise<PrivateChannel>;
}

interface PublicChannel extends GroupChannel {
  uri: string;
  update: (channelConfig: IPublicChannelConfig) => Promise<PublicChannel>;
  create(channelData: ICreatePublicChannel): Promise<PublicChannel>;
  join: () => Promise<Member>;
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