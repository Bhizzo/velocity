import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@carmarket.mw' },
    update: {},
    create: {
      email: 'admin@carmarket.mw',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create sample sellers
  const sellers = await Promise.all([
    prisma.seller.upsert({
      where: { email: 'john.banda@email.com' },
      update: {},
      create: {
        name: 'John Banda',
        email: 'john.banda@email.com',
        phone: '+265 991 234 567',
        location: 'Blantyre',
        description: 'Experienced car dealer with over 10 years in the business. Specializes in Japanese imports.'
      }
    }),
    prisma.seller.upsert({
      where: { email: 'mary.phiri@email.com' },
      update: {},
      create: {
        name: 'Mary Phiri',
        email: 'mary.phiri@email.com',
        phone: '+265 999 876 543',
        location: 'Lilongwe',
        description: 'Trusted seller of quality used cars. All vehicles thoroughly inspected before sale.'
      }
    }),
    prisma.seller.upsert({
      where: { email: 'peter.mwale@email.com' },
      update: {},
      create: {
        name: 'Peter Mwale',
        email: 'peter.mwale@email.com',
        phone: '+265 995 123 789',
        location: 'Mzuzu',
        description: 'Family-owned business serving Northern Malawi. Fair prices and honest service.'
      }
    })
  ])

  // Sample car data
  const sampleCars = [
    {
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      price: 12500000,
      mileage: 65000,
      color: 'White',
      transmission: 'MANUAL',
      fuelType: 'PETROL',
      description: 'Well-maintained Toyota Corolla in excellent condition. Recently serviced with new tires. Perfect for city driving.',
      district: 'Blantyre',
      featured: true,
      sellerId: sellers[0].id
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      price: 18750000,
      mileage: 35000,
      color: 'Silver',
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      description: 'Low mileage Honda Civic with automatic transmission. One owner, full service history available.',
      district: 'Lilongwe',
      featured: true,
      sellerId: sellers[1].id
    },
    {
      make: 'BMW',
      model: '320i',
      year: 2021,
      price: 35000000,
      mileage: 15000,
      color: 'Gray',
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      description: 'Luxury sedan with premium features. Nearly new with warranty remaining. Premium package included.',
      district: 'Blantyre',
      featured: true,
      sellerId: sellers[0].id
    }
  ]

  // Create cars
  for (const carData of sampleCars) {
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)

    const car = await prisma.car.create({
      data: {
        ...carData,
        status: 'ACTIVE',
        expiresAt: expirationDate,
        viewCount: Math.floor(Math.random() * 100) + 10,
        likeCount: Math.floor(Math.random() * 20) + 1
      }
    })

    // Add sample images (you'd replace these with actual image URLs)
    await prisma.carImage.createMany({
      data: [
        {
          carId: car.id,
          url: `https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&q=80`,
          key: `sample-${car.id}-1`,
          isPrimary: true
        },
        {
          carId: car.id,
          url: `https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80`,
          key: `sample-${car.id}-2`,
          isPrimary: false
        }
      ]
    })

    console.log(`✅ Created ${carData.make} ${carData.model}`)
  }

  console.log('✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })