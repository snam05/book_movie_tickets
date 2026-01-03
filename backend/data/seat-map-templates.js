// Sample seat_map JSON structures for reference
// Use these as templates when adding new theaters

// Standard Theater (80 seats: 8 rows x 10 seats)
const standardTheaterSeatMap = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  seatsPerRow: 10,
  layout: [
    // Each row is an array of seat objects
    // Row A (front)
    [
      { id: 'A1', row: 'A', number: 1, type: 'standard' },
      { id: 'A2', row: 'A', number: 2, type: 'standard' },
      { id: 'A3', row: 'A', number: 3, type: 'standard' },
      { id: 'A4', row: 'A', number: 4, type: 'standard' },
      { id: 'A5', row: 'A', number: 5, type: 'standard' },
      { id: 'A6', row: 'A', number: 6, type: 'standard' },
      { id: 'A7', row: 'A', number: 7, type: 'standard' },
      { id: 'A8', row: 'A', number: 8, type: 'standard' },
      { id: 'A9', row: 'A', number: 9, type: 'standard' },
      { id: 'A10', row: 'A', number: 10, type: 'standard' }
    ],
    // Rows B-D: standard (similar pattern)
    // Row E-F: VIP
    [
      { id: 'E1', row: 'E', number: 1, type: 'vip' },
      { id: 'E2', row: 'E', number: 2, type: 'vip' },
      // ... E3-E10
    ],
    // Row G-H: Couple seats (paired)
    [
      { id: 'G1', row: 'G', number: 1, type: 'couple', pairWith: 'G2' },
      { id: 'G2', row: 'G', number: 2, type: 'couple', pairWith: 'G1' },
      { id: 'G3', row: 'G', number: 3, type: 'couple', pairWith: 'G4' },
      { id: 'G4', row: 'G', number: 4, type: 'couple', pairWith: 'G3' },
      // ... pairs continue
    ]
  ],
  pricing: {
    standard: 1.0,  // Base multiplier
    vip: 1.5,       // 50% more
    couple: 2.0     // Price for the pair (counted as 2 seats)
  },
  metadata: {
    screen: 'front',
    aisles: [3, 7],  // Aisle positions (after seat 3 and 7)
    wheelchairAccessible: ['A1', 'A10'],
    notes: 'Standard multiplex theater'
  }
};

// VIP Theater (40 seats: 5 rows x 8 seats, all VIP)
const vipTheaterSeatMap = {
  rows: ['A', 'B', 'C', 'D', 'E'],
  seatsPerRow: 8,
  layout: [
    [
      { id: 'A1', row: 'A', number: 1, type: 'vip' },
      { id: 'A2', row: 'A', number: 2, type: 'vip' },
      { id: 'A3', row: 'A', number: 3, type: 'vip' },
      { id: 'A4', row: 'A', number: 4, type: 'vip' },
      { id: 'A5', row: 'A', number: 5, type: 'vip' },
      { id: 'A6', row: 'A', number: 6, type: 'vip' },
      { id: 'A7', row: 'A', number: 7, type: 'vip' },
      { id: 'A8', row: 'A', number: 8, type: 'vip' }
    ]
    // Rows B-E similar
  ],
  pricing: {
    vip: 1.0  // All seats same price (premium base price)
  },
  metadata: {
    screen: 'front',
    recliners: true,
    notes: 'Premium VIP theater with reclining seats'
  }
};

// IMAX Theater (120 seats: 10 rows x 12 seats)
const imaxTheaterSeatMap = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  seatsPerRow: 12,
  layout: [
    // Front rows (A-C): standard
    // Middle rows (D-G): VIP (best viewing angle)
    // Back rows (H-J): standard
  ],
  pricing: {
    standard: 1.0,
    vip: 1.8
  },
  metadata: {
    screen: 'large',
    screenType: 'IMAX',
    aisles: [4, 8],
    notes: 'IMAX theater - rows D-G are premium'
  }
};

// Couple Theater (30 seats: 6 rows x 5 pairs = 10 individual seats)
const coupleTheaterSeatMap = {
  rows: ['A', 'B', 'C', 'D', 'E', 'F'],
  seatsPerRow: 10,  // 5 pairs
  layout: [
    [
      { id: 'A1', row: 'A', number: 1, type: 'couple', pairWith: 'A2' },
      { id: 'A2', row: 'A', number: 2, type: 'couple', pairWith: 'A1' },
      { id: 'A3', row: 'A', number: 3, type: 'couple', pairWith: 'A4' },
      { id: 'A4', row: 'A', number: 4, type: 'couple', pairWith: 'A3' },
      { id: 'A5', row: 'A', number: 5, type: 'couple', pairWith: 'A6' },
      { id: 'A6', row: 'A', number: 6, type: 'couple', pairWith: 'A5' },
      { id: 'A7', row: 'A', number: 7, type: 'couple', pairWith: 'A8' },
      { id: 'A8', row: 'A', number: 8, type: 'couple', pairWith: 'A7' },
      { id: 'A9', row: 'A', number: 9, type: 'couple', pairWith: 'A10' },
      { id: 'A10', row: 'A', number: 10, type: 'couple', pairWith: 'A9' }
    ]
    // All rows same pattern
  ],
  pricing: {
    couple: 2.0  // Pair price (must book both seats)
  },
  metadata: {
    screen: 'front',
    coupleSeating: true,
    notes: 'All seats are couple seats - must book in pairs'
  }
};

// Export for use in seed scripts
export {
  standardTheaterSeatMap,
  vipTheaterSeatMap,
  imaxTheaterSeatMap,
  coupleTheaterSeatMap
};
