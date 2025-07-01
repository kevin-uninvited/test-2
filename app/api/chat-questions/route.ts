import { NextResponse } from 'next/server'
import { sanityClient, type ChatQuestion } from '../../../lib/sanity'

export async function GET() {
    try {
        console.log('Fetching chat questions from Sanity...')

        // First, get the total count of questions
        const total = await sanityClient.fetch<number>(
            `count(*[_type == "chatWidgetQuestionsType"])`
        )

        console.log(`Total questions found: ${total}`)

        if (total === 0) {
            console.log('No questions found in Sanity, returning empty array')
            return NextResponse.json([])
        }

        // Generate 3 random indices (or less if we have fewer than 3 questions)
        const numberOfQuestions = Math.min(3, total)
        const randomIndices = []
        const usedIndices = new Set<number>()

        while (randomIndices.length < numberOfQuestions) {
            const randomIndex = Math.floor(Math.random() * total)
            if (!usedIndices.has(randomIndex)) {
                randomIndices.push(randomIndex)
                usedIndices.add(randomIndex)
            }
        }

        console.log(`Selected random indices: ${randomIndices}`)

        // Fetch questions at those indices using the pattern from the documentation
        const questions: ChatQuestion[] = []
        for (const index of randomIndices) {
            try {
                const question = await sanityClient.fetch<ChatQuestion>(
                    `*[_type == "chatWidgetQuestionsType"][$index]`,
                    { index }
                )
                if (question) {
                    questions.push(question)
                    console.log(`Fetched question: ${question.name}`)
                }
            } catch (fetchError) {
                console.error(`Error fetching question at index ${index}:`, fetchError)
            }
        }

        console.log(`Successfully fetched ${questions.length} questions`)
        return NextResponse.json(questions)

    } catch (error) {
        console.error('Error fetching questions from Sanity:', error)

        console.log('Returning empty array due to Sanity error')

        return NextResponse.json([])
    }
} 