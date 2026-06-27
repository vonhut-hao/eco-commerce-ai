-- V6__Create_Soft_Deleted_Message_Conversation.sql
-- Add is_deleted in Message and Conversation
ALTER TABLE conversations ADD is_deleted BIT(1) NOT NULL;
ALTER TABLE messages ADD is_deleted BIT(1) NOT NULL;