export const ASSEMBLY_MAP_WIDTH = 1983;
export const ASSEMBLY_MAP_HEIGHT = 793;
export const ASSEMBLY_MAP_MOBILE_WIDTH = 941;
export const ASSEMBLY_MAP_MOBILE_HEIGHT = 1672;

export const ASSEMBLY_MAP_IMAGE = "/maps/paithan-wards-godavari-map.png";
export const ASSEMBLY_MAP_MOBILE_IMAGE =
  "/maps/paithan-wards-godavari-map-mobile.png";

export type WardMapMarker = {
  number: number;
  wardName: string;
  cx: number;
  cy: number;
};

export const wardMapMarkers: WardMapMarker[] = [
  { number: 1, wardName: "Brahmapuri Archaeological Ward", cx: 480, cy: 179 },
  { number: 2, wardName: "Sant Eknath Mandir Ward", cx: 752, cy: 211 },
  { number: 3, wardName: "Godavari Nagghat Ward", cx: 1108, cy: 237 },
  { number: 4, wardName: "Sant Eknath Wada Ward", cx: 569, cy: 282 },
  { number: 5, wardName: "Paithani Weavers Colony Ward", cx: 824, cy: 312 },
  { number: 6, wardName: "Mahavir Chowk Central Ward", cx: 1262, cy: 306 },
  { number: 7, wardName: "Chhatrapati Shivaji Chowk Ward", cx: 1518, cy: 346 },
  { number: 8, wardName: "Old Bazar Ward", cx: 660, cy: 383 },
  { number: 9, wardName: "Dr. Ambedkar Nagar Ward", cx: 944, cy: 401 },
  { number: 10, wardName: "Subhash Nagar Ward", cx: 1328, cy: 415 },
  { number: 11, wardName: "Bus Stand Complex Ward", cx: 569, cy: 472 },
  { number: 12, wardName: "Sant Dnyaneshwar Udyan Ward", cx: 824, cy: 478 },
  { number: 13, wardName: "Balasaheb Patil Museum Ward", cx: 1208, cy: 487 },
  { number: 14, wardName: "Jayakwadi Colony Ward", cx: 1635, cy: 486 },
  { number: 15, wardName: "Nath Sagar Gate Ward", cx: 751, cy: 583 },
  { number: 16, wardName: "Industrial & Handloom Ward", cx: 1440, cy: 555 },
  { number: 17, wardName: "Kavi Kulguru Kalidas Ward", cx: 1150, cy: 578 },
];

const MOBILE_PIN_CENTRES: ReadonlyArray<readonly [number, number]> = [
  [208, 478],
  [364, 605],
  [610, 638],
  [242, 715],
  [422, 742],
  [636, 791],
  [764, 878],
  [280, 847],
  [457, 863],
  [624, 935],
  [174, 983],
  [396, 1002],
  [597, 1056],
  [785, 1037],
  [262, 1131],
  [698, 1182],
  [459, 1143],
];

export const wardMapMarkersMobile: WardMapMarker[] = wardMapMarkers.map(
  (marker, index) => ({
    ...marker,
    cx: MOBILE_PIN_CENTRES[index][0],
    cy: MOBILE_PIN_CENTRES[index][1],
  }),
);
