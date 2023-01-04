const markdownService = require("motionlink-cli/lib/services/markdown_service");
const ObjectTransformers = markdownService.ObjectTransformers;

function validFilename(s) {
  let result = s.replace(/[\/|\\:*?"<>]/g, " ").trim(); // removing all invalid characters
  return result;
}
function convertFilename(s) {
  let result = validFilename(s).toLowerCase();
  result = result.replace(/\s/g, "-"); // set spacing to dash
  result = result.replace(/-{2,}/g, "-"); // maximum one continuous dash
  return result;
}
function validTitle(s) {
  let result = s.replace(/[\/|\\:*?"<>]/g, " ").trim(); // removing all invalid characters
  result = result.replace(/\s{2,}/g, " "); // remove double and outer spacing
  return result;
}

/** @type {import("motionlink-cli/lib/models/config_models").TemplateRule[]} */
const rules = [
  {
    template: "page_template.md",
    outDir: "./notionContent",
    uses: {
      database: "articles",
      fetchBlocks: true,
      map: (page, ctx) => {
        // page_template.md used for Notion pages to .md
        // variables in page_template.md must be {{{ variable }}} - i.e. no spaces between brackets

        const properties = page.data.properties;

        const definedFilename =
          properties["Filename"]?.rich_text[0]?.plain_text;
        const inferredFilename = properties["Name"].title[0].plain_text;
        const filename = definedFilename
          ? validFilename(definedFilename)
          : convertFilename(inferredFilename);

        const title = validTitle(
          ObjectTransformers.transform_all(properties["Name"].title)
        );
        const content = ctx.genMarkdownForBlocks(page.blocks);
        const date = properties["Date"].date.start || page.data.created_time;

        const category = properties["Category"].select.name;
        const tg_path =
          category === "Fiction"
            ? "/fiction/"
            : category === "Reviews"
            ? "/reviews/"
            : "/misc/";

        console.log(properties);
        // Use page.otherData to pass computed, or any other, data to template files.
        return {
          ...page,
          _title: filename,
          otherData: {
            title: title,
            content: content,
            tg_path: tg_path,
            date: date,
          },
        };
      },
    },
    alsoUses: [],
  },
];

module.exports = rules;
