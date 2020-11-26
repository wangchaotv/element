## npm run dist

```
|- npm run dist
    |- npm run clean
    |- npm run build:file
    |- npm run lint
    |- npm run webpack:conf
    |- npm run webpack:common
    |- npm run webpack:component
    |- npm run build:utils
    |- npm run build:umd
    |- npm run build:theme
```

## npm run dev

```
|- npm run dist
    |- npm run bootstrap
    |- npm run build:file
    |- webpack:server
    |- npm run webpack:conf
```

## npm run deploy:build

```

```

# npm run build:file

> 改命令主要用途构建项目的文档

```bash
node build/bin/iconInit.js
node build/bin/build-entry.js
node build/bin/i18n.js
node build/bin/version.js
```
