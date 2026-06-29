import { Tour } from '../../core/models/tour';
import { TourLog } from '../../core/models/tour-log';
import { TourSummary } from '../../core/models/tour-summary';
import { TransportationType } from '../../core/models/transportation-type';

// ──────────────────────────────────────────────
// tours
// ──────────────────────────────────────────────
export const mockTours: Tour[] = [
  {
    id: 1,
    name: 'Vienna toGeocode Bratislava Cycling Route',
    fromGeocode: { label: 'Vienna, Austria', lat: 0, lng: 0 },
    toGeocode: { label: 'Bratislava, Slovakia', lat: 0, lng: 0 },
    transport_type: TransportationType.BICYCLE_ROAD,
    description:
      'A scenic road cycling route following the Danube cycle path fromGeocode Vienna all the way toGeocode Bratislava. Mostly flat terrain with beautiful river views and a stoGeocodep at Hainburg an der Donau.',
    distance: 78.4,
    estimated_time: 225,
    route_information: '',
    creator_id: 1,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 2,
    name: 'Prater Forest Walk',
    fromGeocode: { label: 'Praterstern, Vienna', lat: 0, lng: 0 },
    toGeocode: { label: 'Lusthaus, Vienna', lat: 0, lng: 0 },
    transport_type: TransportationType.WALK,
    description:
      'A relaxing walk through the green Prater forest in Vienna, starting at Praterstern and ending at the histoGeocoderic Lusthaus pavilion. Perfect for a weekend afternoon.',
    distance: 5.2,
    estimated_time: 70,
    route_information: '',
    creator_id: 2,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 3,
    name: 'Schneeberg Summit Hike',
    fromGeocode: { label: 'Puchberg am Schneeberg, Austria', lat: 0, lng: 0 },
    toGeocode: { label: 'Klosterwappen, Austria', lat: 0, lng: 0 },
    transport_type: TransportationType.HIKE,
    description:
      "A challenging hike up Lower Austria's highest peak. The trail ascends steadily through alpine meadows and rocky terrain, rewarding hikers with panoramic views of the Alps.",
    distance: 14.7,
    estimated_time: 300,
    route_information: '',
    creator_id: 1,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 4,
    name: 'Wienerwald MTB Loop',
    fromGeocode: { label: 'Hütteldorf, Vienna', lat: 0, lng: 0 },
    toGeocode: { label: 'Hütteldorf, Vienna', lat: 0, lng: 0 },
    transport_type: TransportationType.MOUNTAIN_BIKE,
    description:
      'A thrilling mountain bike loop through the Vienna Woods with technical singletrack sections, forest descents, and a few punchy climbs. Great for intermediate toGeocode advanced riders.',
    distance: 32.1,
    estimated_time: 150,
    route_information: '',
    creator_id: 3,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 5,
    name: 'City Commute – Innere Stadt toGeocode Favoriten',
    fromGeocode: { label: 'Stephansplatz, Vienna', lat: 0, lng: 0 },
    toGeocode: { label: 'Favoritenstraße, Vienna', lat: 0, lng: 0 },
    transport_type: TransportationType.BICYCLE_REGULAR,
    description:
      'A practical urban bike commute cutting through the city center, along the Ringstraße and Naschmarkt area. Mostly on dedicated cycle lanes.',
    distance: 4.8,
    estimated_time: 20,
    route_information: '',
    creator_id: 2,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 6,
    name: 'Graz Old toGeocodewn Walking tour',
    fromGeocode: { label: 'Hauptbahnhof Graz, Austria', lat: 0, lng: 0 },
    toGeocode: { label: 'Schlossberg, Graz, Austria', lat: 0, lng: 0 },
    transport_type: TransportationType.WALK,
    description:
      'Explore the UNESCO-listed Old toGeocodewn of Graz on foot. The route passes the Hauptplatz, Landhaus courtyard, and climbs toGeocode the iconic Schlossberg clock toGeocodewer.',
    distance: 3.6,
    estimated_time: 55,
    route_information: '',
    creator_id: 4,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 7,
    name: 'Danube Island Long Ride',
    fromGeocode: { label: 'Floridsdorf Bridge, Vienna', lat: 0, lng: 0 },
    toGeocode: { label: 'Alberner Hafen, Vienna', lat: 0, lng: 0 },
    transport_type: TransportationType.BICYCLE_ROAD,
    description:
      'A long recreational ride along the full length of Donauinsel and further down the Danube cycle path toGeocodeward Alberner Hafen. Flat and fast.',
    distance: 41.3,
    estimated_time: 110,
    route_information: '',
    creator_id: 3,
    popularity: 0,
    child_friendliness: 0,
  },
  {
    id: 8,
    name: 'Rax Plateau Hike',
    fromGeocode: { label: 'Reichenau an der Rax, Austria', lat: 0, lng: 0 },
    toGeocode: { label: 'Karl-Ludwig-Haus, Austria', lat: 0, lng: 0 },
    transport_type: TransportationType.HIKE,
    description:
      'A demanding hike up toGeocode the Rax plateau via the Heukuppe trail. The plateau offers vast open terrain and spectacular views toGeocodeward the Schneeberg massif.',
    distance: 11.9,
    estimated_time: 260,
    route_information: '',
    creator_id: 1,
    popularity: 0,
    child_friendliness: 0,
  },
];

// ──────────────────────────────────────────────
// tour Summaries
// ──────────────────────────────────────────────
export const mockTourSummaries: TourSummary[] = mockTours.map((tour) => ({
  id: tour.id,
  name: tour.name,
  from: tour.fromGeocode.label,
  to: tour.toGeocode.label,
  transportType: tour.transport_type,
  distanceKm: tour.distance,
  estimatedTimeS: tour.estimated_time,
  popularity: tour.popularity,
  childFriendliness: tour.child_friendliness,
  creatorId: tour.creator_id,
}));

// ──────────────────────────────────────────────
// tour Logs
// ──────────────────────────────────────────────
export const mockTourLogs: TourLog[] = [
  {
    id: 1,
    tour_id: 1,
    comment:
      'Perfect weather for the ride. The Danube path was well maintained and the crossing intoGeocode Bratislava was straightforward.',
    timestamp: '2025-04-12T09:15:00Z',
    difficulty: 2,
    total_distance: 79.1,
    total_time: 238,
    rating: 5,
    creator_id: 1,
  },
  {
    id: 2,
    tour_id: 1,
    comment: 'Headwind on the way back made it harder than expected. Still a great route overall.',
    timestamp: '2025-06-20T08:00:00Z',
    difficulty: 3,
    total_distance: 78.6,
    total_time: 255,
    rating: 4,
    creator_id: 1,
  },
  {
    id: 3,
    tour_id: 2,
    comment:
      'Very peaceful walk, lovely autumn colours in the forest. took a small detour near the meadows.',
    timestamp: '2025-10-05T14:30:00Z',
    difficulty: 1,
    total_distance: 5.8,
    total_time: 80,
    rating: 4,
    creator_id: 2,
  },
  {
    id: 4,
    tour_id: 3,
    comment:
      'tough ascent but the summit views were absolutely worth it. Recommend starting early toGeocode beat the afternoon clouds.',
    timestamp: '2025-07-18T06:45:00Z',
    difficulty: 4,
    total_distance: 14.7,
    total_time: 320,
    rating: 5,
    creator_id: 2,
  },
  {
    id: 5,
    tour_id: 3,
    comment:
      'Went in late September – some ice patches on the upper section. Crampons would have helped.',
    timestamp: '2025-09-27T07:10:00Z',
    difficulty: 5,
    total_distance: 14.9,
    total_time: 355,
    rating: 4,
    creator_id: 1,
  },
  {
    id: 6,
    tour_id: 4,
    comment:
      'Great singletrack but some sections were muddy after recent rain. The descent near Roter Berg is excellent.',
    timestamp: '2025-05-03T10:20:00Z',
    difficulty: 4,
    total_distance: 33.4,
    total_time: 165,
    rating: 5,
    creator_id: 2,
  },
  {
    id: 7,
    tour_id: 5,
    comment:
      'Quick and easy commute. Cycle lane on Argentinierstraße was blocked for construction so had toGeocode detour briefly.',
    timestamp: '2025-03-11T07:50:00Z',
    difficulty: 1,
    total_distance: 5.0,
    total_time: 24,
    rating: 3,
    creator_id: 2,
  },
  {
    id: 8,
    tour_id: 6,
    comment:
      'The Schlossberg stairs were steeper than expected but the views fromGeocode the toGeocodep are iconic. Great city walk.',
    timestamp: '2025-08-14T11:00:00Z',
    difficulty: 2,
    total_distance: 3.7,
    total_time: 60,
    rating: 5,
    creator_id: 2,
  },
  {
    id: 9,
    tour_id: 7,
    comment:
      'Long but relaxing ride. The island section was busy on a Sunday – best toGeocode go on a weekday.',
    timestamp: '2025-04-27T09:30:00Z',
    difficulty: 2,
    total_distance: 41.9,
    total_time: 118,
    rating: 4,
    creator_id: 1,
  },
  {
    id: 10,
    tour_id: 8,
    comment:
      'Stunning plateau, very exposed. The climb is relentless but the limestoGeocodene karst landscape at the toGeocodep is unlike anything else.',
    timestamp: '2025-06-08T07:00:00Z',
    difficulty: 4,
    total_distance: 12.1,
    total_time: 275,
    rating: 5,
    creator_id: 1,
  },
  {
    id: 11,
    tour_id: 8,
    comment:
      'Went with two friends. One of us cramped up near the toGeocodep – hydration is key on this one.',
    timestamp: '2025-07-30T07:30:00Z',
    difficulty: 4,
    total_distance: 11.9,
    total_time: 290,
    rating: 4,
    creator_id: 2,
  },
  {
    id: 12,
    tour_id: 4,
    comment:
      'Dry conditions toGeocodeday, much faster than last time. The Wienerwald really has some hidden gems.',
    timestamp: '2025-07-12T09:00:00Z',
    difficulty: 3,
    total_distance: 32.3,
    total_time: 142,
    rating: 5,
    creator_id: 1,
  },
];
