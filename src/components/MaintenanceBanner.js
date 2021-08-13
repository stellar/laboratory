/**
 * @prettier
 */
import React from "react";
import sanitizeHtml from "../helpers/sanitizeHtml";

const TEST_ID = "maintenance-banner";

// If we're on the test network, we care about all scheduled maintenance. If
// we're on the public network, we only care about public network maintenance
const isMaintenanceRelevant = (allMaintenance, currentNetwork) => {
  if (!allMaintenance) {
    return null;
  }

  return allMaintenance.filter((m) =>
    m.components.some((c) =>
      currentNetwork === "test" ? true : c.name === "Stellar Public Network",
    ),
  );
};

const getNextMaintenance = (schedule) =>
  schedule.sort(
    (a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for),
  );

export default class TestnetBanner extends React.Component {
  constructor() {
    super();
    this.state = {
      maintenance: false,
      error: null,
    };
  }
  componentDidMount() {
    fetch("https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          error: null,
          maintenance: getNextMaintenance(data.scheduled_maintenances),
        });
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          maintenance: null,
          error: "Failed to fetch testnet reset date.",
        });
      });
  }
  render() {
    const { maintenance, error } = this.state;
    const { currentNetwork } = this.props;

    if (maintenance === false) {
      return error ? (
        <div
          className="LaboratoryChrome__network_reset_alert s-alert"
          data-testid={TEST_ID}
        >
          <div className="so-chunk">{error}</div>
        </div>
      ) : (
        <div
          className="LaboratoryChrome__network_reset_alert s-alert"
          data-testid={TEST_ID}
        >
          <div className="so-chunk">Loading testnet information…</div>
        </div>
      );
    }

    const relevantMaintenance = isMaintenanceRelevant(
      maintenance,
      currentNetwork,
    );

    if (!relevantMaintenance) {
      if (currentNetwork === "test") {
        return (
          <div
            className="LaboratoryChrome__network_reset_alert s-alert"
            data-testid={TEST_ID}
          >
            <div className="so-chunk">
              Failed to fetch testnet reset date. Check status{" "}
              <a
                href="https://9sl3dhr1twv1.statuspage.io/"
                target="_blank"
                rel="noreferrer noopener"
              >
                here
              </a>
              .
            </div>
          </div>
        );
      }
      return null;
    }

    if (relevantMaintenance.length === 0) {
      if (currentNetwork === "test") {
        return (
          <div
            className="LaboratoryChrome__network_reset_alert s-alert"
            data-testid={TEST_ID}
          >
            <div className="so-chunk">
              The next testnet reset has not yet been scheduled.
            </div>
          </div>
        );
      }
      return null;
    }
    const nextMaintenance = relevantMaintenance[0];
    const date = new Date(nextMaintenance.scheduled_for);

    return (
      <div
        key={nextMaintenance.id}
        className="LaboratoryChrome__network_reset_alert s-alert"
        data-testid={TEST_ID}
      >
        <div className="so-chunk">
          <a
            href={`https://status.stellar.org/incidents/${nextMaintenance.id}`}
          >
            {nextMaintenance.name}
          </a>{" "}
          on {date.toDateString()} at {date.toTimeString()}
          {nextMaintenance.incident_updates.map((update) => (
            <div key={update.id}>{sanitizeHtml(update.body)}</div>
          ))}
        </div>
      </div>
    );
  }
}
