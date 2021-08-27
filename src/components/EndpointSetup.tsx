import HelpMark from "components/HelpMark";
import { EasySelect } from "components/EasySelect";
import {
  EndpointBuildRequest,
  EndpointItemEndpoint,
  RequestMethod,
} from "types/types.d";

interface EndpointSetupProps {
  onSubmit: () => void;
  onUpdate: (param: string, value: string | boolean) => void;
  request: EndpointBuildRequest;
  endpoint: EndpointItemEndpoint | undefined;
  values: any;
}

export const EndpointSetup = ({
  onSubmit,
  onUpdate,
  request,
  endpoint,
  values,
}: EndpointSetupProps) => {
  if (!endpoint) {
    return null;
  }

  const StreamingRow = ({
    onUpdate,
    checked,
  }: {
    onUpdate: (param: string, value: string | boolean) => void;
    checked: boolean;
  }) => (
    <div className="optionsTable__blank EndpointSetup__streaming">
      <label>
        <input
          type="checkbox"
          className="EndpointSetup__streaming__checkbox"
          onChange={(event) => {
            onUpdate("streaming", event.target.checked);
          }}
          checked={checked}
        />
        <span className="EndpointSetup__streaming__title">
          Server-Sent Events (streaming) mode
        </span>
        &nbsp;
        <HelpMark href="https://developers.stellar.org/api/introduction/streaming/" />
      </label>
    </div>
  );

  const UrlRow = ({
    method,
    url,
  }: {
    method: RequestMethod | undefined;
    url: string;
  }) => {
    return (
      <div className="optionsTable__blank EndpointSetup__url">
        <span className="EndpointSetup__url__method">{method}</span>
        <span>&nbsp;</span>
        <EasySelect>{url}</EasySelect>
      </div>
    );
  };

  const PostDataRow = ({ formData }: { formData: string }) => {
    if (!formData) {
      return null;
    }

    return (
      <div className="optionsTable__blank EndpointSetup__url">
        <span>{formData}</span>
      </div>
    );
  };

  const SubmitRow = ({ onSubmit }: { onSubmit: () => void }) => {
    return (
      <div className="optionsTable__blank">
        <button className="s-button" onClick={onSubmit}>
          Submit
        </button>
      </div>
    );
  };

  const renderStreamingRow = () => {
    if (endpoint.disableStreaming) {
      return null;
    }

    return (
      <>
        <hr className="optionsTable__separator" />
        <StreamingRow onUpdate={onUpdate} checked={values.streaming} />
      </>
    );
  };

  return (
    <div className="so-chunk" data-testid="page-endpoint-inputs">
      <p className="EndpointSetup__title">
        {endpoint.label} <HelpMark href={endpoint.helpUrl} />
      </p>
      <div className="optionsTable">
        <endpoint.setupComponent onUpdate={onUpdate} values={values} />
        {renderStreamingRow()}
        <hr className="optionsTable__separator" />
        <UrlRow url={request.url} method={request.method} />
        <PostDataRow formData={request.formData} />
        <SubmitRow onSubmit={onSubmit} />
      </div>
    </div>
  );
};
