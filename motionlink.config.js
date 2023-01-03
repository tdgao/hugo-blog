const markdownService = require("motionlink-cli/lib/services/markdown_service");
const ObjectTransformers = markdownService.ObjectTransformers;

function validFilename(s) {
  let result = s.replace(/[\/|\\:*?"<>]/g, " "); // removing all invalid characters
  result = result.replace(/\s/g, ''); // remove all spacing
  return result;
}
function validTitle(s) {
  let result = s.replace(/[\/|\\:*?"<>]/g, " "); // removing all invalid characters
  result = result.replace(/\s{2,}/g, ' ').trim(); // remove double and outer spacing
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
        // NOTE - when using variables in page_template.md
        // syntax for page_template.md must be {{{ variable }}} - i.e. no spaces between brackets

        /** todo
         * home page should show all's top 3 and have see more button
         * have a share button on the bottom of the page
         * do work on single's
         * fix article titlesred underline to be yellow
         * vs code - set disable formatting on markdown files
         */
        const properties = page.data.properties;

        const filename = validFilename(properties["Name"].title[0].plain_text);
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
