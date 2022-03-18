import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_paginate import get_page_args
import db

app = Flask(__name__)
global data
CORS(app) 

def get_pokemons_by_page(page=1, per_page=10, sort=1, query_filter=''):
    sort_by = (sort != '1')
    offset = ((page - 1) * per_page)
    filtered_data = [pokimon for pokimon in data if query_filter in (pokimon['type_one'], pokimon['type_two'])]
    sorted_data = sorted(filtered_data, key=lambda x : x['number'], reverse=sort_by)
    data_in_pages = sorted_data[offset: offset + per_page]
    return jsonify(data_in_pages)

@app.route('/pokemon/filters') 
def get_filters():
    filters_dict = {}
    for i in data:
        filters_dict[i['type_one']] = filters_dict.get(i['type_one'], 0) + 1
        filters_dict[i['type_two']] = filters_dict.get(i['type_two'], 0) + 1
    return jsonify([filters_dict])

    
@app.route('/pokemon') 
def get_pokemons():
    page, per_page, offset = get_page_args(page_parameter='page',
                                           per_page_parameter='per_page')
    sort = request.args.get('sort')
    filter = request.args.get('filter')
    return get_pokemons_by_page(page, per_page, sort, filter)
    
data = db.get()

if __name__=='__main__':
    app.run(port=5000)
