interface LoadingViewProps {
  pastDelay: boolean;
  error: any;
}

export const LoadingView = ({ pastDelay, error }: LoadingViewProps) => {
  if (error) {
    return (
      <div className="so-back">
        <div className="so-chunk Introduction">
          <p>
            There was a problem loading this page. If your network connection is
            still working, try reloading.
          </p>
          <p>
            <button
              className="s-button"
              onClick={() => {
                window.history.go(0);
              }}
            >
              Reload
            </button>
          </p>
          <details>
            <summary>View stack trace</summary>
            <pre>{error.stack}</pre>
          </details>
        </div>
      </div>
    );
  }

  if (pastDelay) {
    return (
      <div className="so-back">
        <div className="so-chunk">loading…</div>
      </div>
    );
  }

  return null;
};
