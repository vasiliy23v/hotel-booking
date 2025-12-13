// Утилита для генерации комнат из исходных данных
import type { Room } from '@/types';

// Данные комнат из исходного проекта HOTEL
const INITIAL_ROOMS_DATA = [
  { id: 'eg-1', number: '2', name: '', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 1, y: 2 } },
  { id: 'eg-2', number: '3', name: '', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 2, y: 2 } },
  { id: 'eg-3', number: '4', name: 'Ten Tamara', type: 'FZ', capacity: 'bis 4 Per.', beds: ['2-EB', '1-HB'], floor: 'EG', price: 88, position: { x: 3, y: 1 } },
  { id: 'eg-4', number: '5', name: 'Ten Tamara', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 3, y: 0 } },
  { id: 'eg-5', number: '6', name: 'Muljarova Sofia', type: 'EZ', capacity: '1 Per.', beds: ['1-EB'], floor: 'EG', price: 65, position: { x: 4, y: 2 } },
  { id: 'eg-6', number: '7', name: 'Lvova Lena', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 5, y: 2 } },
  { id: 'eg-7', number: '8', name: 'Gulko+Mammet', type: 'FZ', capacity: 'bis 4 Per.', beds: ['2-EB', '1-HB'], floor: 'EG', price: 88, position: { x: 6, y: 2 } },
  { id: 'eg-8', number: '9', name: '', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 6, y: 0 } },
  { id: 'eg-9', number: '10', name: 'Nika+Dan', type: 'FZ', capacity: 'bis 4 Per.', beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 5, y: 0 } },
  { id: '1og-1', number: '12', name: '', type: 'FZ', capacity: '4 Per.', beds: ['2-EB', 'HB'], floor: '1OG', price: 88, position: { x: 1, y: 2 } },
  { id: '1og-2', number: '13', name: '', type: 'FZ', capacity: '4 Per.', beds: ['DB', 'HB'], floor: '1OG', price: 88, position: { x: 2, y: 2 } },
  { id: '1og-3', number: '14', name: '', type: 'FZ', capacity: '4 Per.', beds: ['DB', 'HB'], floor: '1OG', price: 88, position: { x: 3, y: 1 } },
  { id: '1og-4', number: '15', name: '', type: 'FZ', capacity: 'bis 4Per.', beds: ['DB', 'HB'], floor: '1OG', price: 88, position: { x: 3, y: 0 } },
  { id: '1og-5', number: '16', name: 'Margolin Katja', type: 'EZ', capacity: '1 Per.', beds: [], floor: '1OG', price: 65, position: { x: 4, y: 2 } },
  { id: '1og-6', number: '17', name: '', type: 'FZ', capacity: '4 Per.', beds: ['2-EB', 'HB'], floor: '1OG', price: 88, position: { x: 5, y: 2 } },
  { id: '1og-7', number: '18', name: '', type: 'FZ', capacity: '4 Per.', beds: ['2-EB', 'HB'], floor: '1OG', price: 88, position: { x: 6, y: 2 } },
  { id: '1og-8', number: '19', name: '', type: 'FZ', capacity: '4 Per.', beds: ['2-EB', 'HB'], floor: '1OG', price: 88, position: { x: 6, y: 0 } },
  { id: '1og-9', number: '20', name: '', type: 'FZ', capacity: '4 Per.', beds: ['DB', 'HB'], floor: '1OG', price: 88, position: { x: 5, y: 0 } },
  { id: '2og-1', number: '21', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 1, y: 2 } },
  { id: '2og-2', number: '22', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 2, y: 2 } },
  { id: '2og-3', number: '23', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 3, y: 1 } },
  { id: '2og-4', number: '24', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 3, y: 0 } },
  { id: '2og-5', number: '26', name: '', type: 'EZ', capacity: '1 Per.', beds: [], floor: '2OG', price: 65, position: { x: 4, y: 1 } },
  { id: '2og-6', number: '27', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 5, y: 2 } },
  { id: '2og-7', number: '25', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 6, y: 2 } },
  { id: '2og-8', number: '28', name: '', type: 'DZ', capacity: '2 Per.', beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 7, y: 1 } },
  { id: '2og-9', number: '26L', name: '', type: 'FZ', capacity: 'bis 6Per.', beds: ['2-DB', '1-HB'], floor: '2OG', price: 130, position: { x: 7, y: 0 } },
];

// Данные из react-ts проекта
const REACT_TS_ROOMS_DATA = [
  { id: 'h1-eg-1', hotelId: 'hotel-1', number: '101', name: '', type: 'FZ', capacity: 'до 4 чел.', maxCapacity: 4, beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 0, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-eg-2', hotelId: 'hotel-1', number: '102', name: '', type: 'FZ', capacity: 'до 4 чел.', maxCapacity: 4, beds: ['1-DB', '1-HB'], floor: 'EG', price: 88, position: { x: 130, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-eg-3', hotelId: 'hotel-1', number: '103', name: '', type: 'DZ', capacity: '2 чел.', maxCapacity: 2, beds: ['2-EB'], floor: 'EG', price: 70, position: { x: 260, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-eg-4', hotelId: 'hotel-1', number: '104', name: '', type: 'EZ', capacity: '1 чел.', maxCapacity: 1, beds: ['1-EB'], floor: 'EG', price: 65, position: { x: 390, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-1og-1', hotelId: 'hotel-1', number: '201', name: '', type: 'FZ', capacity: 'до 4 чел.', maxCapacity: 4, beds: ['2-EB', 'HB'], floor: '1OG', price: 88, position: { x: 0, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-1og-2', hotelId: 'hotel-1', number: '202', name: '', type: 'DZ', capacity: '2 чел.', maxCapacity: 2, beds: ['DB'], floor: '1OG', price: 70, position: { x: 130, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h1-2og-1', hotelId: 'hotel-1', number: '301', name: '', type: 'DZ', capacity: '2 чел.', maxCapacity: 2, beds: ['2-EB'], floor: '2OG', price: 70, position: { x: 0, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h2-eg-1', hotelId: 'hotel-2', number: '101', name: '', type: 'FZ', capacity: 'до 4 чел.', maxCapacity: 4, beds: ['1-DB', '1-HB'], floor: 'EG', price: 95, position: { x: 0, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h2-eg-2', hotelId: 'hotel-2', number: '102', name: '', type: 'DZ', capacity: '2 чел.', maxCapacity: 2, beds: ['2-EB'], floor: 'EG', price: 75, position: { x: 130, y: 0 }, width: 120, height: 100, zIndex: 1 },
  { id: 'h2-1og-1', hotelId: 'hotel-2', number: '201', name: '', type: 'FZ', capacity: 'до 6 чел.', maxCapacity: 6, beds: ['2-DB', '1-HB'], floor: '1OG', price: 130, position: { x: 0, y: 0 }, width: 120, height: 100, zIndex: 1 },
];

/**
 * Парсит capacity строку и возвращает максимальную вместимость
 */
function parseMaxCapacity(capacity: string): number {
  const match = capacity.match(/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Fallback на основе типа
  if (capacity.includes('bis 6') || capacity.includes('до 6')) return 6;
  if (capacity.includes('bis 4') || capacity.includes('до 4')) return 4;
  if (capacity.includes('2')) return 2;
  if (capacity.includes('1')) return 1;
  
  return 2; // По умолчанию
}

/**
 * Генерирует комнаты для отеля на основе шаблонных данных
 */
export function generateRoomsForHotel(
  hotelId: string,
  template: 'hotel1' | 'hotel2' | 'legacy' = 'legacy'
): Room[] {
  let templateRooms: Record<string, unknown>[] = [];

  if (template === 'hotel1') {
    templateRooms = REACT_TS_ROOMS_DATA.filter(r => r.hotelId === 'hotel-1');
  } else if (template === 'hotel2') {
    templateRooms = REACT_TS_ROOMS_DATA.filter(r => r.hotelId === 'hotel-2');
  } else {
    // Legacy - используем данные из HOTEL проекта
    templateRooms = INITIAL_ROOMS_DATA;
  }

  return templateRooms.map((room: Record<string, unknown>) => {
    const capacityStr = typeof room.capacity === 'string' ? room.capacity : '';
    const maxCapacity = (typeof room.maxCapacity === 'number' ? room.maxCapacity : null) || parseMaxCapacity(capacityStr);
    
    return {
      id: `${hotelId}-${room.id}`,
      number: typeof room.number === 'string' ? room.number : '',
      hotelId: hotelId,
      name: typeof room.name === 'string' ? room.name : '',
      type: room.type as 'FZ' | 'DZ' | 'EZ' | 'MZ' | 'App' | 'COMMON',
      capacity: capacityStr,
      maxCapacity: maxCapacity,
      beds: Array.isArray(room.beds) ? room.beds as string[] : [],
      floor: room.floor as 'EG' | '1OG' | '2OG',
      price: typeof room.price === 'number' ? room.price : 0,
      position: (typeof room.position === 'object' && room.position !== null && 'x' in room.position && 'y' in room.position) 
        ? room.position as { x: number; y: number }
        : { x: 0, y: 0 },
      width: typeof room.width === 'number' ? room.width : 120,
      height: typeof room.height === 'number' ? room.height : 100,
      zIndex: typeof room.zIndex === 'number' ? room.zIndex : 1,
      isCommon: false,
      description: typeof room.description === 'string' ? room.description : undefined,
    } as Room;
  });
}

/**
 * Генерирует комнаты для всех отелей
 */
export function generateAllRooms(hotels: { id: string; name: string }[]): Room[] {
  const allRooms: Room[] = [];
  
  hotels.forEach((hotel, index) => {
    let template: 'hotel1' | 'hotel2' | 'legacy' = 'legacy';
    
    // Первый отель - hotel1, второй - hotel2, остальные - legacy
    if (index === 0) template = 'hotel1';
    else if (index === 1) template = 'hotel2';
    
    const rooms = generateRoomsForHotel(hotel.id, template);
    allRooms.push(...rooms);
  });
  
  return allRooms;
}






