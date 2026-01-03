-- Migration: Add seat_map JSON data to theaters
-- Run this to populate seat_map for existing theaters

-- Theater 1: Standard theater with 8 rows (A-H), 10 seats per row
UPDATE theaters SET seat_map = JSON_OBJECT(
    'rows', JSON_ARRAY('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'),
    'seatsPerRow', 10,
    'layout', JSON_ARRAY(
        -- Row A (front, standard)
        JSON_ARRAY(
            JSON_OBJECT('id', 'A1', 'row', 'A', 'number', 1, 'type', 'standard'),
            JSON_OBJECT('id', 'A2', 'row', 'A', 'number', 2, 'type', 'standard'),
            JSON_OBJECT('id', 'A3', 'row', 'A', 'number', 3, 'type', 'standard'),
            JSON_OBJECT('id', 'A4', 'row', 'A', 'number', 4, 'type', 'standard'),
            JSON_OBJECT('id', 'A5', 'row', 'A', 'number', 5, 'type', 'standard'),
            JSON_OBJECT('id', 'A6', 'row', 'A', 'number', 6, 'type', 'standard'),
            JSON_OBJECT('id', 'A7', 'row', 'A', 'number', 7, 'type', 'standard'),
            JSON_OBJECT('id', 'A8', 'row', 'A', 'number', 8, 'type', 'standard'),
            JSON_OBJECT('id', 'A9', 'row', 'A', 'number', 9, 'type', 'standard'),
            JSON_OBJECT('id', 'A10', 'row', 'A', 'number', 10, 'type', 'standard')
        ),
        -- Row B-D: Standard seats
        JSON_ARRAY(
            JSON_OBJECT('id', 'B1', 'row', 'B', 'number', 1, 'type', 'standard'),
            JSON_OBJECT('id', 'B2', 'row', 'B', 'number', 2, 'type', 'standard'),
            JSON_OBJECT('id', 'B3', 'row', 'B', 'number', 3, 'type', 'standard'),
            JSON_OBJECT('id', 'B4', 'row', 'B', 'number', 4, 'type', 'standard'),
            JSON_OBJECT('id', 'B5', 'row', 'B', 'number', 5, 'type', 'standard'),
            JSON_OBJECT('id', 'B6', 'row', 'B', 'number', 6, 'type', 'standard'),
            JSON_OBJECT('id', 'B7', 'row', 'B', 'number', 7, 'type', 'standard'),
            JSON_OBJECT('id', 'B8', 'row', 'B', 'number', 8, 'type', 'standard'),
            JSON_OBJECT('id', 'B9', 'row', 'B', 'number', 9, 'type', 'standard'),
            JSON_OBJECT('id', 'B10', 'row', 'B', 'number', 10, 'type', 'standard')
        ),
        -- Row E-F: VIP seats (middle, premium)
        JSON_ARRAY(
            JSON_OBJECT('id', 'E1', 'row', 'E', 'number', 1, 'type', 'vip'),
            JSON_OBJECT('id', 'E2', 'row', 'E', 'number', 2, 'type', 'vip'),
            JSON_OBJECT('id', 'E3', 'row', 'E', 'number', 3, 'type', 'vip'),
            JSON_OBJECT('id', 'E4', 'row', 'E', 'number', 4, 'type', 'vip'),
            JSON_OBJECT('id', 'E5', 'row', 'E', 'number', 5, 'type', 'vip'),
            JSON_OBJECT('id', 'E6', 'row', 'E', 'number', 6, 'type', 'vip'),
            JSON_OBJECT('id', 'E7', 'row', 'E', 'number', 7, 'type', 'vip'),
            JSON_OBJECT('id', 'E8', 'row', 'E', 'number', 8, 'type', 'vip'),
            JSON_OBJECT('id', 'E9', 'row', 'E', 'number', 9, 'type', 'vip'),
            JSON_OBJECT('id', 'E10', 'row', 'E', 'number', 10, 'type', 'vip')
        ),
        -- Row G-H: Couple seats (back rows, pairs)
        JSON_ARRAY(
            JSON_OBJECT('id', 'G1', 'row', 'G', 'number', 1, 'type', 'couple', 'pairWith', 'G2'),
            JSON_OBJECT('id', 'G2', 'row', 'G', 'number', 2, 'type', 'couple', 'pairWith', 'G1'),
            JSON_OBJECT('id', 'G3', 'row', 'G', 'number', 3, 'type', 'couple', 'pairWith', 'G4'),
            JSON_OBJECT('id', 'G4', 'row', 'G', 'number', 4, 'type', 'couple', 'pairWith', 'G3'),
            JSON_OBJECT('id', 'G5', 'row', 'G', 'number', 5, 'type', 'couple', 'pairWith', 'G6'),
            JSON_OBJECT('id', 'G6', 'row', 'G', 'number', 6, 'type', 'couple', 'pairWith', 'G5'),
            JSON_OBJECT('id', 'G7', 'row', 'G', 'number', 7, 'type', 'couple', 'pairWith', 'G8'),
            JSON_OBJECT('id', 'G8', 'row', 'G', 'number', 8, 'type', 'couple', 'pairWith', 'G7'),
            JSON_OBJECT('id', 'G9', 'row', 'G', 'number', 9, 'type', 'couple', 'pairWith', 'G10'),
            JSON_OBJECT('id', 'G10', 'row', 'G', 'number', 10, 'type', 'couple', 'pairWith', 'G9')
        )
    ),
    'pricing', JSON_OBJECT(
        'standard', 1.0,
        'vip', 1.5,
        'couple', 2.0
    ),
    'metadata', JSON_OBJECT(
        'screen', 'front',
        'aisles', JSON_ARRAY(3, 7),
        'wheelchairAccessible', JSON_ARRAY('A1', 'A10')
    )
) WHERE id = 1;

-- Theater 2: Smaller VIP theater (5 rows, 8 seats)
UPDATE theaters SET seat_map = JSON_OBJECT(
    'rows', JSON_ARRAY('A', 'B', 'C', 'D', 'E'),
    'seatsPerRow', 8,
    'layout', JSON_ARRAY(
        JSON_ARRAY(
            JSON_OBJECT('id', 'A1', 'row', 'A', 'number', 1, 'type', 'vip'),
            JSON_OBJECT('id', 'A2', 'row', 'A', 'number', 2, 'type', 'vip'),
            JSON_OBJECT('id', 'A3', 'row', 'A', 'number', 3, 'type', 'vip'),
            JSON_OBJECT('id', 'A4', 'row', 'A', 'number', 4, 'type', 'vip'),
            JSON_OBJECT('id', 'A5', 'row', 'A', 'number', 5, 'type', 'vip'),
            JSON_OBJECT('id', 'A6', 'row', 'A', 'number', 6, 'type', 'vip'),
            JSON_OBJECT('id', 'A7', 'row', 'A', 'number', 7, 'type', 'vip'),
            JSON_OBJECT('id', 'A8', 'row', 'A', 'number', 8, 'type', 'vip')
        )
    ),
    'pricing', JSON_OBJECT(
        'vip', 1.0
    ),
    'metadata', JSON_OBJECT(
        'screen', 'front',
        'recliners', true
    )
) WHERE id = 2;

-- Verify the updates
SELECT id, name, JSON_EXTRACT(seat_map, '$.rows') as rows, 
       JSON_LENGTH(JSON_EXTRACT(seat_map, '$.layout')) as row_count
FROM theaters 
WHERE seat_map IS NOT NULL;
