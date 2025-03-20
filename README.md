# TomTom Map PowerApps Integration

This repository contains the source code for integrating TomTom Maps into Power Apps using a combination of a custom PCF control and a React-based map application loaded via iframe.

## 🗂 Project Structure

```
tomtom-map-powerapps/
├── tomtom-map-iframe/    # React map application (loaded inside iframe)
└── tomtom-map-pcf/       # Power Apps PCF control that loads the React app
```

## 📦 Project Details

### `tomtom-map-iframe`
A React application created using **Create React App**. It's responsible for rendering the map, making API requests, e.g. Calculate Route API, and visualizing the API response.

#### Features:
- Map rendering using TomTom Maps SDK.
- Visualization of API responses.
- Receives configuration via `postMessage` from PCF control.

### `tomtom-map-pcf`
A **PowerApps Component Framework (PCF)** control that:
- Embeds the React map app using an `<iframe>`.
- Sends request configuration to the React app using `postMessage`.
- Allows users to view routing data and map visualizations directly within both canvas and model-driven apps.

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Power Platform CLI (`pac`)
- Visual Studio Code (recommended)

### Running `tomtom-map-iframe` locally

```bash
cd tomtom-map-iframe
yarn
yarn start
```

- The app will run on `http://localhost:3000`
- Used automatically by the PCF control in local dev mode

### Building for Production (Azure deployment)

```bash
cd tomtom-map-iframe
yarn deploy
```

The `deploy` command uploads the contents of the `build` directory to an Azure Blob Storage container.

If changing the deployment location, update the production URL in `tomtom-map-pcf/index.ts` accordingly.

### Building and Testing `tomtom-map-pcf`

```bash
cd tomtom-map-pcf
yarn
yarn build:watch
```

This will build the control and open in the local PCF Control Sandbox.

When running in the sandbox, the control will attempt to load the map page from `http://localhost:3000` so ensure that `tomtom-map-iframe` is running locally first.
