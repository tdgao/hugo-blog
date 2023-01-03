const markdownService = require("motionlink-cli/lib/services/markdown_service");
const ObjectTransformers = markdownService.ObjectTransformers;

function validFilename(string) {
  return string.replace(/[\/|\\:*?"<>]/g, " ");
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
        // syntax must be {{{ variable }}} - i.e. no spaces between brackets
        /** todo
         *
         */
        const properties = page.data.properties;

        const filename = validFilename(properties["Name"].title[0].plain_text);
        const title = validFilename(
          ObjectTransformers.transform_all(properties["Name"].title)
        );
        const content = ctx.genMarkdownForBlocks(page.blocks);
        const date = properties["Date"].date.start;

        const category = properties["Category"].select.name;
        const slug =
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
            slug: slug,
            date: date,
          },
        };
      },
    },
    alsoUses: [],
  },
];

module.exports = rules;
