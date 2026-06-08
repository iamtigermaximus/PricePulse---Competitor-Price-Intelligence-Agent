"use client";

import styled from "styled-components";

const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: var(--space-lg);
`;

const Card = styled.div`
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  max-width: 520px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.h1`
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-accent-primary);
  margin-bottom: var(--space-sm);
`;

const Tagline = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: var(--space-lg);
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  background-color: rgba(5, 150, 105, 0.1);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-success);
  display: inline-block;
`;

const Section = styled.div`
  margin-top: var(--space-xl);
  text-align: left;
`;

const SectionTitle = styled.h2`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
`;

const InfoItem = styled.div`
  padding: var(--space-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
`;

export default function Home() {
  return (
    <Container>
      <Card>
        <Logo>PricePulse</Logo>
        <Tagline>Competitor Price Intelligence Agent</Tagline>
        <StatusBadge>
          <Dot />
          System Ready
        </StatusBadge>
        <Section>
          <SectionTitle>About</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Framework</InfoLabel>
              <InfoValue>Next.js 15</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Database</InfoLabel>
              <InfoValue>PostgreSQL</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>AI Engine</InfoLabel>
              <InfoValue>DeepSeek + LangChain</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>Initializing...</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>
      </Card>
    </Container>
  );
}
