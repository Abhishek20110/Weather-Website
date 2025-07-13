# Weather App

A comprehensive weather application built with Next.js 14+ and the OpenWeatherMap API, featuring real-time weather data, dynamic themes, and smooth animations.

## Features

- **Real-time Weather Data**: Current conditions and 5-day forecasts
- **Geolocation Support**: Automatic location detection with fallback options
- **Smart Search**: Debounced city search with autocomplete
- **Dynamic Themes**: Weather-based color schemes and time-of-day adjustments
- **Smooth Animations**: Framer Motion and GSAP powered transitions
- **Favorites System**: Save and manage favorite locations
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Error Handling**: Comprehensive error boundaries and loading states

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion + GSAP
- **API**: OpenWeatherMap API
- **HTTP Client**: Axios
- **Storage**: LocalStorage for preferences and favorites

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file and add your OpenWeatherMap API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   **Important**: Make sure to use a valid API key from OpenWeatherMap. The key must be active and have the necessary permissions for current weather and forecast data.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## API Key Setup

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env.local` file

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/
│   └── weather/           # Weather-specific components
│       ├── SearchBar.tsx
│       ├── WeatherCard.tsx
│       ├── ForecastSection.tsx
│       └── ...
├── hooks/                 # Custom React hooks
│   ├── useWeather.ts
│   └── useDebounce.ts
├── lib/                   # Utility functions and services
│   ├── weather-api.ts     # OpenWeatherMap API client
│   ├── geolocation.ts     # Location services
│   ├── storage.ts         # LocalStorage utilities
│   └── weather-themes.ts  # Dynamic theming
└── ...
```

## Key Features

### Dynamic Theming
The app automatically adjusts its color scheme based on:
- Current weather conditions (sunny, rainy, cloudy, etc.)
- Time of day (day/night modes)
- Temperature ranges

### Geolocation Services
- Automatic location detection
- Fallback handling for denied permissions
- Manual location search as alternative

### Weather Data
- Current conditions with detailed metrics
- 5-day forecast with hourly breakdown
- Weather alerts and warnings
- Sunrise/sunset times
- Wind speed and direction
- Humidity and visibility

### User Experience
- Smooth loading states and transitions
- Error boundaries for graceful error handling
- Responsive design for all screen sizes
- Accessibility features (keyboard navigation, ARIA labels)
- Offline capability with cached data

## Customization

### Adding New Weather Metrics
1. Extend the `WeatherData` interface in `lib/weather-api.ts`
2. Update the API client to fetch new data
3. Add display components in `components/weather/`

### Custom Themes
1. Modify `getWeatherTheme()` in `lib/weather-themes.ts`
2. Add new color schemes for different weather conditions
3. Update CSS variables in `globals.css`

### Additional Features
The architecture supports easy extension for:
- Push notifications
- Weather maps integration
- Historical weather data
- Multiple location tracking
- Social sharing

## Performance Optimizations

- Debounced search to reduce API calls
- Lazy loading for forecast data
- Optimized re-renders with React.memo
- Efficient state management
- Image optimization for weather icons

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.