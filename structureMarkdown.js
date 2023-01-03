// @ts-check
// using https://stackoverflow.com/questions/62586022/node-js-how-to-read-write-a-markdown-file-changing-its-front-matter-metadata

const { readdir, readFile, unlink } = require("fs/promises");
const matter = require("gray-matter");
const { stringify } = require("yaml");
const { rename } = require("node:fs");
const path = require("path");

const directory = "notionContent";

async function removePreviousFiles() {
  // using https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
  // 
  let dir = "content/fiction";
  for (const file of await readdir(dir)) {
    await unlink(path.join(dir, file));
  }
  dir = "content/reviews";
  for (const file of await readdir(dir)) {
    await unlink(path.join(dir, file));
  }
  dir = "content/misc";
  for (const file of await readdir(dir)) {
    await unlink(path.join(dir, file));
  }
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
