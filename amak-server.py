#!/usr/bin/env python3
"""Local AMAK launcher and static prototype server."""

from __future__ import annotations

import argparse
import html
import json
import mimetypes
import os
import re
import secrets
import shutil
import subprocess
import unicodedata
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent
TOKEN = secrets.token_urlsafe(24)
PAGES = {
    "accueil": ("Accueil connecté", "canalplus-home-improved.html"),
    "decouvrir": ("Accueil non connecté", "canalplus-logged-out.html"),
    "tv-direct": ("TV en direct — connecté", "canalplus-live.html"),
    "tv": ("TV — non connecté", "canalplus-logged-out-live.html"),
    "cinema": ("Cinéma", "canalplus-cinema.html"),
    "series": ("Séries", "canalplus-series.html"),
    "chaines-apps": ("Chaînes & Apps", "canalplus-channels.html"),
    "mes-videos": ("Mes vidéos", "canalplus-videos.html"),
    "connexion": ("Connexion", "canalplus-login.html"),
    "compte": ("Mon compte", "canalplus-account.html"),
}


def slugify(value: str, fallback: str = "prototype") -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return value[:48] or fallback


def resolve_git() -> str:
    candidates = [
        shutil.which("git"),
        "/Library/Developer/CommandLineTools/usr/bin/git",
        "/opt/homebrew/bin/git",
        "/usr/local/bin/git",
    ]
    for candidate in filter(None, candidates):
        try:
            subprocess.run(
                [candidate, "--version"],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )
            return candidate
        except (OSError, subprocess.CalledProcessError):
            continue
    raise RuntimeError("Git est introuvable sur cette machine.")


GIT = resolve_git()


def git(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [GIT, *args], cwd=ROOT, check=check, capture_output=True, text=True
    )


def repository_state() -> dict[str, object]:
    branch = git("branch", "--show-current").stdout.strip()
    identity = git("config", "user.name", check=False).stdout.strip()
    collaborator = slugify(identity, "collaborateur")
    clean = not git("status", "--porcelain").stdout.strip()
    branch_slug = branch.rsplit("/", 1)[-1] if branch else ""
    return {
        "branch": branch,
        "branchSlug": branch_slug,
        "collaborator": collaborator,
        "identityConfigured": bool(identity),
        "clean": clean,
        "isMain": branch == "main",
        "projects": list_projects(collaborator, branch),
    }


def list_projects(collaborator: str, active_branch: str = "") -> list[dict[str, object]]:
    prefix = f"feature/{collaborator}/"
    local = set(git("for-each-ref", "--format=%(refname:short)", f"refs/heads/{prefix}").stdout.splitlines())
    remote = {
        name.removeprefix("origin/")
        for name in git("for-each-ref", "--format=%(refname:short)", f"refs/remotes/origin/{prefix}").stdout.splitlines()
    }
    projects = []
    for branch in local | remote:
        if not branch.startswith(prefix):
            continue
        is_local, is_remote = branch in local, branch in remote
        active = branch == active_branch
        comparison_ref = branch if is_local else f"origin/{branch}"
        merged = git(
            "merge-base", "--is-ancestor", comparison_ref, "origin/main", check=False
        ).returncode == 0
        if merged and not active:
            continue
        status = (
            "Projet ouvert" if active else
            "En local et sur GitHub" if is_local and is_remote else
            "Disponible sur GitHub" if is_remote else
            "En local uniquement"
        )
        projects.append({"branch": branch, "slug": branch[len(prefix):], "local": is_local, "remote": is_remote, "active": active, "status": status})
    return sorted(projects, key=lambda project: (not project["active"], project["slug"]))


def resume_branch(branch_name: str) -> dict[str, str]:
    state = repository_state()
    projects = {project["branch"]: project for project in state["projects"]}
    if branch_name not in projects:
        raise ValueError("Ce projet n’appartient pas à ta liste de projets AMAK.")
    project = projects[branch_name]
    if project["active"]:
        return {"branch": branch_name, "slug": str(project["slug"]), "url": f"/{project['slug']}"}
    if not state["clean"]:
        raise ValueError("Le projet ouvert contient des modifications non enregistrées. Demande à Codex de les préserver avant d’en ouvrir un autre.")
    if project["local"]:
        git("switch", branch_name)
    else:
        git("switch", "--track", "-c", branch_name, f"origin/{branch_name}")
    return {"branch": branch_name, "slug": str(project["slug"]), "url": f"/{project['slug']}"}


def create_branch(requested_name: str) -> dict[str, str]:
    state = repository_state()
    if not state["identityConfigured"]:
        raise ValueError(
            "Ton identité Git n’est pas configurée. Demande à Codex de renseigner ton identifiant avant de continuer."
        )
    if not state["clean"]:
        raise ValueError(
            "Le dépôt contient déjà des changements locaux. Demande à Codex de les préserver avant de créer une branche."
        )
    if not state["isMain"]:
        raise ValueError(
            f"La branche active est « {state['branch']} ». La création doit partir de main à jour."
        )

    slug = slugify(requested_name, "")
    if not slug:
        raise ValueError("Saisis un nom de branche.")
    full_name = f"feature/{state['collaborator']}/{slug}"

    local = git("show-ref", "--verify", f"refs/heads/{full_name}", check=False)
    remote = git(
        "show-ref", "--verify", f"refs/remotes/origin/{full_name}", check=False
    )
    if local.returncode == 0 or remote.returncode == 0:
        raise ValueError(
            "Cette branche existe déjà. Choisis un autre nom ou demande à Codex de la reprendre."
        )

    git("switch", "--no-track", "-c", full_name, "origin/main")
    return {"branch": full_name, "slug": slug, "url": f"/{slug}"}


class AmakHandler(SimpleHTTPRequestHandler):
    server_version = "AMAK/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, payload: dict[str, object], status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        path = unquote(urlparse(self.path).path).rstrip("/") or "/"
        if path == "/api/amak/session":
            try:
                self.send_json({"ok": True, **repository_state()})
            except (RuntimeError, subprocess.CalledProcessError) as error:
                self.send_json({"ok": False, "error": str(error)}, 500)
            return
        if path in {"/amak", "/nouveau"}:
            self.serve_launcher("create")
            return

        parts = [part for part in path.split("/") if part]
        if len(parts) == 1 and re.fullmatch(r"[a-z0-9-]+", parts[0]):
            self.serve_launcher("pages", parts[0])
            return
        if (
            len(parts) == 2
            and re.fullmatch(r"[a-z0-9-]+", parts[0])
            and parts[1] in PAGES
        ):
            self.serve_prototype(parts[0], parts[1])
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path not in {"/api/amak/branches", "/api/amak/resume"}:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if self.headers.get("X-Amak-Token") != TOKEN:
            self.send_json({"ok": False, "error": "Requête locale non autorisée."}, 403)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > 4096:
                raise ValueError("Requête trop volumineuse.")
            payload = json.loads(self.rfile.read(length) or b"{}")
            result = resume_branch(str(payload.get("branch", ""))) if path == "/api/amak/resume" else create_branch(str(payload.get("name", "")))
            self.send_json({"ok": True, **result}, 201)
        except (ValueError, json.JSONDecodeError) as error:
            self.send_json({"ok": False, "error": str(error)}, 400)
        except subprocess.CalledProcessError as error:
            message = error.stderr.strip() or error.stdout.strip() or "Erreur Git."
            self.send_json({"ok": False, "error": message}, 500)

    def serve_launcher(self, view: str, slug: str = "") -> None:
        source = (ROOT / "amak.html").read_text(encoding="utf-8")
        config = json.dumps(
            {"token": TOKEN, "view": view, "slug": slug, "pages": PAGES},
            ensure_ascii=False,
        ).replace("</", "<\\/")
        source = source.replace("__AMAK_CONFIG_JSON__", config)
        self.send_html(source)

    def serve_prototype(self, slug: str, page_id: str) -> None:
        title, filename = PAGES[page_id]
        source = (ROOT / filename).read_text(encoding="utf-8")
        if "<base " not in source:
            source = re.sub(r"(<head[^>]*>)", r'\1<base href="/">', source, count=1)
        toolbar = f"""
        <aside class="amak-context" aria-label="Contexte du prototype">
          <a href="/{html.escape(slug)}" aria-label="Choisir une autre page">AMAK</a>
          <span>{html.escape(slug)} / {html.escape(title)}</span>
        </aside>
        <style>
          .amak-context{{position:fixed;z-index:2147483647;left:16px;bottom:16px;display:flex;
          align-items:center;gap:10px;padding:8px 12px;border:1px solid #454545;border-radius:999px;
          background:#171717eF;color:#fff;font:600 13px/1.2 Arial,sans-serif;box-shadow:0 8px 24px #0008}}
          .amak-context a{{color:#fff;text-decoration:none;background:#e52e4d;padding:5px 8px;border-radius:999px}}
          .amak-context a:focus-visible{{outline:3px solid #58a6ff;outline-offset:3px}}
          @media(max-width:520px){{.amak-context span{{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}}}
        </style>
        """
        source = source.replace("</body>", f"{toolbar}</body>")
        self.send_html(source)

    def send_html(self, source: str) -> None:
        data = source.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, message: str, *args: object) -> None:
        print(f"[AMAK] {self.address_string()} — {message % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Lance le workspace local AMAK.")
    parser.add_argument("--port", type=int, default=3000)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), AmakHandler)
    print(f"AMAK est disponible sur http://localhost:{args.port}/amak")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt d’AMAK.")


if __name__ == "__main__":
    main()
