import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NewsletterSection {
  title: string;
  content: string;
  link?: string;
}

interface NewsletterEmailProps {
  subscriberName?: string;
  email: string;
  subject: string;
  headline: string;
  intro: string;
  sections: NewsletterSection[];
  tier?: 'FREE' | 'PRO' | 'PREMIUM';
  topics?: string[];
  date?: string;
}

export const NewsletterEmail = ({
  subscriberName = 'there',
  email,
  subject,
  headline,
  intro,
  sections = [],
  tier = 'FREE',
  topics = [],
  date = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
}: NewsletterEmailProps) => {
  const previewText = `${subject} - Your personalized news digest from Newsly`;

  const tierColors = {
    FREE: { bg: '#10B981', text: 'Free' },
    PRO: { bg: '#F59E0B', text: 'Pro' },
    PREMIUM: { bg: '#8B5CF6', text: 'Premium' },
  };

  const topicEmojis: Record<string, string> = {
    'AI_TOOLS': '🤖',
    'STOCK_MARKET': '📈',
    'CRYPTO': '₿',
    'STARTUPS': '🚀',
    'PRODUCTIVITY': '⚡',
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Row>
              <Column>
                <div style={logoContainer}>
                  <span style={logoIcon}>✨</span>
                  <span style={logoText}>Newsly</span>
                </div>
              </Column>
              <Column align="right">
                <span style={tierBadge(tierColors[tier].bg)}>
                  {tierColors[tier].text}
                </span>
              </Column>
            </Row>
          </Section>

          {/* Date Bar */}
          <Section style={dateBar}>
            <Text style={dateText}>{date}</Text>
            {topics.length > 0 && (
              <Text style={topicsText}>
                {topics.map(t => topicEmojis[t] || '📰').join(' ')} {topics.map(t => t.replace(/_/g, ' ')).join(' • ')}
              </Text>
            )}
          </Section>

          {/* Greeting */}
          <Section style={greetingSection}>
            <Text style={greeting}>Hey {subscriberName}! 👋</Text>
          </Section>

          {/* Headline */}
          <Heading style={headlineStyle}>{headline}</Heading>

          {/* Intro */}
          <Text style={introStyle}>{intro}</Text>

          <Hr style={divider} />

          {/* Main Content Sections */}
          {sections.map((section, index) => (
            <Section key={index} style={sectionCard}>
              <div style={sectionNumber}>{String(index + 1).padStart(2, '0')}</div>
              <Heading as="h3" style={sectionTitle}>{section.title}</Heading>
              <Text style={sectionContent}>{section.content}</Text>
              {section.link && (
                <Link href={section.link} style={sectionLink}>
                  Read more →
                </Link>
              )}
            </Section>
          ))}

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Enjoyed this newsletter? Share it with a friend!
            </Text>
            <Button 
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://newsly-beryl.vercel.app'}?ref=${email}`}
              style={ctaButton}
            >
              Share Newsly ❤️
            </Button>
          </Section>

          {/* Upgrade CTA for Free users */}
          {tier === 'FREE' && (
            <Section style={upgradeSection}>
              <Text style={upgradeTitle}>🔓 Unlock More Topics</Text>
              <Text style={upgradeText}>
                Upgrade to Pro for just ₹3/month and get access to 4 topics with deeper insights!
              </Text>
              <Button 
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://newsly-beryl.vercel.app'}/my-newsletters`}
                style={upgradeButton}
              >
                Upgrade to Pro →
              </Button>
            </Section>
          )}

          {/* Footer */}
          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerText}>
              Made with ☕ in India
            </Text>
            <Row style={footerLinks}>
              <Column align="center">
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://newsly-beryl.vercel.app'}/my-newsletters`} style={footerLink}>
                  Dashboard
                </Link>
                <Text style={footerDot}>•</Text>
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://newsly-beryl.vercel.app'}/api/unsubscribe?email=${email}`} style={footerLink}>
                  Unsubscribe
                </Link>
              </Column>
            </Row>
            <Text style={footerCopyright}>
              © 2025 Newsly. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const header = {
  backgroundColor: '#1a1a1a',
  padding: '24px 32px',
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const logoIcon = {
  fontSize: '24px',
};

const logoText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
};

const tierBadge = (bgColor: string) => ({
  backgroundColor: bgColor,
  color: '#ffffff',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
});

const dateBar = {
  backgroundColor: '#fef3c7',
  padding: '12px 32px',
  textAlign: 'center' as const,
};

const dateText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const topicsText = {
  color: '#b45309',
  fontSize: '12px',
  margin: '4px 0 0 0',
};

const greetingSection = {
  padding: '32px 32px 0 32px',
};

const greeting = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0',
};

const headlineStyle = {
  color: '#111827',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '16px 32px 0 32px',
  padding: '0',
};

const introStyle = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.7',
  margin: '16px 32px 0 32px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px',
};

const sectionCard = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 32px 16px 32px',
  border: '1px solid #e5e7eb',
};

const sectionNumber = {
  color: '#d1d5db',
  fontSize: '48px',
  fontWeight: '800',
  lineHeight: '1',
  marginBottom: '8px',
};

const sectionTitle = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const sectionContent = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
};

const sectionLink = {
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const ctaSection = {
  textAlign: 'center' as const,
  padding: '32px',
  backgroundColor: '#fef3c7',
  margin: '32px',
  borderRadius: '12px',
};

const ctaText = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 16px 0',
};

const ctaButton = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
};

const upgradeSection = {
  textAlign: 'center' as const,
  padding: '24px 32px',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  background: '#667eea',
  margin: '0 32px 32px 32px',
  borderRadius: '12px',
};

const upgradeTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const upgradeText = {
  color: 'rgba(255,255,255,0.9)',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const upgradeButton = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  color: '#667eea',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block',
};

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '0 32px',
};

const footer = {
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const footerLinks = {
  marginBottom: '16px',
};

const footerLink = {
  color: '#9ca3af',
  fontSize: '12px',
  textDecoration: 'none',
};

const footerDot = {
  color: '#d1d5db',
  fontSize: '12px',
  margin: '0 8px',
  display: 'inline',
};

const footerCopyright = {
  color: '#d1d5db',
  fontSize: '11px',
  margin: '0',
};
