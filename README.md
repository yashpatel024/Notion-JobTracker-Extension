# Notion-JobTracker-Extension

A Chrome extension that automates job application tracking and integrates with Notion for seamless data management.

## Features

- Automatic capture of job details (description, URL, company name, position)
- Job application status tracking
- Integration with Notion API for data storage
- React-based user interface
- Built with Chrome Extension Manifest V3

## Technologies Used

- React 18
- Webpack 5
- Chrome Extension API
- Notion API
- Content Scripts
- Local Storage / IndexedDB
- OAuth 2.0 for Notion authentication

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome

## Usage

- Click the extension icon to open the popup
- Use the "Save Job" button on supported job platforms
- Update application status through the extension interface

## Development

- Run `npm start` for hot-reloading during development
- Uses React Refresh for improved development experience

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)