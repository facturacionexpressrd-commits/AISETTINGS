/**
 * Chat Controller — operate your SaaS entirely through chat
 * Keyboard-first: Enter to send, Escape to clear, Tab for focus
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { StudioConfig } from '../types';

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ChatControllerProps {
  config: StudioConfig;
  onAction?: (action: string, params: Record<string, any>) => Promise<string>;
  onMessage?: (message: string) => Promise<string>;
  height?: string;
  placeholder?: string;
  showTimestamp?: boolean;
}

/**
 * Parse user intent for common SaaS actions
 * "create contact John", "book appointment tomorrow at 2pm", "check order status"
 */
function parseCommand(text: string): { type: string; params: Record<string, any> } | null {
  const lower = text.toLowerCase();

  if (lower.startsWith('create contact ')) {
    return { type: 'create_contact', params: { name: text.slice(14).trim() } };
  }
  if (lower.startsWith('book ') || lower.startsWith('schedule ')) {
    return { type: 'book_appointment', params: { description: text.trim() } };
  }
  if (lower.startsWith('order ') || lower.startsWith('buy ')) {
    return { type: 'create_order', params: { description: text.trim() } };
  }
  if (lower.includes('status') || lower.includes('check order')) {
    return { type: 'get_order_status', params: { query: text.trim() } };
  }
  if (lower.startsWith('update contact ')) {
    return { type: 'update_contact', params: { data: text.slice(14).trim() } };
  }
  if (lower.startsWith('follow up ')) {
    return { type: 'create_followup', params: { description: text.slice(9).trim() } };
  }

  return null;
}

export const ChatController = React.forwardRef<HTMLDivElement, ChatControllerProps>(
  (
    {
      config,
      onAction,
      onMessage,
      height = '500px',
      placeholder = "Type your request... (Enter to send, Escape to clear)",
      showTimestamp = false,
    },
    ref
  ) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: '0',
        role: 'system',
        content: `👋 Hi! I'm ${config.identity.name}. ${config.identity.greeting}`,
        timestamp: Date.now(),
      },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = useCallback(async () => {
      if (!input.trim() || loading) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: input.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
        let response = '';

        // Try to parse as command
        const command = parseCommand(input);
        if (command && onAction) {
          response = await onAction(command.type, command.params);
        } else if (onMessage) {
          // Send as natural language
          response = await onMessage(input);
        } else {
          response = `I received: "${input}" but I need a handler to process this.`;
        }

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          action: command?.type,
          metadata: command?.params,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'system',
          content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    }, [input, loading, onAction, onMessage]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
        if (e.key === 'Escape') {
          setInput('');
        }
      },
      [handleSend]
    );

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height,
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor:
                    msg.role === 'user'
                      ? '#0084ff'
                      : msg.role === 'system'
                        ? '#f0f0f0'
                        : '#e8f5e9',
                  color: msg.role === 'user' ? 'white' : '#333',
                  wordWrap: 'break-word',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {msg.content}
                {showTimestamp && (
                  <div
                    style={{
                      fontSize: '11px',
                      opacity: 0.7,
                      marginTop: '4px',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'pulse 1.5s infinite 0.3s',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#999',
                  animation: 'pulse 1.5s infinite 0.6s',
                }}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            borderTop: '1px solid #e0e0e0',
            padding: '12px',
            backgroundColor: 'white',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            style={{
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#0084ff')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#ddd')}
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 16px',
              backgroundColor: input.trim() && !loading ? '#0084ff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !loading) {
                e.currentTarget.style.backgroundColor = '#0073e6';
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && !loading) {
                e.currentTarget.style.backgroundColor = '#0084ff';
              }
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
);

ChatController.displayName = 'ChatController';

/**
 * Pre-built chat for common SaaS operations
 * Just pass config + tool handlers
 */
export const SaasChatController = React.forwardRef<
  HTMLDivElement,
  Omit<ChatControllerProps, 'onAction'> & {
    tools?: Record<string, (params: Record<string, any>) => Promise<string>>;
  }
>(({ tools = {}, ...props }, ref) => {
  const handleAction = useCallback(
    async (action: string, params: Record<string, any>) => {
      const tool = tools[action];
      if (!tool) {
        return `I don't have access to ${action} yet. Available: ${Object.keys(tools).join(', ')}`;
      }
      return await tool(params);
    },
    [tools]
  );

  return <ChatController ref={ref} {...props} onAction={handleAction} />;
});

SaasChatController.displayName = 'SaasChatController';
