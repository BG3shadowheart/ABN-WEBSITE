import type { Metadata } from 'next';
import { PlatformPageView } from '@/components/platform-page';
import { PLATFORMS } from '@/data/products';

const meta = PLATFORMS.find((platform) => platform.id === 'pc')!;

export const metadata: Metadata = {
  title: 'PC products',
  description: meta.intro,
  alternates: { canonical: '/pc' },
};

export default function PcPage() {
  return <PlatformPageView platform="pc" />;
}
