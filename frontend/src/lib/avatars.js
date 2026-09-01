// Utility for generating deterministic avatars and managing curated traveler avatar presets

// Crisp, high-quality, non-random stylized avatars with clear aesthetic identities
export const AVATAR_PRESETS = [
  {
    id: 'traveler-blue',
    name: 'Coastal Explorer',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    category: 'Modern',
  },
  {
    id: 'traveler-mountain',
    name: 'Alpine Trekker',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    category: 'Adventure',
  },
  {
    id: 'traveler-nomad',
    name: 'Digital Nomad',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    category: 'Modern',
  },
  {
    id: 'traveler-globetrotter',
    name: 'Globetrotter',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'Modern',
  },
  {
    id: 'traveler-backpacker',
    name: 'Wanderer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    category: 'Adventure',
  },
  {
    id: 'traveler-sunset',
    name: 'Sun Chaser',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    category: 'Adventure',
  },
];

/**
 * Generates a clean SVG Data URL for initials with stylish gradient backgrounds
 */
export function generateInitialsAvatar(name, gradient = 'indigo') {
  const cleanName = (name || 'Traveler').trim();
  const parts = cleanName.split(/\s+/);
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  const gradients = {
    indigo: ['#4f46e5', '#7c3aed'],
    emerald: ['#059669', '#10b981'],
    sunset: ['#ea580c', '#f59e0b'],
    rose: ['#e11d48', '#f43f5e'],
    ocean: ['#0284c7', '#06b6d4'],
    violet: ['#7c3aed', '#c026d3'],
  };

  const [c1, c2] = gradients[gradient] || gradients.indigo;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="60" fill="url(#grad)" />
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="44" letter-spacing="-1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Converts an uploaded image file to a base64 Data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WEBP)'));
      return;
    }

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size should be less than 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
}
