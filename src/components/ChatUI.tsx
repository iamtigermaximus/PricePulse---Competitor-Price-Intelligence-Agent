"use client";

import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import ThemeToggle from "./ThemeToggle";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step {
  action: string;
  input: string;
  output: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  steps?: Step[];
  duration?: number;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-bg);
  transition: background-color 0.2s ease;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
  flex-shrink: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  margin: 0;
`;

const StatusDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${({ $active }) =>
    $active ? "var(--color-success)" : "var(--color-text-secondary)"};
  margin-right: var(--space-sm);
  transition: background-color 0.2s ease;
`;

const StatusText = styled.span`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
`;

const MobileToggleBtn = styled.button`
  display: none;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }

  @media (max-width: 767px) {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// ─── Chat Panel (Left) ──────────────────────────────────────────────────────

const ChatColumn = styled.div<{ $hideOnMobile: boolean }>`
  flex: 3;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  min-width: 0;
  transition: border-color 0.2s ease;

  @media (max-width: 767px) {
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? "none" : "flex")};
    border-right: none;
    flex: 1;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  @media (max-width: 767px) {
    padding: var(--space-md);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  text-align: center;
  gap: var(--space-sm);
  padding: var(--space-xl);
`;

const EmptyTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const EmptySubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 320px;
`;

const MessageBubble = styled.div<{ $role: "user" | "assistant" }>`
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  max-width: 80%;

  @media (max-width: 767px) {
    max-width: 92%;
  }
`;

const BubbleContent = styled.div<{ $role: "user" | "assistant" }>`
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  background-color: ${({ $role }) =>
    $role === "user" ? "var(--color-accent-primary)" : "var(--color-bg-secondary)"};
  color: ${({ $role }) =>
    $role === "user" ? "var(--color-bubble-user-text)" : "var(--color-text-primary)"};
  font-size: 0.9375rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  transition: background-color 0.2s ease;
`;

const MessageMeta = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
  padding: 0 var(--space-sm);
`;

const InputArea = styled.div`
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
  transition: background-color 0.2s ease, border-color 0.2s ease;

  @media (max-width: 767px) {
    padding: var(--space-sm) var(--space-md);
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: var(--space-sm);
  max-width: 100%;
`;

const Input = styled.textarea`
  flex: 1;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  background-color: var(--color-input-bg);
  resize: none;
  outline: none;
  min-height: 48px;
  max-height: 120px;
  line-height: 1.5;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:focus {
    border-color: var(--color-accent-primary);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  background-color: ${({ $disabled }) =>
    $disabled ? "var(--color-border)" : "var(--color-accent-primary)"};
  color: ${({ $disabled }) =>
    $disabled ? "var(--color-text-secondary)" : "#ffffff"};
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  white-space: nowrap;
  transition: background-color 0.15s ease;
  align-self: flex-end;
  height: 48px;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  @media (max-width: 767px) {
    padding: var(--space-sm) var(--space-md);
    height: 48px;
    font-size: 0.8125rem;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  align-self: flex-start;
  max-width: 80%;
  transition: background-color 0.2s ease;

  @media (max-width: 767px) {
    max-width: 92%;
  }
`;

const TypingDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-text-secondary);
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
`;

// ─── Reasoning Panel (Right) ────────────────────────────────────────────────

const ReasoningColumn = styled.div<{ $showOnMobile: boolean }>`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  @media (max-width: 1023px) {
    min-width: 240px;
  }

  @media (max-width: 767px) {
    display: ${({ $showOnMobile }) => ($showOnMobile ? "flex" : "none")};
    flex: 1;
    min-width: 0;
    border-left: none;
  }
`;

const ReasoningHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  font-weight: 700;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  transition: border-color 0.2s ease;
`;

const ReasoningList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
`;

const ReasoningEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-align: center;
  padding: var(--space-xl);
`;

const StepCard = styled.div`
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-step-header);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const ToolBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--color-tool-badge-bg);
  color: var(--color-tool-badge-text);
`;

const StepBody = styled.div`
  padding: var(--space-sm) var(--space-md);
`;

const StepLabel = styled.div`
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  font-weight: 600;
`;

const StepInput = styled.code`
  display: block;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid var(--color-border);
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

const StepOutput = styled.pre`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid var(--color-border);
  max-height: 160px;
  overflow-y: auto;
  margin: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your pricing intelligence agent. Ask me about competitor pricing, product comparisons, or market analysis.\n\nTry: *\"Compare our headphone prices against competitors\"* or *\"What's our cheapest product?\"*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.output,
        steps: data.intermediateSteps || [],
        duration: data.duration,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const allSteps = messages
    .filter((m) => m.role === "assistant" && m.steps && m.steps.length > 0)
    .flatMap((m) => m.steps!);

  const hasSteps = allSteps.length > 0;
  const reasoningLabel = showReasoning ? "Chat" : `Steps (${allSteps.length})`;

  // Determine which panel to show on mobile
  // On desktop both panels render; on mobile only one at a time
  const showChatOnMobile = !showReasoning;
  const showReasoningOnMobile = showReasoning;

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <Logo>PricePulse</Logo>
          <StatusText>
            <StatusDot $active={!isLoading} />
            {isLoading ? "Processing..." : "Ready"}
          </StatusText>
        </HeaderLeft>
        <HeaderRight>
          <MobileToggleBtn
            onClick={() => setShowReasoning(!showReasoning)}
          >
            {showReasoning ? "← Chat" : `Steps (${allSteps.length})`}
          </MobileToggleBtn>
          <ThemeToggle />
        </HeaderRight>
      </Header>

      <Main>
        {/* ── Chat Column ── */}
        <ChatColumn $hideOnMobile={!showChatOnMobile}>
          <MessageList>
            {messages.length <= 1 && !isLoading ? (
              <EmptyState>
                <EmptyTitle>PricePulse</EmptyTitle>
                <EmptySubtitle>
                  Ask about competitor pricing, product comparisons, or market analysis.
                </EmptySubtitle>
              </EmptyState>
            ) : (
              messages.map((msg) => (
                <MessageBubble key={msg.id} $role={msg.role}>
                  <BubbleContent $role={msg.role}>{msg.content}</BubbleContent>
                  {msg.role === "assistant" && msg.duration !== undefined && (
                    <MessageMeta>
                      Completed in {((msg.duration || 0) / 1000).toFixed(1)}s
                      {msg.steps && msg.steps.length > 0
                        ? ` · ${msg.steps.length} tool call${msg.steps.length > 1 ? "s" : ""}`
                        : ""}
                    </MessageMeta>
                  )}
                </MessageBubble>
              ))
            )}

            {isLoading && (
              <TypingIndicator>
                <TypingDot />
                <TypingDot />
                <TypingDot />
              </TypingIndicator>
            )}

            <div ref={messagesEndRef} />
          </MessageList>

          <InputArea>
            <InputRow>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about competitor pricing..."
                rows={1}
                disabled={isLoading}
              />
              <SendButton
                $disabled={!input.trim() || isLoading}
                onClick={handleSend}
              >
                Send
              </SendButton>
            </InputRow>
          </InputArea>
        </ChatColumn>

        {/* ── Reasoning Column ── */}
        <ReasoningColumn $showOnMobile={showReasoningOnMobile}>
          <ReasoningHeader>
            <span>Reasoning &amp; Tool Calls</span>
            {allSteps.length > 0 && (
              <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>
                {allSteps.length} step{allSteps.length > 1 ? "s" : ""}
              </span>
            )}
          </ReasoningHeader>
          <ReasoningList>
            {!hasSteps ? (
              <ReasoningEmpty>
                {messages.length <= 1
                  ? "Send a message to see the agent's reasoning steps here."
                  : "No tool calls were made for this response."}
              </ReasoningEmpty>
            ) : (
              allSteps.map((step, i) => (
                <StepCard key={i}>
                  <StepHeader>
                    <ToolBadge>{step.action}</ToolBadge>
                    <span>Step {i + 1}</span>
                  </StepHeader>
                  <StepBody>
                    <StepLabel>Input</StepLabel>
                    <StepInput>{step.input}</StepInput>
                    <StepLabel>Output</StepLabel>
                    <StepOutput>{step.output}</StepOutput>
                  </StepBody>
                </StepCard>
              ))
            )}
          </ReasoningList>
        </ReasoningColumn>
      </Main>
    </Wrapper>
  );
}
