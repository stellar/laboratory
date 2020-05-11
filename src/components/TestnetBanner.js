/**
 * @prettier
 */
import React from "react";

export default class TestnetBanner extends React.Component {
  constructor() {
    super();
    this.state = {
      maintenance: false,
      error: null,
    };
  }
  getNextMaintenance(schedule) {
    const maintenance = schedule.sort(
      (a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for),
    );

    this.setState({ error: null, maintenance });
  }
  componentDidMount() {
    fetch("https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json")
      .then((res) => res.json())
      .then((data) => {
        this.getNextMaintenance(data.scheduled_maintenances);
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

    if (maintenance.length === 0) {
      return (
        <div className="LaboratoryChrome__network_reset_alert s-alert">
          <div className="so-chunk">
            The next testnet reset has not yet been scheduled.
          </div>
        </div>
      );
    }

    const nextMaintenance = maintenance[0];
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
            <div
              key={update.id}
              dangerouslySetInnerHTML={{ __html: update.body }}
            />
          ))}
        </div>
      </div>
    );
  }
}
