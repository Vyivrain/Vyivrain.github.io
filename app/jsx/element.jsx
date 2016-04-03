import React from 'react'

export default class Element extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: props.name, types: props.types, spritePath: props.spritePath, key: props.id };
  }

  componentWillMount() {
    var klass = this;
    var spritePath = this.state.spritePath;
    fetch(`${spritePath}`)
      .then((response) => response.json())
      .then(function(responseJSON) {
        var image = responseJSON['image'];
        klass.setState({ image: `http://pokeapi.co${image}` });
      })
  }

  render() {
    var renderedTypes = this.state.types.map(function(type) {
      return (
        <div>
          <div className="col-lg-6 col-md-6 col-sm-6 type-class center">
            <div className="row center">
              <div className="col-lg-12 col-md-12"><h3 className={type}>{type}</h3></div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="col-lg-4 col-md-3 col-sm-2 bottom-margin">
        <div className="element">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <a href="#" className="thumbnail" onClick={this.props.showDetails.bind(null, this.props)} >
                <img src={this.state.image} alt="image" />
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <h3 className="center">{this.state.name}</h3>
            </div>
          </div>
          <div className="row">
            {renderedTypes}
          </div>
        </div>
      </div>
    )
  }
}