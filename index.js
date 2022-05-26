#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");

async function main(folder) {
	const modulefolder = __dirname;
	const sampleFolder = path.join(modulefolder, "node_modules/demo-pop-app");
	try {
		await fs.mkdir(folder);
	} catch (e) {
		try {
			let files = await fs.readdir(folder);
			let invalidFiles = files.filter((f) => ![".git"].includes(f));
			if (invalidFiles.length > 0) throw new Error("directory not empty");
		} catch (e2) {
			console.error(e.message);
			console.error(`Unable to create directory '${folder}'.`);
			console.error(`Target directory must be exist and be empty.`);
			process.exit(1);
		}
	}
	try {
		await fs.copy(sampleFolder, folder);
		let { scripts, dependencies, devDependencies } = JSON.parse(
			await fs.readFile(path.join(folder, "package.json"))
		);
		let packageJson = {
			name: "demo-pop-app",
			version: "1.0.0",
			scripts,
			dependencies,
			devDependencies,
		};
		await fs.writeFile(
			path.join(folder, "package.json"),
			JSON.stringify(packageJson, null, "  ")
		);
		const gitignoreSample = fs.readFileSync("./demo-pop-app-gitignore.txt");
		await fs.writeFile(path.join(folder, ".gitignore"), gitignoreSample);
	} catch (e) {
		console.error(e);
		console.error("Unable to copy app into newly created directory.");
		process.exit(1);
	}
	console.log(`A new pop! JS app is now in your "${folder}" folder.`);
	console.log("The commands below will start the app.\n");
	console.log(`1. cd ${folder}`);
	console.log("2. npm install");
	console.log("3. npm run devServer\n");
}
if (process.argv.length < 3) {
	console.log("create-pop-app <foldername>");
	process.exit(1);
}
main(process.argv[2]);
