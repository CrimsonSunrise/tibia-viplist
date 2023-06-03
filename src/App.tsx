import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Logo from "./assets/logo.png";

interface LoadingSpinnerProps {
	white?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ white }) => {
	return (
		<svg className={`spinner ${white ? "white" : ""}`} viewBox="0 0 50 50">
			<circle
				className="path"
				cx="25"
				cy="25"
				r="20"
				fill="none"
				strokeWidth="3"
			></circle>
		</svg>
	);
};

const GithubIcon = () => (
	<svg
		fill="#535bf2"
		width="20px"
		height="20px"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		data-name="Layer 1"
	>
		<path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
	</svg>
);

const BinIcon: React.FC = () => (
	<svg
		width="18px"
		height="18px"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
			fill="#FFFFFF"
		/>
	</svg>
);

interface Character {
	name: string;
	status: string;
	vocation?: string;
	level?: number;
}

function App() {
	const [newCharacter, setNewCharacter] = useState("");
	const [viplist, setViplist] = useState([]);
	const [loading, setLoading] = useState(false);
	const [addingCharacter, setAddingCharacter] = useState(false);
	const [isShowingError, setIsShowingError] = useState(false);
	const characterInputRef = useRef(null);

	let loadViplistInterval = null as ReturnType<typeof setInterval>;

	useEffect(() => {
		loadViplists();
		loadViplistInterval = setInterval(() => {
			loadViplists();
		}, 60000);
		return () => {
			clearInterval(loadViplistInterval);
		};
	}, []);

	const loadViplists = () => {
		const viplists = localStorage.getItem("viplists");
		if (viplists) {
			setLoading(true);

			const parsedViplists = JSON.parse(viplists);

			// Extract world names from the parsed viplists
			const worldNames = Object.keys(parsedViplists);

			// Sort world names alphabetically
			worldNames.sort((a, b) =>
				a.localeCompare(b, undefined, { sensitivity: "base" })
			);

			// Create an array of world objects with the sorted names
			const sortedWorldNames = worldNames.map((name) => ({ name }));

			// Update the viplist state with the sorted world names
			setViplist(sortedWorldNames);

			// Fetch online characters for the parsed viplists
			getOnlineCharacters(parsedViplists);
		}
	};

	const normalizeVocation = (vocation: string) => {
		const vocationMap: Record<string, string> = {
			Paladin: "P",
			"Royal Paladin": "RP",
			Knight: "K",
			"Elite Knight": "EK",
			Druid: "D",
			"Elder Druid": "ED",
			Sorcerer: "S",
			"Master Sorcerer": "MS",
		};

		return vocationMap[vocation] || vocation;
	};

	const getOnlineCharacters = async (viplist: Record<string, any>) => {
		let worlds: any[] = [];

		await Promise.all(
			Object.keys(viplist).map(async (worldName) => {
				const world = {
					name: worldName,
					viplist: [] as any[],
				};

				// Fetch online player data for the world
				const worldOnlineFetch = await fetch(
					`https://api.tibiadata.com/v3/world/${worldName}`
				);
				const onlineListJson = await worldOnlineFetch.json();
				const onlineList =
					onlineListJson.worlds.world.online_players.map(
						(o: any) => o.name
					);

				// Process viplist for the world
				for (const char in viplist[worldName]) {
					const character = viplist[worldName][char];
					const name = character.name;

					// Check if character is online
					const index = onlineList.indexOf(character.name);
					const status = index > -1 ? "online" : "offline";

					// Get level and vocation if character is online
					const level =
						index > -1
							? onlineListJson.worlds.world.online_players.find(
									(char: any) => char.name === name
							  ).level
							: null;
					const vocation =
						index > -1
							? normalizeVocation(
									onlineListJson.worlds.world.online_players.find(
										(char: any) => char.name === name
									).vocation
							  )
							: null;

					// Add character to viplist
					world.viplist.push({
						name,
						status,
						level,
						vocation,
					});
				}

				// Sort viplist based on status and name
				world.viplist.sort((a: any, b: any) => {
					if (b.status < a.status) {
						return -1;
					} else if (b.status > a.status) {
						return 1;
					} else {
						const nameA = a.name.toUpperCase();
						const nameB = b.name.toUpperCase();
						if (nameA < nameB) {
							return -1;
						} else if (nameA > nameB) {
							return 1;
						} else {
							return 0;
						}
					}
				});

				worlds.push(world);
			})
		);

		// Sort worlds based on name
		worlds.sort((a: any, b: any) => {
			const nameA = a.name.toUpperCase();
			const nameB = b.name.toUpperCase();

			if (nameA < nameB) {
				return -1;
			} else if (nameA > nameB) {
				return 1;
			}
			return 0;
		});

		// Update state variables
		setViplist(worlds);
		setLoading(false);
		setAddingCharacter(false);
		setNewCharacter("");

		// Set focus on character input field after a delay
		setTimeout(() => {
			characterInputRef.current?.focus();
		}, 100);
	};

	const addCharacter = async () => {
		if (!newCharacter) {
			return;
		}

		setIsShowingError(false);
		setAddingCharacter(true);

		const characterName = encodeURIComponent(newCharacter);

		// Fetch character data
		const result = await fetch(
			`https://api.tibiadata.com/v3/character/${characterName}`
		);
		const response = await result.json();

		if (response.characters.character.name === newCharacter) {
			const currentVipList = localStorage.getItem("viplists");
			if (currentVipList) {
				const parsedViplist = JSON.parse(currentVipList);

				// Check if character already exists in the viplist for the world
				if (
					parsedViplist.hasOwnProperty(
						response.characters.character.world
					)
				) {
					const foundChar = parsedViplist[
						response.characters.character.world
					].find((c: any) => c.name === newCharacter);

					if (!foundChar) {
						// Add new character to the viplist for the world
						parsedViplist[response.characters.character.world].push(
							{
								name: response.characters.character.name,
								status: "offline",
							}
						);
					}
				} else {
					// Create a new viplist entry for the world and add the character
					parsedViplist[response.characters.character.world] = [
						{
							name: response.characters.character.name,
							status: "offline",
						},
					];
				}

				// Update the viplist in local storage and fetch online characters
				localStorage.setItem("viplists", JSON.stringify(parsedViplist));
				getOnlineCharacters(parsedViplist);
			} else {
				// Create a new viplist and add the character
				const viplist: Record<string, any> = {};
				viplist[response.characters.character.world] = [
					{
						name: response.characters.character.name,
						status: "offline",
					},
				];
				localStorage.setItem("viplists", JSON.stringify(viplist));
				getOnlineCharacters(viplist);
			}
		} else {
			// Character does not exist
			console.log("Doesn't exist");
			setIsShowingError(true);

			// Hide the error message after 5 seconds
			setTimeout(() => {
				setIsShowingError(false);
			}, 5000);

			// Set focus on character input field after a delay
			setTimeout(() => {
				characterInputRef.current?.focus();
			}, 100);

			setAddingCharacter(false);
		}
	};

	const removeCharacter = (worldName: string, characterName: string) => {
		const localVipList = localStorage.getItem("viplists") as string;
		let serversList = JSON.parse(localVipList);

		// Find the viplist for the specified world
		const viplist = serversList[worldName];

		// Find the index of the character to be removed
		const characterIndex = viplist.findIndex(
			(character: any) => character.name === characterName
		);

		// Remove the character from the viplist
		viplist.splice(characterIndex, 1);

		// If the viplist becomes empty, remove the world entry
		if (viplist.length === 0) {
			delete serversList[worldName];
		}

		// Update the viplist in local storage
		localStorage.setItem("viplists", JSON.stringify(serversList));

		setLoading(true);

		// Create an array of world objects based on the updated serversList
		const worldNames = Object.keys(serversList).map((world) => ({
			name: world,
		}));

		// Update the viplist state with the updated world names
		setViplist(worldNames);

		// Fetch online characters for the updated serversList
		getOnlineCharacters(serversList);
	};

	const copyCharacterName = (characterName: string) => {
		// Send the character name to the clipboard
		navigator.clipboard.writeText(characterName);
	};

	return (
		<div className="app">
			<div className="header">
				<h1>
					<img src={Logo} alt="Tibia Viplist logo" />
					Tibia Viplist
				</h1>
			</div>

			<div className="viplists">
				{viplist.length > 0 ? (
					viplist.map((world) => {
						return (
							<div className="viplist shadow" key={world.name}>
								<div className="world">
									<div className="world-name">
										{world.name}
									</div>
								</div>
								<div className="list custom-scroll">
									{!loading ? (
										world.viplist.map((char: Character) => {
											return (
												<div
													key={`${world.name}-${char.name}`}
													className={`character ${char.status}`}
													onClick={() => {
														copyCharacterName(
															char.name
														);
													}}
													data-tooltip-id={`${world.name}-${char.name}`}
													data-tooltip-content="Copied!"
													data-tooltip-place="top"
													data-tooltip-position-strategy="absolute"
													data-tooltip-delay-hide={
														500
													}
												>
													{char.name}
													{char.vocation &&
													char.level ? (
														<span>
															{char.vocation}{" "}
															{char.level}
														</span>
													) : null}
													<button
														onClick={() => {
															removeCharacter(
																world.name,
																char.name
															);
														}}
														className="character-delete"
													>
														<BinIcon />
													</button>
													<Tooltip
														noArrow
														className="copied-tooltip"
														openOnClick
														id={`${world.name}-${char.name}`}
													/>
												</div>
											);
										})
									) : (
										<LoadingSpinner />
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="empty-viplist">
						<span>Add a character to start.</span>
					</div>
				)}
			</div>

			<div className="socials">
				<div className="info">
					<p>
						Tibia Viplist uses{" "}
						<a href="https://tibiadata.com" target="_blank">
							Tibia Data
						</a>{" "}
						to fetch almost-realtime information about tibia game.
					</p>
					<p>
						Tibia and all products related to Tibia are copyright by{" "}
						<a href="https://www.cipsoft.com/en/" target="_blank">
							CipSoft GmbH
						</a>
						.
					</p>
				</div>

				<span>
					<a
						href="https://github.com/CrimsonSunrise/tibiaviplist"
						target="_blank"
					>
						<GithubIcon /> tibiaviplist
					</a>
					{" "}- Show this repository some love 🤩
				</span>
			</div>

			<div className="add-viplist shadow">
				<input
					ref={characterInputRef}
					type="text"
					placeholder="character name"
					disabled={addingCharacter}
					value={newCharacter}
					onChange={(e) => {
						setNewCharacter(e.target.value);
						setIsShowingError(false); // Reset error state when input changes
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							addCharacter();
						}
					}}
					data-tooltip-id="character-error"
					data-tooltip-content="Character doesn't exist"
				/>
				<Tooltip
					id="character-error"
					content="Hello world!"
					place="bottom"
					className="character-info-tooltip"
					isOpen={isShowingError}
				/>

				<button onClick={addCharacter}>
					{addingCharacter ? <LoadingSpinner white /> : "Add"}
				</button>
			</div>
		</div>
	);
}

export default App;
