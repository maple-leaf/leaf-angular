#!/bin/bash
rm scss/icons/sp.css scss/partials/compass-icons.scss scss/images/icons.png scss/images/sprites-*.png
compass compile scss/icons/sp.scss --sass-dir scss/icons --css-dir scss/icons --images-dir scss/images --no-line-comments
mv scss/images/sprites-*.png scss/images/icons.png
#cp scss/icons/sp.css scss/partials/compass-icons.scss
while read LINE
do
    echo ${LINE//\/scss\/images\/sprites-*.png/images\/icons.png} >> scss/partials/compass-icons.scss
    #echo $LINE >> scss/partials/compass-icons.scss
done < scss/icons/sp.css
