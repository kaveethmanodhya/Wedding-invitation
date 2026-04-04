/**
 * Default configuration for a new wedding invitation.
 * This acts as the "schema" for the multi-tenant platform.
 */
export const getDefaultConfig = (slug) => ({
  slug, // Mandatory unique identifier (e.g., "kasun-nimesha")
  couple: {
    bride: { firstName: 'Bride', lastName: '', fullName: '' },
    groom: { firstName: 'Groom', lastName: '', fullName: '' },
    displayNames: 'Groom & Bride',
    tagline: 'Together Forever'
  },
  wedding: {
    dateTimeISO: new Date().toISOString(),
    displayDate: 'December 19, 2026',
    year: '2026'
  },
  story: {
    invitationText: 'Together with their families, we invite you to celebrate our joyful union.',
    paragraphs: [
      'We met in an unexpected way, and it turned into the most beautiful chapter of our lives.',
      'Now, we are excited to start our journey together forever.'
    ]
  },
  events: {
    ceremony: {
      title: 'Wedding Ceremony',
      icon: '🌸',
      time: '10:00 AM',
      venueName: 'Avenue Gardens',
      address: '123 Lotus Lane, Colombo, Sri Lanka',
      mapsUrl: '',
      dressCode: 'Formal'
    }
  },
  gallery: [],
  heroImage: '',
  heroLayout: 1,
  revealStyle: 'envelope',
  theme: {
    colorPrimary: '#C9956A',
    colorSecondary: '#E8D5B7',
    colorTextLight: '#8A7F6A',
    colorTextDark: '#2C2018',
    colorBg: '#FAF7F2',
    colorSurface: '#FFFFFF',
    heroOverlayStart: 'rgba(18, 12, 6, 0.55)',
    heroOverlayEnd: 'rgba(18, 12, 6, 0.25)'
  },
  rsvp: {
    whatsappNumber: '',
    deadline: 'December 1, 2026',
    maxGuests: 2
  },
  envelope: {
    title: 'A Wedding Invitation',
    subtitle: 'Groom & Bride',
    buttonText: 'Open Invitation',
    bgImage: ''
  },
  meta: {
    title: 'Wedding Invitation',
    description: 'Join us as we celebrate our union.',
    ogImage: ''
  }
});
