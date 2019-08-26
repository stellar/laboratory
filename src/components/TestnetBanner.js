import React from 'react'

const formatDate = date => `${
    date.toLocaleString(navigator.language, {dateStyle: 'long'})
  } ${String(date.getUTCHours()).padStart(2, '0').padEnd(4, '0')}UTC`

export default class TestnetBanner extends React.Component {
  constructor() {
    super()
    this.state = {
      nextReset: null,
      error: null,
    }
  }
  getNextMaintenance(schedule) {
    const nextMaintenance = schedule.sort(
      (a, b) => new Date(a) - new Date(b)
    )[0].scheduled_for;

    this.setState({ error: null, nextReset: new Date(nextMaintenance) })
  }
  componentDidMount() {
    fetch("https://9sl3dhr1twv1.statuspage.io/api/v2/summary.json")
      .then(res => res.json())
      .then(data => this.getNextMaintenance(data.scheduled_maintenances))
      .catch(e => {
        console.error(e);
        this.setState({
          nextReset: null,
          error: "Failed to fetch testnet reset date.",
        });
      });
  }
  render() {
    const { nextReset, error } = this.state;
    return (
      <div className="LaboratoryChrome__network_reset_alert s-alert">
        <div className="so-chunk">
          {nextReset ? (
            <div>
              The test network will be reset on{" "}
              {formatDate(nextReset)}. Please see our{" "}
              <a href="https://www.stellar.org/developers/guides/concepts/test-net.html#best-practices-for-using-testnet">
                testnet best practices
              </a>{" "}
              for more information.
            </div>
          ) : error ?
            error : (
            "Loading next testnet reset date…"
          )}
        </div>
      </div>
    )
  }
}
