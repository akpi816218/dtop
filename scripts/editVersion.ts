import { readFile, writeFile } from 'fs/promises';

await writeFile(
	'src/index.ts',
	(
		await readFile('src/index.ts', 'utf-8')
	).replace(
		'$VERSION',
		JSON.parse(await readFile('package.json', 'utf-8')).version
	)
);
