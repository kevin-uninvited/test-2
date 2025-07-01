import { createClient } from '@sanity/client'

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

export interface ChatQuestion {
    _id: string
    _type: string
    name: string
    category: string
    _createdAt: string
    _updatedAt: string
} 