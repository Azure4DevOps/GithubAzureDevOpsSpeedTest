[![Node CI](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/nodejs.yml)
[![Deploy static content to Pages](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/static.yml/badge.svg)](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/static.yml)

# GitHub and Azure DevOps Speed Test

Measures the network latency between your browser and GitHub and each of the Azure DevOps region.

https://azure4devops.com/GithubAzureDevOpsSpeedTest/

## Building the UI

You can use these commands to build the User Interface:

## Inspired

Forked and inspired from https://github.com/richorama/AzureSpeedTest2
needed to change to fetch instead of Ajax call because of no option to configure CORS

## Thoughts

- Azure DevOps regions response time, at least for me are very similar to https://richorama.github.io/AzureSpeedTest2/ hitting the same Azure region plus few extra 1-5 ms
- GitHub response time is better usually than Azure DevOps, but time can come maybe from better CDN setup, as GitHub from begging was designed to public open source projects

```
$ npm install
$ npm run build
```

## Regions

1. Run `npm run build`
1. Run the site locally (I use [http-server](https://www.npmjs.com/package/http-server)) to test that the site works.

## License

MIT
