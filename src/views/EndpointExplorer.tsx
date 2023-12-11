import { useDispatch } from "react-redux";
import {
  chooseEndpoint,
  submitRequest,
  updateValue,
} from "actions/endpointExplorer.js";
import { EndpointPicker } from "components/EndpointPicker";
import { EndpointSetup } from "components/EndpointSetup";
import { EndpointResult } from "components/EndpointResult";
import { getResourceEndpoints } from "helpers/getResourceEndpoints";
import { addEventHandler } from "helpers/metrics.js";
import { buildRequest } from "helpers/buildRequest";
import { useRedux } from "hooks/useRedux";
import endpointExplorerMetrics from "metricsHandlers/endpointExplorer.js";

addEventHandler(endpointExplorerMetrics);

export const EndpointExplorer = () => {
  const { endpointExplorer, network } = useRedux("endpointExplorer", "network");
  const baseUrl = network.current.horizonURL;
  const { currentResource, currentEndpoint, results, pendingRequest } =
    endpointExplorer;

  const dispatch = useDispatch();
  const endpoint = getResourceEndpoints(currentResource, currentEndpoint);
  const request = buildRequest(baseUrl, endpoint, pendingRequest);

  return (
    <div className="so-back" data-testid="page-endpoint-explorer">
      <div className="so-chunk">
        <div className="pageIntro">
          <p>
            This tool can be used to run queries against the{" "}
            <a
              href="https://developers.stellar.org/api/introduction/"
              rel="noreferrer"
              target="_blank"
            >
              REST API endpoints
            </a>{" "}
            on the Horizon server. Horizon is the client facing library for the
            Stellar ecosystem.
          </p>
        </div>
        <div className="EndpointExplorer">
          <div className="EndpointExplorer__picker">
            <EndpointPicker
              currentResource={currentResource}
              currentEndpoint={currentEndpoint}
              onChange={(resource: string, endpoint: string) =>
                dispatch(chooseEndpoint(resource, endpoint))
              }
            />
          </div>

          <div className="EndpointExplorer__setup">
            {currentEndpoint ? (
              <EndpointSetup
                request={request}
                values={pendingRequest.values}
                endpoint={endpoint}
                onSubmit={() => dispatch(submitRequest(request))}
                onUpdate={(param: string, value: string | boolean) =>
                  dispatch(updateValue(param, value))
                }
              />
            ) : null}
          </div>

          <div className="EndpointExplorer__result">
            <EndpointResult {...results} />
          </div>
        </div>
      </div>
    </div>
  );
};
