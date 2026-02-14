const React = require("react");
const ReactDom = require("react-dom");
const speedtest = require("./lib/speed-test");
const history = require("./lib/history");
const sl = require("react-sparklines");
const Sparklines = sl.Sparklines;
const SparklinesLine = sl.SparklinesCurve;

// record history
speedtest.on(history.record);

speedtest.on(() => {
  const scrollPosition = window.scrollY;
  render(<Table history={history.read()} blockList={globalBlockList} isPaused={globalIsPaused} />);
  window.scrollY = scrollPosition;
});

let globalBlockList = [];
let globalIsPaused = false;

speedtest.onBlocklistUpdate((blockList) => (globalBlockList = blockList));

speedtest.onStatusChange((status) => {
  globalIsPaused = status.paused;
  const scrollPosition = window.scrollY;
  render(<Table history={history.read()} blockList={globalBlockList} isPaused={globalIsPaused} />);
  window.scrollY = scrollPosition;
});

function render(jsx) {
  ReactDom.render(jsx, document.getElementById("content"));
}

const Table = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: localStorage.getItem('darkMode') === 'true',
      isPaused: props.isPaused || false
    };
    this.renderButton = this.renderButton.bind(this);
    this.renderFlag = this.renderFlag.bind(this);
    this.renderFlag2 = this.renderFlag2.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderError = this.renderError.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.exportToJSON = this.exportToJSON.bind(this);
    this.togglePauseResume = this.togglePauseResume.bind(this);
  }

  componentDidMount() {
    // Apply dark mode on mount
    if (this.state.darkMode) {
      document.body.classList.add('dark-mode');
    }
    // Save history to localStorage
    this.saveHistoryToLocalStorage();
  }

  componentDidUpdate(prevProps) {
    // Save history to localStorage on updates
    this.saveHistoryToLocalStorage();

    // Update paused state if prop changed
    if (prevProps.isPaused !== this.props.isPaused) {
      this.setState({ isPaused: this.props.isPaused });
    }
  }

  saveHistoryToLocalStorage() {
    try {
      const historyData = {
        timestamp: new Date().toISOString(),
        results: this.props.history.slice(0, 20) // Save last 20 results
      };
      localStorage.setItem('speedTestHistory', JSON.stringify(historyData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  toggleDarkMode() {
    const newDarkMode = !this.state.darkMode;
    this.setState({ darkMode: newDarkMode });
    localStorage.setItem('darkMode', newDarkMode);

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  exportToCSV() {
    const headers = ['Data Center', 'Average Latency (ms)', 'Min', 'Max'];
    const rows = this.props.history.map(item => [
      item.name,
      Math.round(item.average),
      item.values && item.values.length > 0 ? Math.min(...item.values) : 'N/A',
      item.values && item.values.length > 0 ? Math.max(...item.values) : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azure-devops-speed-test-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToJSON() {
    const data = {
      timestamp: new Date().toISOString(),
      results: this.props.history.map(item => ({
        name: item.name,
        domain: item.domain,
        average: Math.round(item.average),
        values: item.values || [],
        icon: item.icon,
        icon2: item.icon2
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azure-devops-speed-test-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  togglePauseResume() {
    const newPausedState = !this.state.isPaused;
    this.setState({ isPaused: newPausedState });

    if (newPausedState) {
      speedtest.pause();
    } else {
      speedtest.resume();
    }
  }

  renderButton() {
    let item = this.props.history[0];

    if (!item) return "";
    if (item.cdn || false) item = this.props.history[1];
    if (!item) return "";

    return (
      <a
        href={
          "https://twitter.com/intent/tweet?button_hashtag=GitHubAzureDevOpsSpeedTest&text=My%20nearest%20%23AzureDevOps%20%23GitHub%20is%20" +
          item.name +
          "%20(" +
          Math.round(item.average) +
          "ms).+Find+out+yours+https%3A%2F%2Fazure4devops.com%2FGithubAzureDevOpsSpeedTest%2F+#GitHubAzureDevOpsSpeedTest"
        }
        className="btn btn-primary btn-large"
        data-size="large"
        data-related="two10degrees"
        data-dnt="true"
      >
        Tweet your results
      </a>
    );
  }
  renderFlag(item) {
    if (!item.icon) return "";
    return <img src={item.icon} className="icon" itemType="image/svg" />;
  }
  renderFlag2(item) {
    if (!item.icon2) return "";
    return <img src={item.icon2} className="icon" itemType="image/svg" />;
  }
  renderRow(item) {
    const rowStyle = {
      backgroundImage:
        "linear-gradient(to right, #e9ecef " +
        Math.round(item.percent) +
        "%, #ffffff " +
        Math.round(item.percent) +
        "%)",
    };

    return (
      <tr key={item.name} style={rowStyle}>
        <td>
          {this.renderFlag(item)}
          {this.renderFlag2(item)}
          {item.name}
        </td>
        <td>{Math.round(item.average)}ms</td>
        <td style={{ padding: 0 }} className="no-mobile">
          <Sparklines
            data={item.values || []}
            width={200}
            height={48}
            limit={100}
          >
            <SparklinesLine
              color="#B8BABC"
              vector-effect="non-scaling-stroke"
            />
          </Sparklines>
        </td>
      </tr>
    );
  }

  renderError(item) {
    return (
      <tr key={item.name}>
        <td>
          {this.renderFlag(item)}
          {this.renderFlag2(item)}
          {item.name}
        </td>
        <td>
          <span className="badge badge-danger">NO RESPONSE</span>
        </td>
        <td className="no-mobile">
          <a
            href="javascript:void(0);"
            onClick={speedtest.retry.bind(null, item.domain)}
          >
            Retry
          </a>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <button className="dark-mode-toggle" onClick={this.toggleDarkMode}>
          {this.state.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <div className="export-buttons">
          <button
            className={`btn ${this.state.isPaused ? 'btn-success' : 'btn-warning'}`}
            onClick={this.togglePauseResume}
          >
            {this.state.isPaused ? '▶️ Resume Testing' : '⏸️ Pause Testing'}
          </button>
          <button className="btn btn-success" onClick={this.exportToCSV}>
            📊 Export to CSV
          </button>
          <button className="btn btn-info" onClick={this.exportToJSON}>
            📄 Export to JSON
          </button>
        </div>

        <table className="table results-table">
          <thead>
            <tr>
              <th>Data Center</th>
              <th>Average Latency</th>
              <th className="no-mobile">History</th>
            </tr>
          </thead>
          <tbody>{this.props.history.map(this.renderRow)}</tbody>
          <tbody>{this.props.blockList.map(this.renderError)}</tbody>
        </table>
        <p>
          Share your results with other people on twitter {this.renderButton()}
        </p>
        <p>
          Compare your speed with others by watching the{" "}
          <a href="https://twitter.com/search?q=%23AzureSpeedTest&src=hash&mode=realtime">
            #GitHubAzureDevOpsSpeedTest
          </a>{" "}
          hashtag.
        </p>
        <p>
          <a href="https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest">
            Fork
          </a>{" "}
          on GitHub.
        </p>
        <p>
          <a href="https://github.com/richorama/AzureSpeedTest2">
            Forked from and inspired from
          </a>{" "}
          on GitHub.
        </p>
        <p>
          Created by <a href="https://www.twitter.com/jnowwwak/">@jnowwwak</a>
        </p>
        <p>
          The{" "}
          <a href="https://azure.microsoft.com/en-us/regions/">Azure Website</a>{" "}
          has a map with all data centers, and a{" "}
          <a href="https://azure.microsoft.com/en-us/regions/services/">
            feature matrix
          </a>
          .
        </p>
        <p>
          <small>
            The latency times are indicative only, and do not represent the
            maxium performance, achievable from GitHub and Azure DevOps. Use
            this website purely as a tool to gauge which Azure Data Center could
            be the best for your location.
          </small>
        </p>
      </div>
    );
  }
};
