.PHONY: clean build build-static build-js

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

build: build-static build-js

build-static: $(DIST)/index.html

build-js: $(DIST)/app.js

preview: build
	$(NPX) http-serve $(DIST) -a localhost -p 8080

$(DIST):
	$(MKD) $(DIST)

$(DIST)/index.html: $(DIST)
	$(CP) public/index.html $(DIST)/index.html

$(DIST)/app.js: $(DIST) $(JS_SRC)
	$(NPM) run build:bundle

$(JS_SRC): $(TS_ALL)
	$(NPM) run build:ts
