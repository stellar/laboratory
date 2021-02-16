/**
 * @prettier
 */
import React from "react";
import sanitizeHtml from "../utilities/sanitizeHtml";

// If we're on the test network, we care about all scheduled maintenance. If
// we're on the public network, we only care about public network maintenance
const isMaintenanceRelevant = (allMaintenance, currentNetwork) =>
  allMaintenance.filter((m) =>
    m.components.some((c) =>
      currentNetwork === "test" ? true : c.name === "Stellar Public Network",
    ),
  );

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
        <div className="LaboratoryChrome__network_reset_alert s-alert">
          <div className="so-chunk">{error}</div>
        </div>
      ) : (
        <div className="LaboratoryChrome__network_reset_alert s-alert">
          <div className="so-chunk">Loading testnet information…</div>
        </div>
      );
    }

    const relevantMaintenance = isMaintenanceRelevant(
      maintenance,
      currentNetwork,
    );

    if (relevantMaintenance.length === 0) {
      if (currentNetwork === "test") {
        return (
          <div className="LaboratoryChrome__network_reset_alert s-alert">
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
