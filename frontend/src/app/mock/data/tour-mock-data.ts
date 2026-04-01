//import { Tour, TourLog, TransportType, Difficulty } from './models';

// ------------------------------------------------------------------ models --
// Inline minimal model definitions so the file is self-contained.
// Replace with your actual model imports once defined.

export type TransportType = 'hike' | 'bike' | 'running' | 'vacation';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface TourLog {
  id: string;
  tourId: string;
  dateTime: string; // ISO-8601
  comment: string;
  difficulty: Difficulty;
  totalDistance: number; // km
  totalTime: number; // minutes
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: TransportType;
  distance: number; // km  – fetched from OpenRouteService
  estimatedTime: number; // minutes
  routeImagePath: string; // path on server filesystem
  logs: TourLog[];
  // computed (derived in mediator, not stored):
  // popularity:    number
  // childFriendly: boolean
}

// ----------------------------------------------------------------- logs -----

export const MOCK_LOGS: TourLog[] = [
  // --- Prater Rundweg logs ---
  {
    id: 'log-001',
    tourId: 'tour-001',
    dateTime: '2024-03-15T09:30:00Z',
    comment: 'Perfect spring morning, paths were dry and quiet.',
    difficulty: 1,
    totalDistance: 7.2,
    totalTime: 95,
    rating: 5,
  },
  {
    id: 'log-002',
    tourId: 'tour-001',
    dateTime: '2024-05-02T07:15:00Z',
    comment: 'A bit crowded near the Lusthaus but otherwise great.',
    difficulty: 1,
    totalDistance: 7.4,
    totalTime: 100,
    rating: 4,
  },
  {
    id: 'log-003',
    tourId: 'tour-001',
    dateTime: '2024-07-20T06:45:00Z',
    comment: 'Very hot, started early to avoid the heat.',
    difficulty: 2,
    totalDistance: 7.2,
    totalTime: 88,
    rating: 3,
  },

  // --- Kahlenberg Hike logs ---
  {
    id: 'log-004',
    tourId: 'tour-002',
    dateTime: '2024-04-10T08:00:00Z',
    comment: 'Stunning views over Vienna at the top. Some muddy sections.',
    difficulty: 3,
    totalDistance: 14.1,
    totalTime: 210,
    rating: 5,
  },
  {
    id: 'log-005',
    tourId: 'tour-002',
    dateTime: '2024-09-14T09:00:00Z',
    comment: 'Autumn colours were beautiful. Legs felt it the next day.',
    difficulty: 3,
    totalDistance: 14.3,
    totalTime: 225,
    rating: 5,
  },

  // --- Donauinsel Bike Tour logs ---
  {
    id: 'log-006',
    tourId: 'tour-003',
    dateTime: '2024-06-08T10:00:00Z',
    comment: 'Great flat ride, brought the kids along.',
    difficulty: 1,
    totalDistance: 21.5,
    totalTime: 80,
    rating: 5,
  },
  {
    id: 'log-007',
    tourId: 'tour-003',
    dateTime: '2024-08-17T17:30:00Z',
    comment: 'Evening ride, very relaxing atmosphere.',
    difficulty: 1,
    totalDistance: 22.0,
    totalTime: 85,
    rating: 4,
  },
  {
    id: 'log-008',
    tourId: 'tour-003',
    dateTime: '2024-10-05T11:00:00Z',
    comment: 'Windy, but manageable. Path in good condition.',
    difficulty: 2,
    totalDistance: 21.8,
    totalTime: 90,
    rating: 4,
  },

  // --- Ringstrasse Running logs ---
  {
    id: 'log-009',
    tourId: 'tour-004',
    dateTime: '2024-03-01T06:30:00Z',
    comment: 'Classic city run. Cobblestones tough on the knees.',
    difficulty: 2,
    totalDistance: 5.6,
    totalTime: 35,
    rating: 4,
  },
  {
    id: 'log-010',
    tourId: 'tour-004',
    dateTime: '2024-04-22T07:00:00Z',
    comment: 'Marathon training run, steady pace throughout.',
    difficulty: 3,
    totalDistance: 5.6,
    totalTime: 33,
    rating: 3,
  },

  // --- Wachau Radweg (no logs yet – tests unpopular tour case) ---

  // --- Schneeberg Day Hike logs ---
  {
    id: 'log-011',
    tourId: 'tour-006',
    dateTime: '2024-07-04T07:00:00Z',
    comment: 'Challenging ascent, snow still present near the summit.',
    difficulty: 5,
    totalDistance: 18.0,
    totalTime: 360,
    rating: 5,
  },
];

// ----------------------------------------------------------------- tours ----

export const MOCK_TOURS: Tour[] = [
  {
    id: 'tour-001',
    name: 'Prater Rundweg',
    description:
      'A leisurely loop through the green Prater meadows and along the Hauptallee. ' +
      'Ideal for beginners and families. Mostly flat gravel paths.',
    from: 'Praterstern, Vienna',
    to: 'Praterstern, Vienna',
    transportType: 'running',
    distance: 7.3,
    estimatedTime: 90,
    routeImagePath: '/assets/maps/prater-rundweg.png',
    logs: MOCK_LOGS.filter((l) => l.tourId === 'tour-001'),
  },
  {
    id: 'tour-002',
    name: 'Kahlenberg Hike',
    description:
      'Classic Vienna hike from Heiligenstadt up through the Viennese Woods to the ' +
      'Kahlenberg summit (484 m). Rewarded with a panoramic view over the city and Danube.',
    from: 'Heiligenstadt Station, Vienna',
    to: 'Kahlenberg Summit, Vienna',
    transportType: 'hike',
    distance: 14.2,
    estimatedTime: 210,
    routeImagePath: '/assets/maps/kahlenberg.png',
    logs: MOCK_LOGS.filter((l) => l.tourId === 'tour-002'),
  },
  {
    id: 'tour-003',
    name: 'Donauinsel Bike Tour',
    description:
      'Flat, traffic-free bike ride along the full length of the Donauinsel. ' +
      'Perfect for all ages. Beach bars and picnic spots along the way.',
    from: 'Floridsdorfer Brücke, Vienna',
    to: 'Donauinsel Süd, Vienna',
    transportType: 'bike',
    distance: 21.5,
    estimatedTime: 75,
    routeImagePath: '/assets/maps/donauinsel.png',
    logs: MOCK_LOGS.filter((l) => l.tourId === 'tour-003'),
  },
  {
    id: 'tour-004',
    name: 'Ringstrasse Running Loop',
    description:
      'Urban running route around the iconic Ringstrasse, passing the Opera, ' +
      'Parliament, Rathaus and Burgtheater. Best enjoyed early morning.',
    from: 'Staatsoper, Vienna',
    to: 'Staatsoper, Vienna',
    transportType: 'running',
    distance: 5.6,
    estimatedTime: 35,
    routeImagePath: '/assets/maps/ringstrasse.png',
    logs: MOCK_LOGS.filter((l) => l.tourId === 'tour-004'),
  },
  {
    id: 'tour-005',
    name: 'Wachau Radweg',
    description:
      'Multi-day bike vacation along the Danube through the UNESCO-listed Wachau valley. ' +
      'Vineyards, medieval ruins and charming villages. No logs yet – newly added.',
    from: 'Krems an der Donau',
    to: 'Melk Abbey',
    transportType: 'vacation',
    distance: 38.0,
    estimatedTime: 150,
    routeImagePath: '/assets/maps/wachau.png',
    logs: [], // intentionally empty – tests "unpopular" computed state
  },
  {
    id: 'tour-006',
    name: 'Schneeberg Day Hike',
    description:
      'Demanding full-day hike to the highest peak in Lower Austria (2076 m). ' +
      'Via the Damböckhaus route. Not suitable for children or inexperienced hikers.',
    from: 'Puchberg am Schneeberg',
    to: 'Schneeberg Summit',
    transportType: 'hike',
    distance: 18.0,
    estimatedTime: 360,
    routeImagePath: '/assets/maps/schneeberg.png',
    logs: MOCK_LOGS.filter((l) => l.tourId === 'tour-006'),
  },
];
