.PHONY: clean build build-static build-js build-workers

CP = cp -R
MKD = mkdir -p
NPM = npm
NPX = npx
RM = rm -rf

DIST = ./dist
OUT = ./out
SRC = ./src

TS_SRC = $(shell find $(SRC) -type f -name '*.ts')
TSX_SRC = $(shell find $(SRC) -type f -name '*.tsx')
TS_ALL = $(TS_SRC) $(TSX_SRC)
JS_SRC = $(patsubst $(SRC)%.ts,$(OUT)%.js,$(TS_SRC)) \
		$(patsubst $(SRC)%.tsx,$(OUT)%.js,$(TSX_SRC))

clean:
	$(RM) $(DIST) $(OUT)

build: build-static build-js build-css build-workers

build-static: $(DIST)/index.html $(DIST)/wasm/sql-wasm.wasm

build-js: $(DIST)/app.js

build-css: $(DIST)/stylesheet.css

build-workers: $(DIST)/workers/database.js

preview: build
	$(NPX) http-serve $(DIST) -a localhost -p 8080

$(DIST):
	$(MKD) $(DIST)

$(DIST)/wasm:
	$(MKD) $(DIST)/wasm

$(DIST)/index.html: $(DIST)
	$(CP) public/index.html $(DIST)/index.html

$(DIST)/wasm/sql-wasm.wasm: $(DIST)/wasm
	$(CP) node_modules/sql.js/dist/sql-wasm.wasm $(DIST)/wasm/sql-wasm.wasm

$(DIST)/app.js: $(DIST) $(JS_SRC)
	$(NPM) run build:bundle

$(DIST)/workers/database.js: $(DIST) $(JS_SRC)
	$(NPM) run build:workers

$(JS_SRC): $(TS_ALL)
	$(NPM) run build:ts

$(DIST)/stylesheet.css: $(DIST) $(SRC)/main.css
	$(NPM) run build:css
