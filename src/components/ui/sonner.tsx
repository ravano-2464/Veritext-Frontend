'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from '@/components/providers/theme-provider';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ position = 'top-right', ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position={position}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast pr-12',
          closeButton:
            '!left-auto !right-3 !top-1/2 !h-5 !w-5 !p-0 !rounded-md !border-0 !bg-transparent !text-muted-foreground ![transform:translateY(-50%)] hover:!bg-transparent hover:!text-foreground [&>svg]:!size-3.5',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
