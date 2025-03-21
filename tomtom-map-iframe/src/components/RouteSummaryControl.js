import React from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { withMap } from "react-tomtom-maps";
import styled from "styled-components";
import JamIcon from "./icons/JamIcon";
import DefaultColorPalette from "../DefaultColorPalette";

const SummaryContainer = styled.div`
  display: flex;
  gap: 6px;
  font-size: 14px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  color: ${({ $color }) => $color || "#000"};
  line-height: 18px;

  .item-content {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const Dot = styled.span.attrs(() => ({ children: "⸱" }))`
  display: inline-block;
  color: #999;
  font-size: 16px;
  line-height: 1;
  user-select: none;
`;

class RouteSummaryControl extends React.Component {
  constructor(props) {
    super(props);
    this._container = this.createContainer();
    this.state = { onMap: false };
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
    if (this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }

  formatLength(meters) {
    return meters < 1000
      ? `${meters.toFixed(0)} m`
      : `${(meters / 1000).toFixed(1)} km`;
  }

  formatTime(seconds) {
    const minutes = Math.round(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours} hr${hours > 1 ? "s" : ""} ${mins} min`
      : `${mins} min`;
  }

  render() {
    const { summary } = this.props;
    const { onMap } = this.state;

    if (!onMap || !summary) return null;

    const { lengthInMeters, travelTimeInSeconds, trafficDelayInSeconds } =
      summary;

    return createPortal(
      <SummaryContainer>
        <SummaryItem>
          <div className="item-content">
            {this.formatLength(lengthInMeters)}
          </div>
        </SummaryItem>
        <Dot />
        <SummaryItem>
          <div className="item-content">
            {this.formatTime(travelTimeInSeconds)}
          </div>
        </SummaryItem>
        {trafficDelayInSeconds > 0 && (
          <React.Fragment>
            <Dot />
            <SummaryItem $color={DefaultColorPalette.tt_ix_d_red}>
              <div className="item-content">
                <JamIcon size={20} />
                {this.formatTime(trafficDelayInSeconds)}
              </div>
            </SummaryItem>
          </React.Fragment>
        )}
      </SummaryContainer>,
      this._container
    );
  }
}

RouteSummaryControl.propTypes = {
  summary: PropTypes.shape({
    lengthInMeters: PropTypes.number.isRequired,
    travelTimeInSeconds: PropTypes.number.isRequired,
    trafficDelayInSeconds: PropTypes.number.isRequired
  }),
  position: PropTypes.string
};

RouteSummaryControl.defaultProps = {
  position: "top-left"
};

export default withMap(RouteSummaryControl);
