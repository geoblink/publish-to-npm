FROM node:12-alpine

LABEL "com.github.actions.name"="Publish to NPM"
LABEL "com.github.actions.description"="Automatically publish current version to NPM if not already published"
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="gray-dark"

RUN yarn global add @geoblink/publish-to-npm

ENTRYPOINT [ "publish-to-npm" ]
