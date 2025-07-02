import { NextResponse } from 'next/server'
import { sanityClient } from '../../../lib/sanity'

interface AskAIPageType {
    _id: string
    _type: string
    chatBoxtitle: string
    chatBoxsubTitle: string
    chatBoxDescription: string
    chatBoxInputPlaceholder: string
    title: string
    description: Record<string, unknown>[]
}

export async function GET() {
    try {
        console.log('Fetching Ask AI data from Sanity...')

        const data = await sanityClient.fetch<AskAIPageType>(
            `*[_type == "askAIPageType"][0]`
        )

        if (!data) {
            console.log('No Ask AI data found in Sanity')
            return NextResponse.json({})
        }

        console.log('Successfully fetched Ask AI data')
        return NextResponse.json(data)

    } catch (error) {
        console.error('Error fetching Ask AI data from Sanity:', error)
        return NextResponse.json({})
    }
} 