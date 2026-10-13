import type { Metadata } from 'next';
import { PlatformPageView } from '@/components/platform-page';
import { PLATFORMS } from '@/data/products';

const meta = PLATFORMS.find((platform) => platform.id === 'ios')!;

export const metadata: Metadata = {
  title: 'iOS products',
  description: meta.intro,
  alternates: { canonical: '/ios' },
};

export default function IosPage() {
  return <PlatformPageView platform="ios" />;
}
