#!/bin/bash
css-sprite src/scss/images src/scss/images/sprites/*.png --style=src/scss/partials/sprite.scss --processor=scss --name=icons --css-image-path=images --template=sprite-scss-template.mustache
