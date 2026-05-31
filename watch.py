#!/usr/bin/env python3

import subprocess
import sys
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

import watchfiles

SCRIPT_ROOT = Path(__file__).parent
BUILD_DIR = SCRIPT_ROOT / "build"
WATCH_PATHS = [
    SCRIPT_ROOT / "templates",
    SCRIPT_ROOT / "static",
    SCRIPT_ROOT / "treeniajat.txt",
]
PORT = 8000

POLL_SCRIPT = b"""
<script>
let v = null;
setInterval(async () => {
    const r = await fetch("/__version__");
    const next = await r.text();
    
    if (v === null) {
        v = next; 
    } else if (v !== next) { 
        location.reload();
    }
}, 1000);
</script>
"""

_version = 0
_version_lock = threading.Lock()


def bump_version():
    global _version
    with _version_lock:
        _version += 1


def get_version():
    with _version_lock:
        return str(_version)


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/__version__":
            body = get_version().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        file_path = Path(self.translate_path(self.path))
        if file_path.is_dir():
            file_path = file_path / "index.html"
        if file_path.suffix == ".html" and file_path.is_file():
            content = file_path.read_bytes().replace(
                b"</body>", POLL_SCRIPT + b"</body>"
            )
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        super().do_GET()

    def log_message(self, format, *args):
        if "/__version__" not in str(args[0]):
            super().log_message(format, *args)


def rebuild():
    print("Building...")
    result = subprocess.run(
        [sys.executable, str(SCRIPT_ROOT / "build.py")],
        cwd=SCRIPT_ROOT,
    )
    if result.returncode == 0:
        bump_version()
        print(f"Done. http://localhost:{PORT}/")
    else:
        print("Build failed.")


def serve():
    httpd = HTTPServer(("", PORT), lambda *args: Handler(*args, directory=BUILD_DIR))
    print(f"Serving build/ at http://localhost:{PORT}/")
    httpd.serve_forever()


def main():
    rebuild()
    thread = threading.Thread(target=serve, daemon=True)
    thread.start()

    print("Watching for changes...")
    for changes in watchfiles.watch(*WATCH_PATHS):
        changed_files = ", ".join(
            str(Path(p).relative_to(SCRIPT_ROOT)) for _, p in changes
        )
        print(f"Changed: {changed_files}")
        rebuild()


if __name__ == "__main__":
    main()
