#!/usr/bin/env python3

from datetime import date
import argparse
import jinja2
import os
import shutil

# args
parser = argparse.ArgumentParser(
    prog="build", description="Generates a home page for JURRI"
)
parser.add_argument(
    "output",
    help="Output directory for the program. (default: build) NB: Will be overwritten!",
    default="build",
    nargs="?",
)
args = parser.parse_args()

# env
SCRIPT_ROOT = os.path.dirname(os.path.abspath(__file__))
WORKING_DIR = os.path.abspath(".")
TEMPLATE_DIR = os.path.join(SCRIPT_ROOT, "templates")
OUTPUT_PATH = os.path.join(WORKING_DIR, args.output)

# jinja2
env = jinja2.Environment(loader=jinja2.FileSystemLoader(SCRIPT_ROOT))

# misc
today = date.today()
main_sections = None


def main():
    if os.path.isdir(OUTPUT_PATH):
        shutil.rmtree(OUTPUT_PATH)

    os.mkdir(OUTPUT_PATH)
    index()
    club()
    questions()
    shutil.copytree(
        os.path.join(SCRIPT_ROOT, "static"), os.path.join(OUTPUT_PATH, "static")
    )


def render_template(path, **kwargs) -> str:
    template = env.get_template("templates" + "/" + path)
    return template.render(**kwargs)


def practise_times():
    with open(os.path.join(SCRIPT_ROOT, "treeniajat.txt"), "r") as fd:
        html = "\n".join(fd.readlines())
    return html


def _render_sections(files: list, **kwargs) -> list:
    sections = [
        f"""\n<section id='{_file.split("/")[1].split(".")[0]}'>\n"""
        f"{ render_template(_file, **kwargs) }\n"
        "</section>"
        for _file in files
    ]
    return sections


def _render(**kwargs):
    return render_template("base.html", year=today.strftime("%Y"), **kwargs)


# @app.get("/")


def index():
    path = os.path.join(OUTPUT_PATH, "index.html")
    with open(path, "w") as fd:
        page = _render(
            header=render_template("header.html", page="index"),
            sections=_render_sections(
                [
                    "index/kurssimainos.html",
                    "index/treeniajat.html",
                    "index/kulkuohje.html",
                ],
                treeniajat=practise_times(),
            ),
        )
        fd.write(page)


# @app.get("/kerho")


def club():
    path = os.path.join(OUTPUT_PATH, "club.html")
    with open(path, "w") as fd:
        page = _render(
            header=render_template("header.html", page="club"),
            sections=_render_sections([f"kerho/kerho.html"]),
        )
        fd.write(page)


# @app.get("/ukk")


def questions():
    path = os.path.join(OUTPUT_PATH, "questions.html")
    with open(path, "w") as fd:
        page = _render(
            header=render_template("header.html", page="ukk"),
            sections=_render_sections([f"ukk/ukk.html"]),
        )
        fd.write(page)


if __name__ == "__main__":
    main()
