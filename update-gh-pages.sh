#!/bin/bash
cp -rf www ../leaf-gh-pages-www
git checkout gh-pages
cp -rf ../leaf-gh-pages-www/* .
rm -rf ../leaf-gh-pages-www
git add -A
git commit -m "update gh-pages"
git push
git checkout master
