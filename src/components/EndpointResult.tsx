import { CodeBlock } from "components/CodeBlock";

interface EndpointResultProps {
  available: boolean;
  isError: boolean;
  body: any[];
}

export const EndpointResult = ({
  available,
  isError,
  body,
}: EndpointResultProps) => {
  if (!available) {
    return null;
  }

  if (body.length === 0) {
    return (
      <div
        className="EndpointResult"
        data-testid="page-endpoint-result-loading"
      >
        <div className="EndpointResult__loading">Loading…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="EndpointResult" data-testid="page-endpoint-result-error">
        <div className="EndpointResult__error">
          {body.map((code, index) => (
            <CodeBlock key={index} code={code} language="json" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="EndpointResult" data-testid="page-endpoint-result-response">
      <div>
        <div className="EndpointResult__tabs">
          <button className="EndpointResult__tabs__tab is-current">
            JSON Response
          </button>
        </div>
        <div className="EndpointResult__content">
          {body.map((code, index) => (
            <CodeBlock key={index} code={code} language="json" />
          ))}
        </div>
      </div>
    </div>
  );
};
