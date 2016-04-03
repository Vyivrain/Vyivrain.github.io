// Libs
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

// Classes
import Index from './index'
import Element from './element'
import Details from './details'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pokemons: [],
      curId: 1,
      batch: 12
    }
  }

  triggerRequest() {
    var klass = this;
    var elements = this.state.pokemons;
    var batch = this.state.batch;
    var curId = this.state.curId;
    fetch(`http://pokeapi.co/api/v1/pokemon/?limit=${batch}&offset=${curId - 1}`)
      .then((response) => response.json())
      .then(function(responseJSON) {
        var neededData = responseJSON['objects'].map( function(object) {
          return {
            id: object['national_id'],
            name: object['name'],
            types:
              object['types'].map( function(type) {
                  return type['name'];
              }),
            spritePath: `http://pokeapi.co${object['sprites'][0]['resource_uri']}`
          }
        });
        
        klass.setState({ pokemons: elements.concat(neededData), batch: 12, curId: curId + batch });
      })
  }
  
  render() {
    return (
      <div className="container">
        <h1 className="title-center">Pokedex</h1>
        <Index key={this.state.curId} pokemons={this.state.pokemons} />
        <div className="row">
          <div className="col-lg-8">
            <button type="button" className="btn btn-primary btn-block load-button" onClick={this.triggerRequest.bind(this)}>Load More</button>
          </div>
        </div>
      </div>
    )
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" name="/" component={App} />
  </Router>
), document.getElementById('app'));