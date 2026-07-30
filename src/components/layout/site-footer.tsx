export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} VeriText. Enterprise AI text detection.</p>
        <p>Built for multilingual compliance, editorial trust, and fraud prevention.</p>
      </div>
    </footer>
  );
}
