import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import Link from 'next/link'
import { Comments } from '@/components/ui/Comments'
import PageHeader from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { formatDate } from '@/utils/formatDate'
import { CalendarIcon, CoinsIcon } from 'lucide-react'
import { Badge, Icon } from '@/components/ui'
import { formatTimeRemaining } from '@/utils/formatTimeRemaining'

const payload = await getPayload({ config })

const ChallengePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  const session = await getServerSession(authOptions)
  const sessionUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: session?.user?.email,
      },
    },
  })

  const challenges = await payload.find({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (challenges.totalDocs === 0) {
    return notFound()
  }

  const challenge = challenges.docs[0]

  const ledger = await payload.find({
    collection: 'ledger',
    where: {
      challenge_id: {
        equals: challenge.id,
      },
    },
  })

  const userChallengeCompletedData = ledger.docs.filter(
    (ledger) => typeof ledger.user_id === 'object' && ledger.user_id?.id === sessionUser.docs[0].id,
  )

  return (
    <>
      <PageHeader />
      <div className="bg-gray-50 min-h-screen">
        <Container className="pt-10">
          <div className="w-full border border-gray-100 bg-gradient-to-b from-white to-[#F6F8F9] rounded-2xl shadow-sm">
            <div className="space-y-4 border-b border-gray-200 p-8 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-medium text-xl">{challenge.title}</h1>
                  <span className="text-sm text-gray-500">
                    Published {formatDate(challenge.createdAt, { abbreviateMonth: true })}
                  </span>
                </div>
                {userChallengeCompletedData.length > 0 ? (
                  <Badge colorScheme="green">
                    <Icon name="award" size="sm" className="mr-1" />
                    Completed
                  </Badge>
                ) : (
                  ''
                )}
              </div>
              <div className="flex flex-wrap gap-5 text-sm">
                <Badge size="md" colorScheme="yellow">
                  <Icon name="coins" size="sm" className="mr-1" />
                  {challenge.points} points
                </Badge>
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Icon name="message-square" className="text-gray-400" />
                  26
                </div>
                <div className="flex items-center justify-center gap-1 text-gray-500">
                  <Icon name="clock" className="text-gray-400" />
                  {formatTimeRemaining(challenge.deadline)}
                </div>
              </div>
            </div>
            <div className="p-8 pt-6 text-base text-gray-600 max-w-prose">
              <RichText data={challenge.content} />
            </div>
          </div>
          <Comments />
        </Container>
      </div>
    </>
  )
}

export default ChallengePage
