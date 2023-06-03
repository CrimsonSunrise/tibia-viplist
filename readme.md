# Tibia Viplist Documentation

Tibia Viplist is a web application that allows you to track the online status of characters in the game Tibia without the need to logging in the game. You can add characters from different servers (worlds) and easily monitor their online/offline status. The application is built using React with Vite, and it utilizes the Tibia Data API (https://tibiadata.com) to fetch near-real-time information about the characters.

	⭐️ If you find Tibia Viplist useful, give it a star ⭐️

## Live version 🌎
You can use the app at <a href="https://tibiaviplist.vercel.app" target="_blank">https://tibiaviplist.vercel.app</a>.

## Features

1. Character Management
	* You can add multiple characters to the viplist.
	* Characters are organized by server (world) for easy navigation.
	* Characters are visually distinguished as online or offline.
	* Each character entry displays the character's name, vocation, and level (when online).
	* You can delete characters from the viplist.
	* You can copy the added character's name by clickling on it.
2. Near-real-time Character Status
	* The application fetches character status data from the Tibia Data API.
	* Characters' online/offline status is automatically updated in near-real-time.
	* The viplist refreshes periodically to display the latest character statuses (1 minute delay).
3. Persistence with Local Storage
	* The viplist is stored in the browser's local storage.
	* Characters added by the user are preserved even when the page is reloaded.
	* The local storage cache ensures that the viplist remains accessible across sessions.

## Prereqsuisites

To run Tibia Viplist locally, ensure that you have the following software installed:
* Node.js: The app requires Node.js to run.

## Getting Started

Follow these steps to set up and run Tibia Viplist on your local machine:

1. Clone the repository:
```
git clone https://github.com/your-username/tibia-viplist.git
```
2. Navigate to the project directory:
```
cd tibia-viplist
```
3. Install dependencies:
```
npm install
```
4. Start the development server:
```
npm run dev
```
>This command will start the development server and provide you with the URL where the application is running (e.g., http://127.0.0.1:3000).
5. Open the application in your web browser using the provided URL.

## Usage

1. Adding Characters
	* To add a character, enter the character name in the input field provided at the bottom of the page.
	* The character name should be exact how it appears inside the game.
	* Press the "Add" button or press Enter to add the character to the viplist.
	* The character will appear under the corresponding server (world) in the viplist.
2. Monitoring Character Status
	* The viplist automatically fetches and updates the character status periodically.
	* Characters that are currently online will be visually marked as online.
	* Characters that are offline will be visually marked as offline.
3. Removing Characters
	* To remove a character from the viplist, click the delete button (represented by a bin icon) next to the character's name when you hover it.

## Contributing and acknowledgements

Contributions to Tibia Viplist are welcome! If you find a bug, have a feature request, or would like to contribute code, please follow these steps:
1. Fork the repository on GitHub.
2. Create a new branch for your contribution.
3. Make the necessary changes and commit your code.
4. Push your branch to your forked repository.
5. Open a pull request with a detailed description of your changes.

>Please ensure that your contributions align with the project's coding style and guidelines.

* <a href="https://tibiadata.com" target="_blank">Tibia Data API</a> - External API that provides character data from the game Tibia.
* Tibia and all products related to Tibia are copyright by <a href="https://www.cipsoft.com/en/" target="_blank">CipSoft GmbH</a>.