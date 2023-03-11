const React = require('react')
const ReactDom = require('react-dom')
const speedtest = require('./lib/speed-test')
const history = require('./lib/history')
const sl = require('react-sparklines')
const Sparklines = sl.Sparklines
const SparklinesLine = sl.SparklinesCurve

// record history
speedtest.on(history.record)

speedtest.on(() => {
  const scrollPosition = window.scrollY
  render(<Table history={history.read()} blockList={globalBlockList} />)
  window.scrollY = scrollPosition
})

let globalBlockList = []
speedtest.onBlocklistUpdate(blockList => (globalBlockList = blockList))

function render(jsx) {
  ReactDom.render(jsx, document.getElementById('content'))
}

const Table = class extends React.Component {
  constructor(props) {
    super(props)
    this.renderButton = this.renderButton.bind(this)
    this.renderFlag = this.renderFlag.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderError = this.renderError.bind(this)
  }
  renderButton() {
    let item = this.props.history[0]

    if (!item) return ''
    if (item.cdn || false) item = this.props.history[1]
    if (!item) return ''

    return (
      <a
        href={
          'https://twitter.com/intent/tweet?button_hashtag=GitHubAzureDevOpsSpeedTest&text=My%20nearest%20%23Azure%20Data%20Center%20is%20' +
          item.name +
          '%20(' +
          Math.round(item.average) +
          'ms).%20Find%20out%20yours%20http%3A%2F%2Fazure4devops.com%20#GitHubAzureDevOpsSpeedTest'
        }
        className="btn btn-primary btn-large"
        data-size="large"
        data-related="two10degrees"
        data-dnt="true"
      >
        Tweet your results
      </a>
    )
  }
  renderFlag(item) {
    if (!item.icon) return ''
    return <img src={item.icon} className="icon" itemType="image/svg" />
  }
  renderRow(item) {
    const rowStyle = {
      backgroundImage:
        'linear-gradient(to right, #e9ecef ' +
        Math.round(item.percent) +
        '%, #ffffff ' +
        Math.round(item.percent) +
        '%)'
    }

    return (
      <tr key={item.name} style={rowStyle}>
        <td>
          {this.renderFlag(item)}
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
    )
  }

  renderError(item) {
    return (
      <tr key={item.name}>
        <td>
          {this.renderFlag(item)}
          {item.name}
        </td>
        <td>
          <span className="badge badge-danger">NO RESPONSE</span>
        </td>
        <td className="no-mobile">
          <a href="javascript:void(0);" onClick={speedtest.retry.bind(null, item.domain)}>Retry</a>
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div>
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
          Compare your speed with others by watching the{' '}
          <a href="https://twitter.com/search?q=%23AzureSpeedTest&src=hash&mode=realtime">
            #GitHubAzureDevOpsSpeedTest
          </a>{' '}
          hashtag.
        </p>
        <p>
          <a href="https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest">Fork</a> on
          GitHub.
        </p>
        <p>
          <a href="https://github.com/richorama/AzureSpeedTest2">Forked from and inspired from</a> on
          GitHub.
        </p>
        <p>
          Created by <a href="https://www.twitter.com/jnowwwak/">@jnowwwak</a>
        </p>
        <p>
          The{' '}
          <a href="https://azure.microsoft.com/en-us/regions/">Azure Website</a>{' '}
          has a map with all data centers, and a{' '}
          <a href="https://azure.microsoft.com/en-us/regions/services/">
            feature matrix
          </a>
          .
        </p>
        <p>
          <small>
            The latency times are indicative only, and do not represent the
            maxium performance, achievable from GitHub and Azure DevOps. Use this website
            purely as a tool to gauge which Azure Data Center could be the best
            for your location.
          </small>
        </p>
      </div>
    )
  }
}
