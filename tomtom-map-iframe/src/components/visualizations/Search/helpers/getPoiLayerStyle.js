/**
 * Returns the layout and paint properties for the POI layer,
 * depending on whether the map is 'orbis' or 'genesis'.
 *
 * @param {'orbis'|'genesis'} mapType - Type of map ('orbis' or 'genesis').
 * @returns {{ layout: object, paint: object }}
 */
export function getPoiLayerStyle(mapType) {
  const useGenesis = mapType === "genesis";

  const layout = {
    "icon-image": useGenesis
      ? ["get", "category"]
      : ["concat", "poi-", ["get", "category"]],
    "icon-optional": false,
    "icon-padding": [
      "interpolate",
      ["linear"],
      ["zoom"],
      12,
      5,
      14,
      10,
      16,
      20,
      18,
      5
    ],
    "icon-size": 1.1,
    "symbol-avoid-edges": true,
    "symbol-placement": "point",
    "symbol-sort-key": [
      "+",
      [
        "*",
        1000,
        [
          "+",
          ["get", "display_class"],
          [
            "match",
            ["get", "group"],
            ["parking", "driving", "sport", "healthcare", "protected"],
            1,
            0
          ]
        ]
      ],
      ["get", "priority"],
      ["*", 0.01, ["length", ["get", "name"]]]
    ],
    "symbol-z-order": "auto",
    "text-field": [
      "match",
      ["get", "group"],
      "driving",
      [
        "case",
        ["all", ["has", "brand"], ["!", ["in", ";", ["get", "brand"]]]],
        ["get", "brand"],
        ["get", "name"]
      ],
      ["get", "name"]
    ],
    "text-font": [
      "Noto-Bold",
      "Noto-Medium",
      "NotoSans-CondensedMedium",
      "NotoSansThaiMerged-CondensedMedium",
      "NotoSansMyanmarMerged-CondensedMedium",
      "NotoSansLaoMerged-CondensedMedium",
      "NotoSansKhmerMerged-CondensedMedium",
      "NotoSansTC-Regular",
      "NotoSansSC-Regular",
      "NotoSansJP-Regular",
      "NotoSansKR-Regular",
      "NotoSansHebrewMerged-CondensedMedium",
      "NotoSansArmenianMerged-CondensedMedium",
      "NotoSansGeorgianMerged-CondensedMedium",
      "NotoSansArabicMerged-CondensedMedium"
    ],
    "text-justify": "auto",
    "text-letter-spacing": 0.1,
    "text-line-height": 1.2,
    "text-optional": ["step", ["zoom"], true, 13, false],
    "text-radial-offset": 1.5,
    "text-size": ["/", 16, ["log10", ["max", ["length", ["get", "name"]], 30]]],
    "text-variable-anchor": ["top", "left", "bottom", "right"]
  };

  const paint = {
    "text-color": [
      "match",
      ["get", "group"],
      ["public", "religion", "military"],
      "hsl(324, 8%, 35%)",
      ["outdoor", "protected", "sport"],
      "hsl(160, 43%, 23%)",
      ["business"],
      "hsl(237, 14%, 32%)",
      ["cultural", "leisure"],
      "hsl(324, 35%, 33%)",
      ["eat_and_drink"],
      "hsl(25, 60%, 33%)",
      ["education"],
      "hsl(31, 38%, 27%)",
      ["healthcare"],
      "hsl(8, 63%, 29%)",
      ["lodging"],
      "hsl(246, 20%, 50%)",
      ["parking"],
      "hsl(203, 87%, 41%)",
      ["finance", "shopping"],
      "hsl(291, 29%, 41%)",
      ["driving", "transport"],
      "hsl(212, 58%, 32%)",
      "hsl(0, 0%, 54%)"
    ],
    "text-halo-color": "hsl(0, 0%, 100%)",
    "text-halo-width": 1
  };

  return { layout, paint };
}
