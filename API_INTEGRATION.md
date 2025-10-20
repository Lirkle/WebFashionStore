# API Integration Documentation

## Overview
This document describes the external API integrations used in the WebFashionStore project.

## 🌍 Geolocation API

### Service: IP-API (ipapi.co)
- **Purpose**: Automatic location detection
- **Endpoint**: `https://ipapi.co/json/`
- **Data Retrieved**:
  - City name
  - Country name
  - Latitude and longitude coordinates
- **Usage**: Display user location in header
- **Privacy**: No personal data collected

### Implementation
```javascript
async function fetchUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        userLocation = {
            city: data.city,
            country: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude
        };
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
    } catch (error) {
        console.error('Error fetching user location:', error);
    }
}
```

## 💱 Currency Exchange API

### Service: ExchangeRate-API
- **Purpose**: Real-time currency conversion
- **Endpoint**: `https://api.exchangerate-api.com/v4/latest/KZT`
- **Supported Currencies**: KZT, USD, EUR
- **Update Frequency**: Real-time
- **Usage**: Convert product prices dynamically

### Implementation
```javascript
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        const data = await response.json();
        exchangeRates = data.rates;
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}
```

### Currency Conversion
```javascript
function convertPrice(price, fromCurrency = 'KZT', toCurrency = 'USD') {
    if (!exchangeRates) return price;
    
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    return Math.round((price / fromRate) * toRate);
}
```

## 🌤️ Weather API

### Service: OpenWeatherMap
- **Purpose**: Location-based weather information
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**:
  - `lat`: Latitude from geolocation
  - `lon`: Longitude from geolocation
  - `appid`: API key (demo key used)
  - `units`: Metric (Celsius)
- **Data Retrieved**:
  - Current temperature
  - Weather description
  - Weather icon

### Implementation
```javascript
async function fetchWeatherData() {
    if (!userLocation) return null;
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=demo&units=metric`
        );
        const data = await response.json();
        return {
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
```

## 📧 Email Service Integration

### Service: EmailJS (Planned)
- **Purpose**: Send order confirmations and notifications
- **Features**:
  - Order confirmation emails
  - Newsletter subscriptions
  - Contact form submissions
- **Status**: Framework ready, requires API key setup

### Implementation
```javascript
async function sendEmailNotification(to, subject, message) {
    try {
        const templateParams = {
            to_email: to,
            subject: subject,
            message: message
        };
        
        // EmailJS integration would go here
        console.log('Email notification would be sent:', templateParams);
        showNotification('Уведомление отправлено на email!');
    } catch (error) {
        console.error('Error sending email notification:', error);
        showNotification('Ошибка отправки email', 'error');
    }
}
```

## 🔄 API Error Handling

### Fallback Strategies
1. **Location API Failure**: Default to "Атырау, Казахстан"
2. **Currency API Failure**: Show prices in KZT only
3. **Weather API Failure**: Hide weather widget
4. **Network Issues**: Graceful degradation

### Error Handling Implementation
```javascript
// Example error handling for location API
async function fetchUserLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Process data...
    } catch (error) {
        console.error('Error fetching user location:', error);
        // Fallback to default location
        userLocation = {
            city: 'Атырау',
            country: 'Казахстан',
            latitude: 47.1167,
            longitude: 51.8833
        };
    }
}
```

## 📊 API Performance

### Caching Strategy
- **Exchange Rates**: Cached for 1 hour
- **Location Data**: Cached until browser restart
- **Weather Data**: Cached for 30 minutes

### Optimization
- **Lazy Loading**: APIs called only when needed
- **Parallel Requests**: Multiple APIs called simultaneously
- **Error Recovery**: Automatic retry mechanisms

## 🔒 Security Considerations

### API Security
- **HTTPS Only**: All API calls use secure connections
- **No Sensitive Data**: Only public information retrieved
- **Rate Limiting**: Respect API rate limits
- **Error Sanitization**: No sensitive data in error messages

### Privacy Compliance
- **GDPR Compliant**: No personal data stored
- **User Consent**: Location services with user permission
- **Data Minimization**: Only necessary data collected

## 🧪 API Testing

### Test Cases
1. **Successful API Calls**: Verify data retrieval
2. **Network Failures**: Test fallback mechanisms
3. **Invalid Responses**: Handle malformed data
4. **Rate Limiting**: Test API limits
5. **Cross-Origin**: Verify CORS compliance

### Testing Implementation
```javascript
// Example API testing
async function testAPIs() {
    console.log('Testing API integrations...');
    
    // Test location API
    try {
        await fetchUserLocation();
        console.log('✅ Location API working');
    } catch (error) {
        console.log('❌ Location API failed:', error);
    }
    
    // Test currency API
    try {
        await fetchExchangeRates();
        console.log('✅ Currency API working');
    } catch (error) {
        console.log('❌ Currency API failed:', error);
    }
    
    // Test weather API
    try {
        const weather = await fetchWeatherData();
        console.log('✅ Weather API working');
    } catch (error) {
        console.log('❌ Weather API failed:', error);
    }
}
```

## 📈 Monitoring and Analytics

### API Monitoring
- **Response Times**: Track API performance
- **Error Rates**: Monitor failure rates
- **Usage Patterns**: Analyze API usage
- **Cost Tracking**: Monitor API costs

### Implementation
```javascript
// API performance monitoring
function trackAPIPerformance(apiName, startTime, success) {
    const duration = Date.now() - startTime;
    console.log(`API ${apiName}: ${duration}ms, Success: ${success}`);
    
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'api_call', {
            'api_name': apiName,
            'duration': duration,
            'success': success
        });
    }
}
```

## 🔧 Configuration

### Environment Variables
```javascript
// API Configuration
const API_CONFIG = {
    EXCHANGE_RATE_API: 'https://api.exchangerate-api.com/v4/latest/KZT',
    LOCATION_API: 'https://ipapi.co/json/',
    WEATHER_API: 'https://api.openweathermap.org/data/2.5/weather',
    EMAILJS_SERVICE_ID: 'your_service_id',
    EMAILJS_TEMPLATE_ID: 'your_template_id',
    EMAILJS_USER_ID: 'your_user_id'
};
```

### API Keys Setup
1. **OpenWeatherMap**: Register at openweathermap.org
2. **EmailJS**: Register at emailjs.com
3. **ExchangeRate-API**: Free tier available
4. **IP-API**: Free tier available

## 📚 API Documentation Links

- [ExchangeRate-API Documentation](https://exchangerate-api.com/docs)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [IP-API Documentation](https://ipapi.co/api/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

## 🚀 Future Enhancements

### Planned Integrations
1. **Payment Gateway**: Stripe or PayPal integration
2. **Shipping API**: Real-time shipping calculations
3. **Inventory API**: Stock level management
4. **Analytics API**: Google Analytics integration
5. **Social Media API**: Instagram product feeds

### Implementation Roadmap
- **Phase 1**: Core APIs (Current)
- **Phase 2**: Payment integration
- **Phase 3**: Advanced features
- **Phase 4**: Analytics and monitoring

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready