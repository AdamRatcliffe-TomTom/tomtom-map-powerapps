const MapStyles = {
  street: {
    orbis:
      "https://api.tomtom.com/maps/orbis/assets/styles/*/style.json?apiVersion=1&map=basic_street-light&trafficFlow=flow_relative-light&trafficIncidents=incidents_light",
    genesis:
      "https://api.tomtom.com/style/1/style/*?map=2/basic_street-light&traffic_incidents=2/incidents_light&traffic_flow=2/flow_relative-light&poi=2/poi_light"
  },
  satellite: {
    orbis:
      "https://api.tomtom.com/maps/orbis/assets/styles/*/style.json?apiVersion=1&map=basic_street-satellite&trafficFlow=flow_relative-light&trafficIncidents=incidents_light",
    genesis:
      "https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&traffic_flow=2/flow_relative-light&traffic_incidents=2/incidents_light"
  }
};

export default MapStyles;
