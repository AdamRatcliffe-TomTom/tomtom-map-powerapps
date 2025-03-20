import React from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { withMap } from "react-tomtom-maps";
import { Box } from "tombac";

class ControlGroup extends React.Component {
  constructor(props) {
    super(props);

    this._container = this.createContainer();

    this.state = {
      onMap: false
    };
  }

  componentDidMount() {
    const { map, position } = this.props;

    map.addControl(this, position);

    this.setState({ onMap: true });
  }

  componentWillUnmount() {
    const { map } = this.props;

    map.removeControl(this);

    this.setState({ onMap: false });
  }

  createContainer() {
    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl";
    return container;
  }

  onAdd() {
    return this._container;
  }

  onRemove() {
    if (this._onMap && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }

  render() {
    const { children, position, ...otherProps } = this.props;
    const { onMap } = this.state;

    return onMap
      ? createPortal(
          <Box {...otherProps}>
            {React.Children.map(children, (child) => React.cloneElement(child))}
          </Box>,
          this._container
        )
      : null;
  }
}

ControlGroup.propTypes = {
  position: PropTypes.string
};

ControlGroup.defaultProps = {
  position: "bottom-left"
};

export default withMap(ControlGroup);
