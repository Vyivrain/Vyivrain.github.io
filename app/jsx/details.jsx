import React from 'react'
var _ = require('lodash');


export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: props.id };
  }

  componentWillMount() {
    var klass = this;
    if(this.state.id) {
      fetch(`http://pokeapi.co/api/v1/pokemon/${this.state.id}`)
        .then((response) => response.json())
        .then(function (responseJSON) {
          var neededData = {
            name: responseJSON['name'],
            types: responseJSON['types'].map(function (o) {
              return _.capitalize(o['name']);
            }).join(', '),
            attack: responseJSON['attack'],
            defense: responseJSON['defense'],
            hp: responseJSON['hp'],
            SPAttack: responseJSON['sp_atk'],
            SPDefense: responseJSON['sp_def'],
            speed: responseJSON['speed'],
            weight: responseJSON['weight'],
            moves: responseJSON['moves'].length
          };

          klass.setState(neededData);
        });
    }
  }

  render() {
    var imageUrl = `http://pokeapi.co/media/img/${this.state.id}.png`;
    if(this.state.id) {
      return (
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="element">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <a href="#" className="thumbnail">
                    <img src={imageUrl} alt="image" />
                  </a>
                  <h1 className="center">{this.state.name} #{this.state.id}</h1>
                  <table className="table table-bordered center">
                    <tbody>
                    <tr>
                      <td>
                        Type
                      </td>
                      <td>
                        {this.state.types}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Attack
                      </td>
                      <td>
                        {this.state.attack}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Defense
                      </td>
                      <td>
                        {this.state.defense}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HP
                      </td>
                      <td>
                        {this.state.hp}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        SP Attack
                      </td>
                      <td>
                        {this.state.SPAttack}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        SP Defense
                      </td>
                      <td>
                        {this.state.SPDefense}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Speed
                      </td>
                      <td>
                        {this.state.speed}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Weight
                      </td>
                      <td>
                        {this.state.speed}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Total moves
                      </td>
                      <td>
                        {this.state.moves}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }
}