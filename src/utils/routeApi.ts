
// Mock API service for routes

// Mock data
const mockRoutes = [
  {
    id: '1',
    name: 'Poland to Spain Trip',
    startDate: '2024-07-15',
    stops: [
      {
        address: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
      },
      {
        address: 'Berlin, Germany',
        lat: 52.5200,
        lng: 13.4050,
      },
      {
        address: 'Paris, France',
        lat: 48.8566,
        lng: 2.3522,
      },
      {
        address: 'Madrid, Spain',
        lat: 40.4168,
        lng: -3.7038,
      },
    ],
    returnJourney: true,
    returnStops: [
      {
        address: 'Barcelona, Spain',
        lat: 41.3851,
        lng: 2.1734,
      },
      {
        address: 'Lyon, France',
        lat: 45.7640,
        lng: 4.8357,
      },
      {
        address: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
      },
    ],
    duration: '35h 20m',
    distance: '2,750 km',
  },
  {
    id: '2',
    name: 'Eastern Europe Tour',
    startDate: '2024-08-10',
    stops: [
      {
        address: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
      },
      {
        address: 'Krakow, Poland',
        lat: 50.0647,
        lng: 19.9450,
      },
      {
        address: 'Vienna, Austria',
        lat: 48.2082,
        lng: 16.3738,
      },
      {
        address: 'Budapest, Hungary',
        lat: 47.4979,
        lng: 19.0402,
      },
    ],
    returnJourney: false,
    returnStops: [],
    duration: '12h 45m',
    distance: '890 km',
  },
  {
    id: '3',
    name: 'Baltic Route',
    startDate: '2024-07-15', // Same date as first route
    stops: [
      {
        address: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
      },
      {
        address: 'Vilnius, Lithuania',
        lat: 54.6872,
        lng: 25.2797,
      },
      {
        address: 'Riga, Latvia',
        lat: 56.9496,
        lng: 24.1052,
      },
      {
        address: 'Tallinn, Estonia',
        lat: 59.4370,
        lng: 24.7536,
      },
    ],
    returnJourney: true,
    returnStops: [
      {
        address: 'Warsaw, Poland',
        lat: 52.2297,
        lng: 21.0122,
      },
    ],
    duration: '15h 30m',
    distance: '1,050 km',
  },
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service
export const routeApi = {
  // Get all routes
  getRoutes: async () => {
    await delay(500); // Simulate network delay
    return [...mockRoutes];
  },
  
  // Get route by ID
  getRoute: async (id: string) => {
    await delay(300);
    const route = mockRoutes.find(r => r.id === id);
    if (!route) throw new Error('Route not found');
    return { ...route };
  },
  
  // Create new route
  createRoute: async (routeData: any) => {
    await delay(700);
    const newRoute = {
      ...routeData,
      id: Date.now().toString(),
    };
    mockRoutes.push(newRoute);
    return newRoute;
  },
  
  // Update existing route
  updateRoute: async (id: string, routeData: any) => {
    await delay(500);
    const index = mockRoutes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Route not found');
    
    const updatedRoute = { ...routeData, id };
    mockRoutes[index] = updatedRoute;
    return updatedRoute;
  },
  
  // Delete route
  deleteRoute: async (id: string) => {
    await delay(300);
    const index = mockRoutes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Route not found');
    
    mockRoutes.splice(index, 1);
    return { success: true };
  },
  
  // Group routes by date
  getRoutesByDate: async () => {
    await delay(500);
    const routes = [...mockRoutes];
    
    // Group by date
    const groupedRoutes: Record<string, any[]> = {};
    
    routes.forEach(route => {
      const date = route.startDate;
      if (!groupedRoutes[date]) {
        groupedRoutes[date] = [];
      }
      groupedRoutes[date].push(route);
    });
    
    // Convert to array format for easier rendering
    return Object.entries(groupedRoutes).map(([date, routes]) => ({
      date,
      routes,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
};
