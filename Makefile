BIN = ./node_modules/.bin
BUILD_OPTIONS = --relativize --follow-requires --ignore-dependencies --ignore-node-core --cache-dir tmp/cache/build
MOCHA_OPTIONS = --compilers js:babel-core/register -t 5000 -b -R spec test/spec.js

build: node_modules/
	@bin/build $(BUILD_OPTIONS) src/ lib/ StyleSheet WebpackStyleSheet Extractor Bundler

watch: node_modules/
	@bin/build $(BUILD_OPTIONS) --watch src/ lib/ StyleSheet WebpackStyleSheet Extractor Bundler

lint: node_modules/
	@$(BIN)/eslint src/

test: lint build
	@NODE_ENV=test $(BIN)/mocha $(MOCHA_OPTIONS)

test-cov: build
	@NODE_ENV=test $(BIN)/istanbul cover $(BIN)/_mocha -- $(MOCHA_OPTIONS)

node_modules/:
	@npm install

clean:
	@rm -rf lib/ tmp/cache/build/

distclean: clean
	@rm -rf tmp/ node_modules/

push-example-to-heroku:
	@git push heroku `git subtree split --prefix example master`:master --force

release-patch: test
	@$(call release,patch)

release-minor: test
	@$(call release,minor)

release-major: test
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish

define release
	npm version $(1) -m 'release v%s'
endef

.PHONY: build watch lint test test-cov clean distclean push-example-to-heroku release-patch release-minor release-major publish
