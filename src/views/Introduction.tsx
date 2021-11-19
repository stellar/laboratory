// helper to import the tour and it's dependencies 
// only when it's needed and not on every page load
const startTour = () => {
  import("constants/tour").then(module => module.tour.start());
};

export const Introduction = () => {
  return (
    <div className="Introduction" data-testid="page-introduction">
      <div className="so-back">
        <div className="so-chunk">
          <div className="Introduction__container">
            <h2>Stellar Laboratory</h2>
            <p className="Introduction__lead">
              The Stellar Laboratory is a set of tools that enables people to
              try out and learn about the Stellar network. The laboratory can{" "}
              <a href="#txbuilder">build transactions</a>,{" "}
              <a href="#txsigner">sign them</a>, and{" "}
              <a href="#explorer?resource=transactions&endpoint=create">
                submit them to the network
              </a>
              . It can also{" "}
              <a href="#explorer">
                make requests to any of the Horizon endpoints
              </a>
              .
            </p>
            <p>
              If you need a quick tour to find you way around Laboratory, we got you covered!
            </p>
            <button onClick={startTour} className="s-button">
              Start Tour
            </button>
            <p>
              For Stellar docs, take a look at the{" "}
              <a href="https://developers.stellar.org/">
                Stellar developers site
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
