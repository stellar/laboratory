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
        error
      ) : (
        <div className="LaboratoryChrome__network_reset_alert s-alert">
          <div className="so-chunk">Loading testnet information…</div>
        </div>
      );
    }

    return (
      <div>
        {maintenance && maintenance.length === 0 ? (
          <div className="LaboratoryChrome__network_reset_alert s-alert">
            <div className="so-chunk">
              The next testnet reset has not yet been scheduled.
            </div>
          </div>
        ) : (
          maintenance.map((m) => {
            const date = new Date(m.scheduled_for);
            return (
              <div
                key={m.id}
                className="LaboratoryChrome__network_reset_alert s-alert"
              >
                <div className="so-chunk">
                  <a href={`https://status.stellar.org/incidents/${m.id}`}>
                    {m.name}
                  </a>{" "}
                  on {date.toDateString()} at {date.toTimeString()}
                  {m.incident_updates.map((update) => (
                    <div
                      key={update.id}
                      dangerouslySetInnerHTML={{ __html: update.body }}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}
