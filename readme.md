[![Node CI](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/nodejs.yml)
[![Deploy static content to Pages](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/static.yml/badge.svg)](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/static.yml)
[![CI/CD Pipeline](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Azure4DevOps/GithubAzureDevOpsSpeedTest/actions/workflows/ci-cd.yml)

# GitHub and Azure DevOps Speed Test

Measures the network latency between your browser and GitHub and each of the Azure DevOps region.

🚀 **Live Demo:** https://azure4devops.com/GithubAzureDevOpsSpeedTest/

## ✨ Features

- 📊 **Real-time Latency Testing** - Test network latency to GitHub and Azure DevOps regions
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistent preference
- 💾 **Export Results** - Download test results as CSV or JSON
- 📝 **Test History** - Automatically saves test history to localStorage
- 📱 **Mobile Responsive** - Works great on all devices
- ✅ **Unit Tests** - Comprehensive test coverage with Mocha
- 🔄 **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

Run local development server:

```bash
npm start
```

This will start http-server on port 8080 and open your browser automatically.

### Building

Build the production version:

```bash
npm run build
```

This will:

1. Run ESLint to check code quality
2. Bundle and minify the JavaScript with Browserify and Babel

### Testing

Run unit tests:

```bash
npm test
```

### Watch Mode

For development with auto-rebuild:

```bash
npm run watch
```

## 📊 Export Features

The application now includes two export options:

- **CSV Export** - Download results in spreadsheet-compatible format
- **JSON Export** - Download results in JSON format for further processing

All exports include timestamp, location names, average latency, and min/max values.

## 🌙 Dark Mode

Click the toggle button in the top-right corner to switch between light and dark modes. Your preference is automatically saved to localStorage.

## 💾 Persistent History

Test results are automatically saved to localStorage, allowing you to:

- View historical test data
- Compare results over time
- Resume where you left off

## Building the UI

You can use these commands to build the User Interface:

```
$ npm install
$ npm run build
```

## 🧪 Testing

Unit tests are located in the `test/` directory. They cover:

- Location data validation
- URL format checking
- Data structure integrity

## 🔄 CI/CD

The project includes a GitHub Actions workflow that:

- Runs tests on multiple Node.js versions (18.x, 20.x)
- Performs linting
- Builds the project
- Deploys to GitHub Pages automatically on push to master

## Inspired

Forked and inspired from https://github.com/richorama/AzureSpeedTest2
needed to change to fetch instead of Ajax call because of no option to configure CORS

## Thoughts

- Azure DevOps regions response time, at least for me are very similar to https://richorama.github.io/AzureSpeedTest2/ hitting the same Azure region plus few extra 1-5 ms
- GitHub response time is better usually than Azure DevOps, but time can come maybe from better CDN setup, as GitHub from begging was designed to public open source projects

## 📦 Dependencies

**Production:**

- React 18.3.1
- React-DOM 18.3.1
- React-Sparklines 1.7.0

**Development:**

- Babel 6.24.1
- Browserify 17.0.0
- ESLint 8.57.1
- Mocha 11.7.5
- http-server 14.1.1

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

See LICENSE file for details.

## 👨‍💻 Author

Created by [@jnowwwak](https://www.twitter.com/jnowwwak/)

## Preview

![image](https://user-images.githubusercontent.com/5168275/224501609-78351378-7f89-4d92-aad2-56902cf86a4c.png)
