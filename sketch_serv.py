from flask import Flask, render_template, send_file, abort
from pathlib import Path
import json
from sys import version_info
from dataclasses import dataclass


app = Flask(__name__)

app.logger.debug(f'{version_info}')

mypath = Path('.')
statics = mypath / 'static'

@dataclass
class Sketch:
    '''Contains Sketch data.'''
    name : str
    desc : str


@app.route('/')
def start():
    sketches = []
    for p in mypath.glob('*.proj'):
        if not p.is_dir(): continue
        sketch = p.stem
        app.logger.debug(f'found sketch {sketch}')
        sketches.append(Sketch(sketch, '?'))
    return render_template('index.html', sketches=sketches)

@app.route('/sketch/<sketch>')
def sketch_page(sketch):
    sketch_dir = mypath / (sketch + '.proj')

    if not sketch_dir.is_dir():
        abort(404)
    config_file = sketch_dir / 'cfg.json'
    if not config_file.exists():
        abort(404)
    with config_file.open('r') as jf:
        config = json.load(jf)
    if not "dom" in config: config["dom"] = False
    if not "sound" in config: config["sound"] = False
    return render_template('sketch.html', sketch=sketch, scripts=config['script_list'],
               title=sketch, dom=config["dom"], sound=config["sound"])

@app.route('/sketch/<sketch>/<script>')
def sketch(sketch, script):
    if sketch in ('p5', 'common', 'static'):
        return send_file(mypath / sketch / script)
    else:
        return send_file(mypath / (sketch+'.proj') / script)

