// Script to seed theater seat maps
// Run: node scripts/seed-seat-maps.js

import { sequelize } from '../db.config.js';
import Theater from '../models/Theater.model.js';

const seatMaps = {
  // Standard Theater Layout (80 seats)
  standard: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 10,
    layout: generateStandardLayout(),
    pricing: {
      standard: 1.0,
      vip: 1.5,
      couple: 2.0
    },
    metadata: {
      screen: 'front',
      aisles: [3, 7],
      wheelchairAccessible: ['A1', 'A10']
    }
  },
  
  // VIP Theater Layout (40 seats)
  vip: {
    rows: ['A', 'B', 'C', 'D', 'E'],
    seatsPerRow: 8,
    layout: generateVIPLayout(),
    pricing: {
      vip: 1.0
    },
    metadata: {
      screen: 'front',
      recliners: true
    }
  },
  
  // IMAX Theater Layout (120 seats)
  imax: {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    seatsPerRow: 12,
    layout: generateIMAXLayout(),
    pricing: {
      standard: 1.0,
      vip: 1.8
    },
    metadata: {
      screen: 'large',
      screenType: 'IMAX',
      aisles: [4, 8]
    }
  }
};

function generateStandardLayout() {
  const layout = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  rows.forEach((row, rowIndex) => {
    const rowSeats = [];
    for (let i = 1; i <= 10; i++) {
      const seatId = `${row}${i}`;
      let seatType = 'standard';
      
      // Rows E-F are VIP
      if (rowIndex >= 4 && rowIndex <= 5) {
        seatType = 'vip';
      }
      // Rows G-H are couple seats
      else if (rowIndex >= 6) {
        seatType = 'couple';
        const isOdd = i % 2 === 1;
        rowSeats.push({
          id: seatId,
          row: row,
          number: i,
          type: seatType,
          pairWith: `${row}${isOdd ? i + 1 : i - 1}`
        });
        continue;
      }
      
      rowSeats.push({
        id: seatId,
        row: row,
        number: i,
        type: seatType
      });
    }
    layout.push(rowSeats);
  });
  
  return layout;
}

function generateVIPLayout() {
  const layout = [];
  const rows = ['A', 'B', 'C', 'D', 'E'];
  
  rows.forEach(row => {
    const rowSeats = [];
    for (let i = 1; i <= 8; i++) {
      rowSeats.push({
        id: `${row}${i}`,
        row: row,
        number: i,
        type: 'vip'
      });
    }
    layout.push(rowSeats);
  });
  
  return layout;
}

function generateIMAXLayout() {
  const layout = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  rows.forEach((row, rowIndex) => {
    const rowSeats = [];
    for (let i = 1; i <= 12; i++) {
      // Rows D-G (index 3-6) are VIP
      const seatType = (rowIndex >= 3 && rowIndex <= 6) ? 'vip' : 'standard';
      
      rowSeats.push({
        id: `${row}${i}`,
        row: row,
        number: i,
        type: seatType
      });
    }
    layout.push(rowSeats);
  });
  
  return layout;
}

async function seedSeatMaps() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Get all theaters
    const theaters = await Theater.findAll();
    
    if (theaters.length === 0) {
      console.log('⚠️  No theaters found. Please add theaters first.');
      return;
    }
    
    console.log(`📍 Found ${theaters.length} theater(s)\n`);
    
    // Assign seat maps based on theater type
    for (const theater of theaters) {
      let seatMapType = 'standard';
      
      // Determine seat map based on theater_type
      switch (theater.theater_type) {
        case 'vip':
          seatMapType = 'vip';
          break;
        case 'imax':
          seatMapType = 'imax';
          break;
        case '3d':
        case 'standard':
        default:
          seatMapType = 'standard';
          break;
      }
      
      const seatMap = seatMaps[seatMapType];
      
      // Calculate total seats
      const totalSeats = seatMap.layout.reduce((sum, row) => sum + row.length, 0);
      
      // Update theater
      await theater.update({
        seat_map: seatMap,
        total_seats: totalSeats
      });
      
      console.log(`✅ Theater: ${theater.name}`);
      console.log(`   Type: ${theater.theater_type} → ${seatMapType} layout`);
      console.log(`   Total seats: ${totalSeats}`);
      console.log(`   Rows: ${seatMap.rows.join(', ')}\n`);
    }
    
    console.log('🎉 Seat maps seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding seat maps:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedSeatMaps();
