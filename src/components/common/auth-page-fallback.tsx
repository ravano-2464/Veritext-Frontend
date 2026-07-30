import { BrandLogo } from '@/components/common/brand-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type AuthPageFallbackProps = {
  title: string;
  description?: string;
  footerLines?: number;
  formRows?: number;
};

export function AuthPageFallback({
  title,
  description,
  footerLines = 1,
  formRows = 2,
}: AuthPageFallbackProps) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md border-border/60 bg-card/90">
        <CardHeader className="space-y-4">
          <BrandLogo />
          <div className="space-y-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Array.from({ length: formRows }, (_, index) => (
              <div key={`${title}-field-${index}`} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: footerLines }, (_, index) => (
              <Skeleton key={`${title}-footer-${index}`} className="mx-auto h-4 w-40" />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
