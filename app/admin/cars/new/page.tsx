import { CarForm } from '@/components/admin/car-form'
import { prisma } from '@/lib/prisma'

async function getSellers() {
  return await prisma.seller.findMany({
    orderBy: { name: 'asc' }
  })
}

export default async function NewCarPage() {
  const sellers = await getSellers()

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
        <p className="text-muted-foreground">
          Create a new car listing for the marketplace
        </p>
      </div>
      
      <CarForm sellers={sellers} />
    </div>
  )
}