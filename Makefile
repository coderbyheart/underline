.DEFAULT_GOAL := help
.PHONY: help dist

# Stylesheets

dist/css/%.min.css: dist/css/%.css
	node_modules/.bin/uglifycss $< > $@

dist/css/%.css: scss/%.scss scss/**/*.scss
	@mkdir -p $(dir $@)
	node_modules/.bin/node-sass $< $@

# JavaScript

dist/js/%.min.js: dist/js/%.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/uglifyjs $< -o $@

dist/js/%.js: js/%.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@ -t [ babelify ]

# Fonts

fonts := $(patsubst node_modules/font-awesome/%,dist/%,$(shell find node_modules/font-awesome/fonts/fontawesome-webfont.* -type f))

dist/fonts/%: node_modules/font-awesome/fonts/%
	@mkdir -p $(dir $@)
	cp $< $@

# MAIN

dist: dist/css/underline.min.css dist/js/underline.min.js $(fonts) ## Build for release

# Cleanup

clean: ## Clean build artefacts
	rm -rf dist

# HELPERS

.SECONDARY: dist/css/underline.css dist/js/underline.js # So they don't get deleted every run

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
