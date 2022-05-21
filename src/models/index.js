// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "READ": "READ",
  "DELIVERED": "DELIVERED"
};

const { Message, ChatRoom, User, ChatRoomUser } = initSchema(schema);

export {
  Message,
  ChatRoom,
  User,
  ChatRoomUser,
  MessageStatus
};