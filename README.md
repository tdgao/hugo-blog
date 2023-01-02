# Hugo + Notion Static Blog Website

A simple blogging website created with [Hugo](https://gohugo.io) as the static site generator and [Notion](https://www.notion.so/product) acting as the CMS. Gluing the two together is [MotionLink](https://motionlink.lytowl.com). TODO - use netlify to deploy

## Development

This project is built with [Hugo](https://gohugo.io/) and Notion. 

To run the project for development, install hugo and run `hugo server`.

Dev Notes: 

- `motionlink.config.js` to setup how notion pages are pulled into the codebase
- MotionLink detects when a page has a `Status` property changes, and pushes a GitHub tag if the value is `Published` , `Completed` or `Public`.
- GitHub actions is used to push to hosting service