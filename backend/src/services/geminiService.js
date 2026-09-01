import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';

let aiClient = null;

function getAIClient() {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAIPlanTrip(input) {
  const client = getAIClient();
  const dest = input.destination || 'Bali, Indonesia';
  const travelers = input.travelers || '2 Travelers';
  const tripType = input.tripType || 'Relaxation & Adventure';
  const startDate = input.startDate || 'May 25, 2025';
  const endDate = input.endDate || 'May 31, 2025';

  if (!client) {
    return generateFallbackItinerary(input);
  }

  const prompt = `You are a world-class luxury travel planner and local concierge.
Create a comprehensive, highly realistic, tailored multi-day travel itinerary for:
Destination: ${dest}
Dates: ${startDate} to ${endDate}
Travelers: ${travelers}
Trip Type: ${tripType}
Budget Preference: ${input.budgetLevel || 'Moderate'}
Interests: ${input.interests ? input.interests.join(', ') : 'Must-see landmarks, local culinary gems, scenic nature, cultural sights'}

Generate a structured JSON response with:
- title: Trip title (e.g. "Bali Getaway: Tropical Bliss & Temples")
- destination: Destination city/country
- country: Country name
- totalEstimatedCost: Total cost in USD (integer)
- summary: Short 2-sentence captivating description
- bestTimeToVisit: Short recommendation
- weatherAdvice: Brief weather tip
- budgetBreakdown: { flights: number, hotels: number, activities: number, food: number, transport: number }
- days: An array of 4 to 7 days, where each day has:
  - dayNumber: integer (1, 2, 3...)
  - title: "Day 1", "Day 2", etc.
  - subtitle: e.g. "Arrival & Coastal Sunset"
  - thumbnail: A relevant Unsplash image URL or keyword
  - activities: Array of 2-3 activities (timeSlot: "Morning" | "Afternoon" | "Evening", time: string, title: string, description: string, location: string, duration: string, cost: number, category: "sightseeing" | "culture" | "food" | "adventure" | "relaxation" | "transport")
- travelTips: Array of 3 specific insider travel tips (title: string, description: string)
- recommendedHotels: Array of 2 luxury/boutique hotels (name: string, pricePerNight: number, rating: number)
`;

  try {
    const response = await client.models.generateContent({
      model: process.env.AI_MODEL || 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            destination: { type: Type.STRING },
            country: { type: Type.STRING },
            totalEstimatedCost: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            bestTimeToVisit: { type: Type.STRING },
            weatherAdvice: { type: Type.STRING },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                flights: { type: Type.NUMBER },
                hotels: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                transport: { type: Type.NUMBER },
              },
              required: ['flights', 'hotels', 'activities', 'food', 'transport'],
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeSlot: { type: Type.STRING },
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        location: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        cost: { type: Type.NUMBER },
                        category: { type: Type.STRING },
                      },
                      required: ['timeSlot', 'time', 'title', 'description', 'location', 'duration', 'cost', 'category'],
                    },
                  },
                },
                required: ['dayNumber', 'title', 'subtitle', 'activities'],
              },
            },
            travelTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title', 'description'],
              },
            },
            recommendedHotels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  pricePerNight: { type: Type.NUMBER },
                  rating: { type: Type.NUMBER },
                },
                required: ['name', 'pricePerNight', 'rating'],
              },
            },
          },
          required: ['title', 'destination', 'country', 'totalEstimatedCost', 'summary', 'budgetBreakdown', 'days'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return generateFallbackItinerary(input);
  }
}

export async function askAITravelAssistant(userMessage, context) {
  const client = getAIClient();
  if (!client) {
    return generateFallbackChatResponse(userMessage, context);
  }

  const prompt = `You are the TripPlanner AI Smart Travel Assistant, a friendly, ultra-knowledgeable personal travel guide and concierge.
The user is asking: "${userMessage}"

Current Trip Context:
Destination: ${context?.destination || 'Bali, Indonesia'}
Dates: ${context?.dates || 'May 25 – May 31, 2025'}
Travelers: ${context?.travelers || '2 Travelers'}
Budget: ${context?.budget || '$1,149'}

Provide a helpful, beautifully structured, engaging response with actionable travel recommendations, budget saving tips, local secrets, and bullet points where helpful. Keep it warm, concise, and professional.`;

  try {
    const response = await client.models.generateContent({
      model: process.env.AI_MODEL || 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the AI Travel Assistant for TripPlanner AI ('Smart. Personal. Memorable.'). Respond warmly with practical travel tips, estimated prices, and local advice.",
      },
    });

    return {
      text: response.text || "I'd be thrilled to help you explore that! What specific dates or activities do you have in mind?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.error('Gemini Chat Error:', err);
    return generateFallbackChatResponse(userMessage, context);
  }
}

function generateFallbackItinerary(input) {
  const destination = input.destination || 'Bali, Indonesia';
  const isJapan = destination.toLowerCase().includes('japan') || destination.toLowerCase().includes('kyoto') || destination.toLowerCase().includes('tokyo');

  if (isJapan) {
    return {
      title: 'Kyoto & Tokyo Cultural Odyssey',
      destination: 'Kyoto & Tokyo, Japan',
      country: 'Japan',
      totalEstimatedCost: 1249,
      summary: 'Immerse in ancient shrines, matcha tea houses, serene bamboo forests, and vibrant neon districts.',
      bestTimeToVisit: 'March to May for Cherry Blossoms or October to November for autumn foliage.',
      weatherAdvice: 'Mild temperatures (18°C-22°C). Carry comfortable walking shoes and a light jacket.',
      budgetBreakdown: { flights: 480, hotels: 380, activities: 190, food: 140, transport: 59 },
      days: [
        {
          dayNumber: 1,
          title: 'Day 1',
          subtitle: 'Arrival & Historic Gion Exploration',
          activities: [
            { timeSlot: 'Morning', time: '10:30 AM', title: 'Arrive at Kansai / Haneda & Shinkansen to Kyoto', description: 'Express train ride into historic Kyoto with luggage drop.', location: 'Kyoto Station', duration: '2 hrs', cost: 35, category: 'transport' },
            { timeSlot: 'Afternoon', time: '02:30 PM', title: 'Gion District & Yasaka Pagoda Walking Tour', description: 'Stroll along preserved wooden machiya houses and spot geiko traditions.', location: 'Gion Quarter', duration: '3 hrs', cost: 15, category: 'culture' },
            { timeSlot: 'Evening', time: '07:00 PM', title: 'Authentic Ramen & Matcha Parfait Tasting', description: 'Savor handmade tonkotsu ramen and Uji green tea desserts.', location: 'Pontocho Alley', duration: '2 hrs', cost: 28, category: 'food' }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2',
          subtitle: 'Torii Gates & Arashiyama Bamboo Grove',
          activities: [
            { timeSlot: 'Morning', time: '07:30 AM', title: 'Fushimi Inari Taisha 10,000 Vermilion Gates', description: 'Early morning hike through the mountain shrine trails before crowds arrive.', location: 'Fushimi Inari', duration: '3 hrs', cost: 0, category: 'sightseeing' },
            { timeSlot: 'Afternoon', time: '01:30 PM', title: 'Arashiyama Bamboo Forest & Tenryu-ji Temple', description: 'Soaring green stalks and UNESCO world heritage zen landscape garden.', location: 'Arashiyama', duration: '3.5 hrs', cost: 18, category: 'culture' },
            { timeSlot: 'Evening', time: '06:30 PM', title: 'Traditional Kaiseki Multi-Course Dinner', description: 'Seasonal culinary artistry prepared with local Kyoto ingredients.', location: 'Central Kyoto', duration: '2.5 hrs', cost: 65, category: 'food' }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3',
          subtitle: 'Golden Pavilion & Zen Rock Gardens',
          activities: [
            { timeSlot: 'Morning', time: '09:00 AM', title: 'Kinkaku-ji (The Golden Pavilion)', description: 'Marvel at the top two floors gilded in pure gold leaf reflecting across the mirror pond.', location: 'Kita Ward', duration: '2 hrs', cost: 10, category: 'sightseeing' },
            { timeSlot: 'Afternoon', time: '02:00 PM', title: 'Ryoan-ji Temple & Traditional Tea Ceremony', description: 'Meditate beside the famed 15-rock dry landscape garden with matcha ceremony.', location: 'Ryoanji', duration: '2.5 hrs', cost: 25, category: 'culture' },
            { timeSlot: 'Evening', time: '07:00 PM', title: 'Nishiki Market Street Food Safari', description: 'Taste takoyaki, wagyu skewers, and sweet dango at the Kitchen of Kyoto.', location: 'Nishiki Market', duration: '2 hrs', cost: 30, category: 'food' }
          ]
        }
      ],
      travelTips: [
        { title: 'Buy an IC Card (Suica/Pasmo)', description: 'Tap to pay instantly across all subways, buses, and 7-Eleven stores.' },
        { title: 'Visit Fushimi Inari at Sunrise', description: 'Arrive by 7:00 AM to enjoy the mystical vermilion gates without tour groups.' },
        { title: 'Tax-Free Shopping', description: 'Always carry your passport to claim 10% consumption tax refund in department stores.' }
      ],
      recommendedHotels: [
        { name: 'Hoshinoya Kyoto Ryokan', pricePerNight: 380, rating: 4.9 },
        { name: 'The Thousand Kyoto', pricePerNight: 220, rating: 4.8 }
      ]
    };
  }

  // Default Bali plan
  return {
    title: 'Bali Tropical Paradise: Sunsets, Waterfalls & Temples',
    destination: 'Bali, Indonesia',
    country: 'Indonesia',
    totalEstimatedCost: 1149,
    summary: 'A dreamy tropical journey blending lush volcanic valleys, coastal beach clubs, secret waterfalls, and sacred cliffside temples.',
    bestTimeToVisit: 'April to October offers dry sunny weather, cool sea breezes, and prime surfing conditions.',
    weatherAdvice: 'Warm and tropical (28°C-31°C). Bring lightweight breathable clothes, SPF50, and swimwear.',
    budgetBreakdown: { flights: 450, hotels: 350, activities: 200, food: 100, transport: 49 },
    days: [
      {
        dayNumber: 1,
        title: 'Day 1',
        subtitle: 'Arrival & Beach Relaxation',
        activities: [
          { timeSlot: 'Morning', time: '10:00 AM', title: 'Arrive at Ngurah Rai International Airport', description: 'Meet private driver, receive fresh frangipani leis, transfer to Seminyak.', location: 'Denpasar / Seminyak', duration: '1.5 hrs', cost: 25, category: 'transport' },
          { timeSlot: 'Afternoon', time: '02:00 PM', title: 'Seminyak Beachfront Stroll & Coconut Drink', description: 'Unwind on golden sands with fresh chilled young coconut water.', location: 'Seminyak Beach', duration: '3 hrs', cost: 5, category: 'relaxation' },
          { timeSlot: 'Evening', time: '06:30 PM', title: 'Jimbaran Bay Candlelit Seafood Sunset Dinner', description: 'Fresh grilled red snapper and jumbo prawns with toes in the sand.', location: 'Jimbaran Beach', duration: '2.5 hrs', cost: 45, category: 'food' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Day 2',
        subtitle: 'Ubud Culture & Temples',
        activities: [
          { timeSlot: 'Morning', time: '08:30 AM', title: 'Tegalalang Rice Terraces & Jungle Swing', description: 'Fly over palm canopies and walk ancient UNESCO subak irrigation trails.', location: 'Tegalalang, Ubud', duration: '3 hrs', cost: 30, category: 'sightseeing' },
          { timeSlot: 'Afternoon', time: '01:00 PM', title: 'Sacred Monkey Forest Sanctuary', description: 'Explore moss-covered jungle ruins home to playful Macaque monkeys.', location: 'Ubud Sanctuary', duration: '2 hrs', cost: 15, category: 'culture' },
          { timeSlot: 'Evening', time: '07:00 PM', title: 'Ubud Royal Palace Cultural Kecak Dance', description: 'Dramatic fire dance performance accompanied by 50 chanting vocalists.', location: 'Ubud Palace', duration: '2 hrs', cost: 20, category: 'culture' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Day 3',
        subtitle: 'Nusa Penida Adventure',
        activities: [
          { timeSlot: 'Morning', time: '07:00 AM', title: 'Fast Boat to Nusa Penida & Kelingking T-Rex Cliff', description: 'Breathtaking panoramic view over turquoise waves and white sands.', location: 'Nusa Penida', duration: '4 hrs', cost: 55, category: 'adventure' },
          { timeSlot: 'Afternoon', time: '01:30 PM', title: 'Angel Billabong & Broken Beach Lagoon', description: 'Natural volcanic rock infinity pool and arched sea cave.', location: 'West Nusa Penida', duration: '3 hrs', cost: 10, category: 'sightseeing' }
        ]
      }
    ],
    travelTips: [
      { title: 'Best time to visit Bali is Apr to Oct', description: 'Perfect weather & fewer crowds with sunny days.' },
      { title: 'Book flights 30 days in advance', description: 'You can save up to 20% on regional airfares.' },
      { title: 'Try local food', description: 'Don’t miss authentic Nasi Goreng & Babi Guling.' }
    ],
    recommendedHotels: [
      { name: 'Viceroy Bali Resort Ubud', pricePerNight: 280, rating: 4.9 },
      { name: 'Ayana Resort & Spa Jimbaran', pricePerNight: 210, rating: 4.8 }
    ]
  };
}

function generateFallbackChatResponse(message, context) {
  const lower = (message || '').toLowerCase();

  if (lower.includes('best time') || lower.includes('weather') || lower.includes('when')) {
    return {
      text: `☀️ **Best Time to Visit ${context?.destination || 'Bali'}:**\n\nThe dry season between **April and October** is ideal. You'll experience:\n- Warm sunny days (avg 28°C / 82°F)\n- Low humidity and refreshing evening sea breezes\n- Ideal surf and crystal-clear scuba diving visibility\n\n*Pro Tip:* May and September are 'sweet-spot' shoulder months with lower hotel rates and fewer tourists!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  if (lower.includes('hotel') || lower.includes('cheap') || lower.includes('stay') || lower.includes('resort')) {
    return {
      text: `🏨 **Top Recommended Accommodations in ${context?.destination || 'Bali'}:**\n\n1. **Viceroy Bali (Ubud)** – ⭐ 4.9/5\n   - Luxury infinity pool villas overlooking Petanu River valley (~$280/night)\n2. **Ayana Resort (Jimbaran)** – ⭐ 4.8/5\n   - World-famous Rock Bar & private beach (~$210/night)\n3. **Canggu Eco Boutique Villa** – ⭐ 4.7/5\n   - Affordable stylish surf villa with organic breakfast (~$85/night)\n\nWould you like me to add one of these directly to your Bookings tab?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  if (lower.includes('pack') || lower.includes('luggage') || lower.includes('wear')) {
    return {
      text: `🎒 **Essential Packing Checklist for ${context?.destination || 'your trip'}:**\n\n- **Clothing:** Breathable linen shirts, lightweight shorts, swimwear, and a light wrap/sarong (required for temple entries)\n- **Sun & Skin:** Coral-safe Reef SPF 50 sunscreen, mosquito repellent, aloe vera\n- **Tech & Gear:** Universal power adapter (Type C/F), waterproof dry-bag for Nusa Penida boat rides, power bank\n- **Health:** Hydration electrolyte packs and activated charcoal pills.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  return {
    text: `✨ **TripPlanner AI Assistance:**\n\nI can help you customize any part of your **${context?.destination || 'Bali'}** trip! Here are some things I can do for you right now:\n\n- 🔄 **Regenerate any day** to focus on wellness, culinary, or high-octane adventure\n- 💰 **Calculate budget breakdowns** for flights, resorts, and day-tours\n- 🗺️ **Find hidden gems** away from tourist crowds\n- 🎫 **Add verified activities** directly into your saved itinerary\n\nWhat would you like to explore next?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export default {
  generateAIPlanTrip,
  askAITravelAssistant,
};
