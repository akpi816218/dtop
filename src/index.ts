/**
	dtop - A simple CLI tool to create desktop entry files for GNU/Linux.
	Copyright (C) 2023  Akhil Pillai

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { env, exit, stderr, stdout } from 'process';
import { existsSync } from 'fs';
import { json as fetchPackageToJson } from 'npm-registry-fetch';
import { Command } from '@commander-js/extra-typings';
import 'colors';
import colors from 'colors';
import { keyInYN, question, questionPath } from 'readline-sync';
const { disable: disableColors } = colors;

env.NO_COLOR !== undefined && env.NO_COLOR !== '' && disableColors();

const GNUNotice = `dtop  Copyright (C) 2023  Akhil Pillai
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it under certain conditions.`,
	InteractiveNotice =
		`${GNUNotice.yellow}\n\n` +
		`Press Ctrl+C to exit. For help, exit and run 'dtop -h'.\nRun 'dtop -v' to check for updates.\n\n`
			.cyan,
	Program = new Command('dtop')
		.name('dtop'.green)
		.helpOption('-h, --help', "You're looking at it.")
		.action(() => {
			stdout.write(InteractiveNotice);
			const name = question('Name of the application: '.magenta, {}),
				comment = question(
					'Comment for the application (Enter to skip): '.magenta
				),
				exec = questionPath('Path to the executable: '.magenta, {
					min: 1,
					validate(path) {
						return (
							existsSync(path) ||
							keyInYN(`File \'${path}\' does not exist. Continue?`)
						);
					}
				}),
				terminal = keyInYN('Run in terminal?'),
				type = question('Type (Application/Link/Directory): '.magenta, {
					defaultInput: 'Application',
					limit: ['Application', 'Link', 'Directory']
				}),
				icon = questionPath('Path to the icon: '.magenta, {
					validate(path) {
						if (path.length === 0) return false;
						// return (path.length > 0 &&
						// 	existsSync(path) ||
						// 	keyInYN(`File \'${path}\' does not exist. Continue?`)
						// );
					}
				}),
				possibleCategories = [
					// Registered categories
					'AudioVideo',
					'Audio',
					'Video',
					'Development',
					'Education',
					'Game',
					'Graphics',
					'Network',
					'Office',
					'Science',
					'Settings',
					'System',
					'Utility',
					// Additional categories
					'Building',
					'Debugger',
					'IDE',
					'GUIDesigner',
					'Profiling',
					'RevisionControl',
					'Translation',
					'Calendar',
					'ContactManagement',
					'Database',
					'Dictionary',
					'Chart',
					'Email',
					'Finance',
					'FlowChart',
					'PDA',
					'ProjectManagement',
					'Spreadsheet',
					'WordProcessor',
					'2DGraphics',
					'VectorGraphics',
					'RasterGraphics',
					'3DGraphics',
					'Scanning',
					'OCR',
					'Photography',
					'Publishing',
					'Viewer',
					'TextTools',
					'DesktopSettings',
					'HardwareSettings',
					'Printing',
					'PackageManager',
					'Dialup',
					'InstantMessaging',
					'Chat',
					'IRCClient',
					'Feed',
					'FileTransfer',
					'HamRadio',
					'News',
					'P2P',
					'RemoteAccess',
					'Telephony',
					'TelephonyTools',
					'VideoConference',
					'WebBrowser',
					'WebDevelopment',
					'Midi',
					'Mixer',
					'Sequencer',
					'Tuner',
					'TV',
					'AudioVideoEditing',
					'Player',
					'Recorder',
					'DiscBurning',
					'ActionGame',
					'AdventureGame',
					'ArcadeGame',
					'BoardGame',
					'BlocksGame',
					'CardGame',
					'KidsGame',
					'LogicGame',
					'RolePlaying',
					'Shooter',
					'Simulation',
					'SportsGame',
					'StrategyGame',
					'Art',
					'Construction',
					'Music',
					'Languages',
					'ArtificialIntelligence',
					'Astronomy',
					'Biology',
					'Chemistry',
					'ComputerScienceComputerSience software',
					'DataVisualization',
					'Economy',
					'Electricity',
					'Geography',
					'Geology',
					'Geoscience',
					'History',
					'Humanities',
					'ImageProcessing',
					'Literature',
					'Maps',
					'Math',
					'NumericalAnalysis',
					'MedicalSoftware',
					'Physics',
					'Robotics',
					'Spirituality',
					'Sports',
					'ParallelComputing',
					'Amusement',
					'Archiving',
					'Compression',
					'Electronics',
					'Emulator',
					'EngineeringEngineering software, e.g. CAD programs',
					'FileTools',
					'FileManager',
					'TerminalEmulator',
					'Filesystem',
					'Monitor',
					'Security',
					'Accessibility',
					'Calculator',
					'ClockA clock application/applet',
					'TextEditor',
					'Documentation',
					'Adult',
					'Core',
					'KDE',
					'GNOMEApplication based on GNOME libraries',
					'XFCE',
					'DDE',
					'GTK',
					'Qt',
					'Motif',
					'Java',
					'ConsoleOnly'
				],
				categories = question(
					`Space-separated categories to show this app in (Enter to skip, see ${
						'https://github.com/akpi816218/dtop#categories'.cyan
					} for info):`
				)
					.split(' ')
					.filter((category) => possibleCategories.includes(category));
			stdout.write(
				`\n\n[Desktop Entry]\nName=${name}${
					comment && `\nComment=${comment}`
				}\nExec=${
					terminal ? 'x-terminal-emulator -e ' : ''
				}${exec}\nType=${type}\nIcon=${icon}\nCategories=${categories.join(
					';'
				)}\n\n`.blue.magenta.green
			);
		}),
	Version = '$VERSION' as const;

Program.version(Version)
	.command('version')
	.description('Print the version and check for updates')
	.aliases(['v', '-v', '--version'])
	.action(async () => {
		stdout.write(
			`${GNUNotice.yellow}\n\n` +
				`Local installation is dtop@${Version}\n`.green +
				`Fetching package info from NPM, stand by for up to 5 seconds...\n`.cyan
		);
		stdout.write(
			`dtop@latest version published on  ${
				(
					(await fetchPackageToJson('dtop', {
						timeout: 5000
					}).catch(() => {
						stdout.write('Failed to fetch version info from NPM\n');
						exit(1);
					})) as unknown as {
						'dist-tags': {
							latest: string;
						};
					}
				)['dist-tags'].latest.magenta
			}\n`.blue
		);
		exit(0);
	});
Program.configureHelp({
	optionTerm: (o) => o.name().green,
	optionDescription: (o) => o.description.cyan
});

try {
	Program.parse();
} catch (err: any) {
	stderr.write(err.message.red ?? err);
}
