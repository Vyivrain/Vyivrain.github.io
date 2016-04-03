import React from 'react'
import Element from './element'
import Details from './details'
var _ = require('lodash');

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pokemons: props.pokemons, filteredPokemon: props.pokemons };
  }

  showDetails(data) {
    this.setState({ detailId: data.id });
  }

  changeFilteredPokemon(event) {
    var types = [];
    var filteredPokemon = _.filter(this.state.pokemons, function(o) {
      if(event.target.value.length == 0) {
        return true;
      }
      else {
        types.push({ result: _.some(o.types, function(type){ return !type.indexOf(event.target.value) }) });
        return _.some(o.types, function(type){
          return !type.indexOf(event.target.value)
        });
      }
    });
    this.setState({ filteredPokemon: filteredPokemon })
  }

  render() {
    var klass = this;
    var showDetailFunc = this.showDetails;
    if(this.state.pokemons.length != 0) {
      var chunkElements = _.chunk(this.state.filteredPokemon, 3);
      var renderedElements = chunkElements.map(function(elements) {
        var chunkRenderedElements = elements.map(function(element) {
          return <Element key={element.id} id={element.id} name={element['name']} types={element['types']}
                          spritePath={element['spritePath']}  showDetails={showDetailFunc.bind(klass)} />
        });
        return (
          <div className="row">
            {chunkRenderedElements}
          </div>
        )
      });

      return (
        <div className="elements">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
              <div className="left-inner-addon">
                <i className="fa fa-search" />
                <input type="search" className="form-control" placeholder="Search" onChange={this.changeFilteredPokemon.bind(this)} />
              </div>

              <div className="row center">
                { renderedElements }
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4">
              <h1>Details:</h1>
              <Details key={_.uniqueId()} id={this.state.detailId} />
            </div>
          </div>
        </div>
      )
    }
    else {
      return <h1>Nothing to render!</h1>
    }
  }
}
