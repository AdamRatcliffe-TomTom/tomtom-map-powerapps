import CalculateRouteVisualization from "./CalculateRoute";
import ReachableRangeVisualization from "./ReachableRange";
import SearchVisualization from "./Search";

const visualizationMap = {
  calculateRoute: CalculateRouteVisualization,
  calculateReachableRange: ReachableRangeVisualization,
  search: SearchVisualization
};

export default visualizationMap;
