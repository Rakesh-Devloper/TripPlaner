// Weather forecasting service

export const weatherService = {
  getForecast: (destination = 'Bali, Indonesia') => {
    return [
      { day: 'Mon', temp: '29°C', condition: 'Sunny', rain: '10%' },
      { day: 'Tue', temp: '30°C', condition: 'Sunny', rain: '5%' },
      { day: 'Wed', temp: '28°C', condition: 'Partly Cloudy', rain: '20%' },
      { day: 'Thu', temp: '27°C', condition: 'Light Rain', rain: '45%' },
      { day: 'Fri', temp: '29°C', condition: 'Sunny', rain: '15%' },
      { day: 'Sat', temp: '31°C', condition: 'Clear', rain: '0%' },
      { day: 'Sun', temp: '30°C', condition: 'Sunny', rain: '10%' },
    ];
  }
};

export default weatherService;
