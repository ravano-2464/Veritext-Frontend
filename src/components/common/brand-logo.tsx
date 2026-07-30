import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/veritext-logo-application-light-mode.webp"
        alt="VeriText Logo"
        width={32}
        height={32}
        className="rounded-xl object-contain dark:hidden"
      />
      <Image
        src="/veritext-logo-application-dark-mode.webp"
        alt="VeriText Logo"
        width={32}
        height={32}
        className="hidden rounded-xl object-contain dark:block"
      />
      <span className="text-lg font-semibold tracking-tight">VeriText</span>
    </Link>
  );
}
