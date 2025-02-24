## Weather Project

This project has been created by a student at Parsity, an online software engineering course. The work in this repository is wholly of the student based on a sample starter project that can be accessed by looking at the repository that this project forks.

If you have any questions about this project or the program in general, visit [parsity.io](https://parsity.io/) or email hello@parsity.io.

## Live Demo

Live demo at [https://tomwinskell.github.io/weather-project/](https://tomwinskell.github.io/weather-project/)

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (ES6+)
- **Module Bundler**: Webpack
- **API**: OpenWeatherMap API (or specify the API you're using)
- **Version Control**: Git

## Project Structure

```
weather-project/
├── dist/                    # Compiled and minified files
├── src/                     # Source files
│   ├── index.html           # Main HTML file
│   ├── scripts/             # JavaScript files
│   │   ├── main.js          # Entry point for JS
│   │   └── modules/         # ES6 modules
│   │       ├── fetchData.js # Custom fetch API function
│   │       ├── handlers.js  # handleSubmit and handleInput functions
│   │       └── templateM.js # Functions to inject data into html templates
├── .gitignore               # Git ignore file
├── package.json             # NPM package configuration
├── package-lock.json        # NPM package lock file
└── webpack.config.js        # Webpack configuration
```

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tomwinskell/weather-project.git
   cd weather-project
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and npm installed. Then, run:

   ```bash
   npm install
   ```

3. **API Key Configuration**:
   Obtain an API key from [OpenWeatherMap](https://openweathermap.org/api) and configure it in your project:

   - Create a `config.js` file in `/variables` directory:
     ```
     WX_API_KEY=your_openweathermap_api_key
     ```
   - Ensure your application code accesses this key appropriately.

4. **Build the Project**:
   To bundle the JavaScript modules and prepare the project for deployment:

   ```bash
   npm run build
   ```

   This will generate the `dist/` directory with the compiled files.

5. **Start the Development Server**:
   For development purposes, you can start a local server with hot reloading:
   ```bash
   npm start
   ```
   This utilizes `webpack-dev-server` for serving the project locally.

## Deployment

To deploy the application:

1. **Build for Production**:
   Ensure the code is optimized for production:

   ```bash
   npm run build
   ```

   This updates the `dist/` directory with the latest production-ready code.

2. **Serve the `dist/` Directory**:
   Deploy the contents of the `dist/` directory to your preferred hosting service (e.g., GitHub Pages, Netlify, Vercel).

## Webpack Configuration

The project uses Webpack to bundle JavaScript modules. Below is an overview of the `webpack.config.js`:

```javascript
'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/scripts/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};
```

### Key Points:

- **Entry Point**: `./src/scripts/main.js` is the main JavaScript file that imports other modules.
- **Output**: Bundled files are output to the `dist/` directory with the filename `main.js`.
- **DevServer**: Configured to serve content from the `dist/` directory, running on port 8080.

## JavaScript Module Structure

The project follows the ES6 module pattern:

- **`main.js`**: Serves as the entry point and orchestrates the application by importing necessary modules.

Each module is imported as needed:

```javascript
import { handleInput, handleSubmit, renderPage } from './modules/handlers.js';
import cities from '../assets/cities.json';
```

This modular approach promotes code reusability and maintainability.
