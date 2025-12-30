import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name?: string;
  email: string;
  verifyUrl?: string;
}

export const WelcomeEmail = ({ name, email, verifyUrl }: WelcomeEmailProps) => {
  const previewText = 'Welcome to Newsly - Your weekly dose of AI tools for traders & developers';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Newsly! 🚀</Heading>
          
          <Text style={text}>
            Hey {name || 'there'}!
          </Text>

          <Text style={text}>
            Thanks for subscribing to <strong>Newsly</strong> - the #1 newsletter for 
            discovering AI tools tailored for Indian traders and developers.
          </Text>

          <Text style={text}>
            Here's what you'll get every week:
          </Text>

          <Section style={features}>
            <Text style={featureItem}>✅ 10+ handpicked AI tools with Indian pricing</Text>
            <Text style={featureItem}>✅ Deep-dive tool reviews and use cases</Text>
            <Text style={featureItem}>✅ Exclusive deals and affiliate offers</Text>
            <Text style={featureItem}>✅ Trading & dev-focused AI news roundup</Text>
          </Section>

          {verifyUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={verifyUrl}>
                Verify your email
              </Button>
            </Section>
          )}

          <Text style={text}>
            Your first newsletter will arrive this week. In the meantime, check out our 
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/tools'} style={link}> AI tools directory</Link> with 50+ tools.
          </Text>

          <Text style={text}>
            Want more? Upgrade to <strong>Pro</strong> (₹249/month) for:
          </Text>

          <Section style={features}>
            <Text style={featureItem}>🎯 50+ tools every week (vs 10 on free)</Text>
            <Text style={featureItem}>📚 Exclusive templates & prompts</Text>
            <Text style={featureItem}>💬 Community access</Text>
            <Text style={featureItem}>⚡ Early access to new tools</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={buttonSecondary} href={process.env.NEXT_PUBLIC_APP_URL + '/pricing'}>
              Upgrade to Pro
            </Button>
          </Section>

          <Text style={footer}>
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/tools'} style={link}>Browse Tools</Link> • 
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/blog'} style={link}> Blog</Link> • 
            <Link href={process.env.NEXT_PUBLIC_APP_URL + '/unsubscribe?email=' + email} style={link}> Unsubscribe</Link>
          </Text>

          <Text style={footer}>
            Newsly • Made with ❤️ for Indian traders & developers
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  padding: '0 40px',
  marginBottom: '16px',
};

const features = {
  padding: '0 40px',
  marginBottom: '24px',
};

const featureItem = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '4px 0',
};

const buttonContainer = {
  padding: '0 40px',
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '14px 0',
};

const buttonSecondary = {
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 0',
};

const link = {
  color: '#556cd6',
  textDecoration: 'underline',
  marginLeft: '8px',
  marginRight: '8px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  padding: '0 40px',
  marginTop: '32px',
};
