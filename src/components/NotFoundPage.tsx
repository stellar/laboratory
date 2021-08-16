interface NotFoundPageProps {
  children: React.ReactNode;
}

export const NotFoundPage = ({ children }: NotFoundPageProps) => (
  <div className="so-back SimplePage__back">
    <div className="so-chunk">{children}</div>
  </div>
);
