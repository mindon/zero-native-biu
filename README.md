# ZeroN-biu

A minimal zero-native desktop app with a web frontend with html + typescript, using <https://github.com/mindon/biu>  based on <https://bun.sh>.

## Requirements

- **zig** from <https://ziglang.org/>
- **zero-native** from <https://zero-native.dev/>
- **bun** from <https://bun.sh>
- **biu** from <https://github.com/mindon/biu>


## Setup

`zig build dev`, `zig build run`, and `zig build package` install frontend dependencies automatically.

## Commands

```sh
zig build dev
zig build run
zig build test
zig build package
zero-native doctor --manifest app.zon
```

`zig build dev` starts the frontend dev server from `app.zon`, waits for it, and launches the native shell with `ZERO_NATIVE_FRONTEND_URL`.

Frontend:

- Type: next
- Production assets: `frontend/dist`
- Dev URL: `http://127.0.0.1:5118/`

## Web Engines

The generated app defaults to the system WebView. On macOS you can switch to Chromium/CEF with:

```sh
zero-native cef install
zig build run -Dplatform=macos -Dweb-engine=chromium
```

`zero-native cef install` downloads zero-native's prepared CEF runtime, including the native wrapper library.

For one-command local setup, opt into build-time install:

```sh
zig build run -Dplatform=macos -Dweb-engine=chromium -Dcef-auto-install=true
```

Use `-Dcef-dir=/path/to/cef` when you keep CEF outside the platform default under `third_party/cef`.

```sh
zero-native doctor --web-engine chromium
```

Diagnostics:

- Set `ZERO_NATIVE_LOG_DIR` to override the platform log directory during development.
- Set `ZERO_NATIVE_LOG_FORMAT=text|jsonl` to choose persistent log format.
