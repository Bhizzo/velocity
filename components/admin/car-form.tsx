'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/admin/image-upload'
import { 
  MALAWI_DISTRICTS, 
  CAR_MAKES, 
  TRANSMISSION_OPTIONS, 
  FUEL_TYPE_OPTIONS,
  CAR_STATUS_OPTIONS,
  addOneMonth 
} from '@/lib/constants'
import { Loader2, Save, X } from 'lucide-react'

// Define the form data type explicitly
interface CarFormData {
  make: string
  model: string
  year: number
  price: number
  mileage?: number
  color?: string
  transmission: 'MANUAL' | 'AUTOMATIC' | 'CVT'
  fuelType: 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC'
  description?: string
  district: string
  featured: boolean
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'DRAFT'
  sellerId: string
  images: Array<{
    url: string
    key: string
    isPrimary: boolean
  }>
}

// Create a validation schema that matches the form data type
const carFormSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number()
    .min(1, 'Price must be greater than 0'),
  mileage: z.number().optional(),
  color: z.string().optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'CVT']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  description: z.string().optional(),
  district: z.string().min(1, 'District is required'),
  featured: z.boolean(),
  status: z.enum(['ACTIVE', 'SOLD', 'EXPIRED', 'DRAFT']),
  sellerId: z.string().min(1, 'Seller is required'),
  images: z.array(z.object({
    url: z.string(),
    key: z.string(),
    isPrimary: z.boolean()
  })).min(1, 'At least one image is required')
}) satisfies z.ZodType<CarFormData>

interface CarFormProps {
  car?: {
    id: string
    make: string
    model: string
    year: number
    price: number
    mileage?: number | null
    color?: string | null
    transmission: string
    fuelType: string
    description?: string | null
    district: string
    featured: boolean
    status: string
    sellerId: string
    images: Array<{
      url: string
      key: string
      isPrimary: boolean
    }>
  }
  sellers: Array<{
    id: string
    name: string
  }>
}

export function CarForm({ car, sellers }: CarFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: car?.make || '',
      model: car?.model || '',
      year: car?.year || new Date().getFullYear(),
      price: car?.price || 0,
      mileage: car?.mileage || undefined,
      color: car?.color || '',
      transmission: (car?.transmission as CarFormData['transmission']) || 'MANUAL',
      fuelType: (car?.fuelType as CarFormData['fuelType']) || 'PETROL',
      description: car?.description || '',
      district: car?.district || 'Blantyre',
      featured: car?.featured || false,
      status: (car?.status as CarFormData['status']) || 'ACTIVE',
      sellerId: car?.sellerId || '',
      images: car?.images || []
    }
  })

  const onSubmit = async (data: CarFormData) => {
    setIsSubmitting(true)
    try {
      const url = car ? `/api/cars/${car.id}` : '/api/admin/cars'
      const method = car ? 'PUT' : 'POST'
      
      // Add expiration date if creating new car
      const submitData = car ? data : {
        ...data,
        expiresAt: addOneMonth().toISOString()
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error('Failed to save car')
      }

      const result = await response.json()

      toast({
        title: car ? 'Car updated' : 'Car created',
        description: `${data.make} ${data.model} has been ${car ? 'updated' : 'created'} successfully.`,
      })

      router.push(`/admin/cars/${result.car.id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save car. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{car ? 'Edit Car' : 'Add New Car'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAR_MAKES.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter year"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === '' ? 0 : parseInt(value, 10))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (MWK)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter price"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === '' ? 0 : parseFloat(value))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter mileage"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === '' ? undefined : parseInt(value, 10))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter color" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRANSMISSION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FUEL_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MALAWI_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seller</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select seller" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sellers.map((seller) => (
                            <SelectItem key={seller.id} value={seller.id}>
                              {seller.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter car description..." 
                        className="resize-none" 
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about the car's condition, features, and any other relevant details.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAR_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Car</FormLabel>
                        <FormDescription>
                          Featured cars appear prominently on the homepage
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Images</h3>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxFiles={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload high-quality images of the car. The first image will be used as the primary image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {car ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {car ? 'Update Car' : 'Create Car'}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}