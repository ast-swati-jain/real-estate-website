import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Lead from '../models/Lead.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/real_estate_crm';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clean existing records
    await User.deleteMany();
    await Property.deleteMany();
    await Lead.deleteMany();
    console.log('[Seed] Cleared existing data');

    // 1. Create Default Admin and Agent Users
    const adminUser = await User.create({
      name: 'Alexander Wright',
      email: 'admin@estatepro.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });

    const agentUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@estatepro.com',
      password: 'password123',
      role: 'agent',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    });

    const agentUser2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.vance@estatepro.com',
      password: 'password123',
      role: 'agent',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    });

    console.log('[Seed] Created users: admin@estatepro.com & agents');

    // 2. Create Realistic Properties
    const propertiesData = [
      {
        title: 'The Skyline Glass Penthouse',
        description: 'Spectacular full-floor luxury penthouse perched above Manhattan with 360-degree skyline views. Features private elevator entry, soaring 14-foot ceilings, imported Italian Calacatta marble, and an expansive wraparound rooftop terrace.',
        price: 4850000,
        propertyType: 'Penthouse',
        status: 'For Sale',
        location: {
          address: '432 Park Avenue, Floor 72',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          coordinates: { lat: 40.7615, lng: -73.9712 }
        },
        specifications: {
          bedrooms: 4,
          bathrooms: 4.5,
          areaSqFt: 4850,
          parkingSpaces: 2,
          yearBuilt: 2023
        },
        featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Private Elevator', 'Rooftop Terrace', 'Concierge Service', 'Infinity Spa', 'Wine Cellar', 'Smart Automation', 'Valet Parking'],
        featured: true,
        isAvailable: true,
        viewsCount: 342,
        agent: adminUser._id
      },
      {
        title: 'Beverly Hills Modern Coastal Villa',
        description: 'Architectural masterpiece located in prime Beverly Hills. Seamless indoor-outdoor California living with zero-edge infinity pool, outdoor kitchen pavilion, home cinema, and state-of-the-art wellness gym.',
        price: 7250000,
        propertyType: 'Villa',
        status: 'For Sale',
        location: {
          address: '1044 Coldwater Canyon Dr',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          coordinates: { lat: 34.0886, lng: -118.4065 }
        },
        specifications: {
          bedrooms: 6,
          bathrooms: 7,
          areaSqFt: 7800,
          parkingSpaces: 4,
          yearBuilt: 2024
        },
        featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Zero-edge Pool', 'Home Theater', 'Sauna & Steam Room', 'Wine Cellar', 'Chef Kitchen', 'Lush Gardens', 'Solar Energy'],
        featured: true,
        isAvailable: true,
        viewsCount: 520,
        agent: agentUser._id
      },
      {
        title: 'Biscayne Bay Waterfront Residence',
        description: 'Prime Miami waterfront estate with private yacht dock and deep water canal access. Floor-to-ceiling glass reveals breathtaking sunsets across Biscayne Bay. Designer furnished by Artefacto.',
        price: 5400000,
        propertyType: 'Villa',
        status: 'For Sale',
        location: {
          address: '382 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33139',
          coordinates: { lat: 25.7781, lng: -80.1313 }
        },
        specifications: {
          bedrooms: 5,
          bathrooms: 5.5,
          areaSqFt: 5600,
          parkingSpaces: 3,
          yearBuilt: 2022
        },
        featuredImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Private Boat Slip', 'Heated Pool', 'Outdoor Bar', 'Security Gate', 'Dock', 'Smart Home'],
        featured: true,
        isAvailable: true,
        viewsCount: 410,
        agent: agentUser2._id
      },
      {
        title: 'Pacific Heights Victorian Elegance',
        description: 'San Francisco grand Victorian residence masterfully renovated with contemporary Scandinavian minimalism. South-facing sunlit backyard, custom bespoke cabinetry, and wine tasting lounge.',
        price: 3650000,
        propertyType: 'Townhouse',
        status: 'For Sale',
        location: {
          address: '2450 Vallejo Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94123',
          coordinates: { lat: 37.7946, lng: -122.4382 }
        },
        specifications: {
          bedrooms: 4,
          bathrooms: 3.5,
          areaSqFt: 3900,
          parkingSpaces: 2,
          yearBuilt: 2021
        },
        featuredImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Courtyard Garden', 'Fireplace', 'Heated Floors', 'Tesla Charger', 'Wine Room'],
        featured: false,
        isAvailable: true,
        viewsCount: 189,
        agent: agentUser._id
      },
      {
        title: 'Downtown Austin Tech-Loft Suite',
        description: 'Sun-drenched corner loft overlooking Lady Bird Lake. Industrial-chic concrete accents, double-height ceilings, automated motorized shades, and high-efficiency smart climate controls.',
        price: 890000,
        propertyType: 'Apartment',
        status: 'For Sale',
        location: {
          address: '300 Colorado St, Unit 1904',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          coordinates: { lat: 30.2672, lng: -97.7431 }
        },
        specifications: {
          bedrooms: 2,
          bathrooms: 2,
          areaSqFt: 1450,
          parkingSpaces: 1,
          yearBuilt: 2022
        },
        featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Skyline Pool', 'Coworking Lounge', 'Dog Run & Spa', 'Gym', 'EV Stations'],
        featured: true,
        isAvailable: true,
        viewsCount: 295,
        agent: agentUser._id
      },
      {
        title: 'The Financial Center Prime Office Suite',
        description: 'Class-A commercial corporate headquarters floor in Chicago Loop. Fully fitted with executive boardrooms, open collaborative bullpen, fiber optic backbone, and private client lounge.',
        price: 2150000,
        propertyType: 'Commercial',
        status: 'For Sale',
        location: {
          address: '181 W Madison St, Suite 3400',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60602',
          coordinates: { lat: 41.8819, lng: -87.6338 }
        },
        specifications: {
          bedrooms: 0,
          bathrooms: 4,
          areaSqFt: 6200,
          parkingSpaces: 8,
          yearBuilt: 2020
        },
        featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Fiber Internet', 'Conference Rooms', 'Security Badging', 'Cafeteria', 'Onsite Management'],
        featured: false,
        isAvailable: true,
        viewsCount: 140,
        agent: adminUser._id
      },
      {
        title: 'Modern Minimalist Venice Beach Studio',
        description: 'Chic designer studio just two blocks from Abbot Kinney and Venice Boardwalk. Polished concrete floors, stainless steel appliances, oversized glass balcony, and turnkey furnished.',
        price: 495000,
        propertyType: 'Studio',
        status: 'For Sale',
        location: {
          address: '612 Venice Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90291',
          coordinates: { lat: 33.9912, lng: -118.4687 }
        },
        specifications: {
          bedrooms: 1,
          bathrooms: 1,
          areaSqFt: 620,
          parkingSpaces: 1,
          yearBuilt: 2023
        },
        featuredImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Balcony', 'Bike Storage', 'Keyless Entry', 'In-unit Laundry'],
        featured: false,
        isAvailable: true,
        viewsCount: 210,
        agent: agentUser2._id
      },
      {
        title: 'SoHo Cast-Iron Luxury Loft',
        description: 'Classic SoHo loft boasting original Corinthian cast-iron columns, timber beam ceilings, oversized picture windows, and private key-in elevator. Unmatched bohemian prestige.',
        price: 3400000,
        propertyType: 'Apartment',
        status: 'For Sale',
        location: {
          address: '112 Prince Street, 4th Floor',
          city: 'New York',
          state: 'NY',
          zipCode: '10012',
          coordinates: { lat: 40.7252, lng: -74.0003 }
        },
        specifications: {
          bedrooms: 3,
          bathrooms: 2.5,
          areaSqFt: 3100,
          parkingSpaces: 1,
          yearBuilt: 2020
        },
        featuredImage: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Historic Facade', 'High Ceilings', 'Custom Walk-in Closet', 'Wine Cooler'],
        featured: true,
        isAvailable: true,
        viewsCount: 388,
        agent: adminUser._id
      },
      {
        title: 'Coral Gables Mediterranean Estate',
        description: 'Timeless Mediterranean sanctuary nestled among century-old banyans in Coral Gables. Barrel tile roofing, grand circular driveway, resort pool with waterfall, and private guest casita.',
        price: 4200000,
        propertyType: 'Villa',
        status: 'For Sale',
        location: {
          address: '1420 Granada Blvd',
          city: 'Miami',
          state: 'FL',
          zipCode: '33134',
          coordinates: { lat: 25.7289, lng: -80.2785 }
        },
        specifications: {
          bedrooms: 5,
          bathrooms: 6,
          areaSqFt: 6100,
          parkingSpaces: 3,
          yearBuilt: 2021
        },
        featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Resort Pool', 'Guest Casita', 'Summer Kitchen', 'Courtyard Fountain', 'Impact Windows'],
        featured: false,
        isAvailable: true,
        viewsCount: 175,
        agent: agentUser2._id
      },
      {
        title: 'Lincoln Park Historic Brownstone',
        description: 'Meticulously restored multi-level brownstone steps from Lincoln Park and Lake Michigan. Custom wrought-iron accents, chef kitchen with Sub-Zero appliances, and private rooftop deck.',
        price: 2650000,
        propertyType: 'Townhouse',
        status: 'For Sale',
        location: {
          address: '2214 N Cleveland Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60614',
          coordinates: { lat: 41.9221, lng: -87.6475 }
        },
        specifications: {
          bedrooms: 4,
          bathrooms: 3.5,
          areaSqFt: 3600,
          parkingSpaces: 2,
          yearBuilt: 2022
        },
        featuredImage: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: ['Rooftop Deck', 'Brick Wine Cellar', 'Radiant Heat', 'Private Garage'],
        featured: false,
        isAvailable: true,
        viewsCount: 162,
        agent: agentUser._id
      }
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`[Seed] Created ${createdProperties.length} realistic properties`);

    // 3. Create Sample Leads across CRM Stages
    const leadsData = [
      {
        name: 'Jonathan Sterling',
        email: 'j.sterling@sterlingcap.com',
        phone: '+1 (555) 912-3847',
        message: 'Looking for a trophy penthouse in Manhattan for corporate entertainment and residence. Requesting confidential walkthrough.',
        property: createdProperties[0]._id,
        propertyName: createdProperties[0].title,
        propertyPrice: createdProperties[0].price,
        status: 'Negotiation',
        priority: 'Urgent',
        source: 'Website Enquiry',
        preferredContactMethod: 'Phone',
        assignedAgent: adminUser._id,
        conversionValue: 4850000,
        nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        followUps: [
          {
            note: 'Client offered $4.65M cash with 14-day close. Reviewing counteroffer with seller.',
            followUpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            type: 'Meeting',
            status: 'Completed',
            addedByName: 'Alexander Wright'
          },
          {
            note: 'Conducted 2-hour private tour of penthouse and rooftop terrace. Buyer expressed strong enthusiasm.',
            followUpDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            type: 'Site Visit',
            status: 'Completed',
            addedByName: 'Alexander Wright'
          },
          {
            note: 'Initial phone consultation. Verified proof of funds ($10M+). Scheduled walkthrough.',
            followUpDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            type: 'Call',
            status: 'Completed',
            addedByName: 'Alexander Wright'
          }
        ]
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@techbio.io',
        phone: '+1 (555) 438-9201',
        message: 'Relocating biotech company leadership to California. We love the Beverly Hills villa. Need closing before Q3.',
        property: createdProperties[1]._id,
        propertyName: createdProperties[1].title,
        propertyPrice: createdProperties[1].price,
        status: 'Converted',
        priority: 'High',
        source: 'Schedule Tour',
        preferredContactMethod: 'Email',
        assignedAgent: agentUser._id,
        conversionValue: 7100000,
        closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        followUps: [
          {
            note: 'Escrow closed successfully! Key handover completed. Full commission disbursed.',
            followUpDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            type: 'Meeting',
            status: 'Completed',
            addedByName: 'Sarah Jenkins'
          },
          {
            note: 'Signed Purchase & Sale Agreement at $7.1M with wire deposit confirmed.',
            followUpDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            type: 'Email',
            status: 'Completed',
            addedByName: 'Sarah Jenkins'
          }
        ]
      },
      {
        name: 'David & Karen Miller',
        email: 'miller.family@gmail.com',
        phone: '+1 (555) 321-7654',
        message: 'Interested in the Biscayne Bay waterfront residence. Do you have survey reports for the boat slip depth?',
        property: createdProperties[2]._id,
        propertyName: createdProperties[2].title,
        propertyPrice: createdProperties[2].price,
        status: 'Interested',
        priority: 'High',
        source: 'Website Enquiry',
        preferredContactMethod: 'WhatsApp',
        assignedAgent: agentUser2._id,
        nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        followUps: [
          {
            note: 'Emailed recent hydrographic survey confirming 8-foot low tide draft. Client very satisfied.',
            followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: 'Email',
            status: 'Completed',
            addedByName: 'Marcus Vance'
          },
          {
            note: 'Spoke over WhatsApp. Scheduled family site visit for upcoming Saturday 11 AM.',
            followUpDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            type: 'Call',
            status: 'Completed',
            addedByName: 'Marcus Vance'
          }
        ]
      },
      {
        name: 'Christopher Nolan',
        email: 'c.nolan@cinearts.com',
        phone: '+1 (555) 876-5432',
        message: 'Looking for Austin downtown apartment for secondary production hub.',
        property: createdProperties[4]._id,
        propertyName: createdProperties[4].title,
        propertyPrice: createdProperties[4].price,
        status: 'Contacted',
        priority: 'Medium',
        source: 'Website Enquiry',
        preferredContactMethod: 'Email',
        assignedAgent: agentUser._id,
        nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        followUps: [
          {
            note: 'Sent digital brochure and video walkthrough of Unit 1904.',
            followUpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            type: 'Email',
            status: 'Completed',
            addedByName: 'Sarah Jenkins'
          }
        ]
      },
      {
        name: 'Victoria Hawthorne',
        email: 'victoria.h@luxegroup.co',
        phone: '+1 (555) 789-0123',
        message: 'Looking to acquire SoHo Cast-Iron Loft as an art collector residence. Is the seller open to partial trade?',
        property: createdProperties[7]._id,
        propertyName: createdProperties[7].title,
        propertyPrice: createdProperties[7].price,
        status: 'New',
        priority: 'High',
        source: 'Website Enquiry',
        preferredContactMethod: 'Phone',
        followUps: [
          {
            note: 'New web inquiry submitted. Needs immediate outreach.',
            followUpDate: new Date(),
            type: 'Note',
            status: 'Completed',
            addedByName: 'Website System'
          }
        ]
      },
      {
        name: 'Marcus & Chloe Dupont',
        email: 'dupont.m@globalventures.fr',
        phone: '+1 (555) 654-3210',
        message: 'Inquiring about Venice Beach studio for investment rental yield.',
        property: createdProperties[6]._id,
        propertyName: createdProperties[6].title,
        propertyPrice: createdProperties[6].price,
        status: 'New',
        priority: 'Low',
        source: 'Website Enquiry',
        preferredContactMethod: 'Email',
        followUps: [
          {
            note: 'Enquiry received. Automated confirmation sent.',
            followUpDate: new Date(),
            type: 'Note',
            status: 'Completed',
            addedByName: 'Website System'
          }
        ]
      },
      {
        name: 'Global Financial Partners LLC',
        email: 'acquisitions@gfp-capital.com',
        phone: '+1 (555) 210-9876',
        message: 'Requesting lease vs buy financial model for the Chicago Loop commercial office floor.',
        property: createdProperties[5]._id,
        propertyName: createdProperties[5].title,
        propertyPrice: createdProperties[5].price,
        status: 'Converted',
        priority: 'Urgent',
        source: 'Direct Call',
        preferredContactMethod: 'Email',
        assignedAgent: adminUser._id,
        conversionValue: 2150000,
        closedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        followUps: [
          {
            note: 'Transaction finalized and funded. Title transferred to LLC.',
            followUpDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            type: 'Meeting',
            status: 'Completed',
            addedByName: 'Alexander Wright'
          }
        ]
      },
      {
        name: 'Sophia Patel',
        email: 'spatel@healthlink.org',
        phone: '+1 (555) 123-9988',
        message: 'Is the Lincoln Park Brownstone in the Ogden elementary school district?',
        property: createdProperties[9]._id,
        propertyName: createdProperties[9].title,
        propertyPrice: createdProperties[9].price,
        status: 'Contacted',
        priority: 'Medium',
        source: 'Website Enquiry',
        preferredContactMethod: 'WhatsApp',
        assignedAgent: agentUser._id,
        followUps: [
          {
            note: 'Confirmed school zoning and sent Chicago Public Schools tier documentation.',
            followUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: 'Call',
            status: 'Completed',
            addedByName: 'Sarah Jenkins'
          }
        ]
      }
    ];

    await Lead.insertMany(leadsData);
    console.log(`[Seed] Created ${leadsData.length} leads across sales pipeline`);

    console.log('-------------------------------------------------------');
    console.log(' Database Seeded Successfully!');
    console.log(' Admin Credentials: admin@estatepro.com / password123');
    console.log(' Agent Credentials: sarah.jenkins@estatepro.com / password123');
    console.log('-------------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
