import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChatStore } from '@/store';
import { Message } from '@/types';
import { theme } from '@/theme';

export default function ChatScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { matchId, user } = route.params;

  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { conversations, sendMessage, loadConversation } = useChatStore();
  const conversation = conversations[matchId];

  useEffect(() => {
    loadConversation(matchId);
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image
            source={{ uri: user.photos[0] || 'https://via.placeholder.com/200' }}
            style={styles.headerAvatar}
          />
          <View>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{user.name}</Text>
              {user.verified && (
                <Icon name="check-decagram" size={16} color={theme.colors.info} />
              )}
            </View>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="video" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="dots-vertical" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [matchId, user, navigation, loadConversation]);

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(matchId, messageText.trim());
      setMessageText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === 'me';

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
        {!isMyMessage && (
          <Image
            source={{ uri: user.photos[0] }}
            style={styles.messageAvatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.messageImage} />
          )}
          {item.text && (
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.theirMessageText,
              ]}>
              {item.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: user.photos[0] }}
        style={styles.emptyAvatar}
      />
      <Text style={styles.emptyTitle}>You matched with {user.name}!</Text>
      <Text style={styles.emptySubtitle}>{user.bio}</Text>
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Start the conversation:</Text>
        <TouchableOpacity
          style={styles.suggestionButton}
          onPress={() => setMessageText("Hey! How's it going?")}>
          <Text style={styles.suggestionText}>Hey! How's it going?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.suggestionButton}
          onPress={() => setMessageText(`I love ${user.interests?.[0] || 'your profile'} too!`)}>
          <Text style={styles.suggestionText}>
            I love {user.interests?.[0] || 'your profile'} too!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>

      {/* Messages list */}
      {conversation && conversation.messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={conversation.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputButton}>
          <Icon name="plus-circle" size={32} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.emojiButton}>
            <Icon name="emoticon-happy-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            messageText.trim() && styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={!messageText.trim()}>
          <Icon
            name="send"
            size={20}
            color={messageText.trim() ? theme.colors.textInverse : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  headerStatus: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: theme.colors.surfaceLight,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  },
  myMessageText: {
    color: theme.colors.textInverse,
  },
  theirMessageText: {
    color: theme.colors.text,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  suggestionButton: {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceLight,
  },
  inputButton: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    maxHeight: 100,
    paddingVertical: theme.spacing.sm,
  },
  emojiButton: {
    padding: theme.spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: theme.colors.primary,
  },
});
