// @ts-check
// using https://stackoverflow.com/questions/62586022/node-js-how-to-read-write-a-markdown-file-changing-its-front-matter-metadata

const matter = require("gray-matter");
const { readdir, readFile } = require("fs/promises");
const { rename, mkdirSync } = require("node:fs");
const fsExtra = require('fs-extra');

const directory = "notionContent";

async function removePreviousFiles() {
  // using https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
  fsExtra.emptyDirSync("content");
  // make directories
  // using https://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing
  mkdirSync("content/reviews", { recursive: true })
  mkdirSync("content/fiction", { recursive: true })
  mkdirSync("content/misc", { recursive: true })
}

async function renameFiles(filename) {
  const filepath = `${directory}/${filename}`;
  const { data: frontMatter } = matter(await readFile(filepath));
  const tg_path = frontMatter.tg_path || "/misc/"
  const newPath = "content" + tg_path + filename;

  rename(filepath, newPath, (err) => {
    if (err) throw err;
    console.log("Rename complete!");
  });
}

async function main() {
  console.log("running");
  await removePreviousFiles();

  const filenames = await readdir(directory);
  const markdownFilenames = filenames.filter((f) => f.endsWith(".md"));

  await Promise.all(markdownFilenames.map(renameFiles));
}

main().catch(console.error);
