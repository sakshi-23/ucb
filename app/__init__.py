import os
import sys

from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)
app.config.from_object('config')


@app.route("/")
def visualize():
    return render_template('grid.html')


@app.route("/graphview")
def design1():
    return render_template('graph.html')

@app.route("/gridview")
def design2():
    return render_template('grid.html')

@app.route("/scatterview")
def design3():
    return render_template('scatter.html')

@app.route("/graph2")
def graph2():
    return render_template('graph2.html')
   
@app.errorhandler(404)
def not_found(error):
    return "TODO: 404 page", error


from app.data.models import mod_data as dataModule
app.register_blueprint(dataModule)