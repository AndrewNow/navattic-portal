import { payload } from '@/lib/payloadClient'
import PageHeader from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import PageTitle from '@/components/ui/PageTitle'
import GuideContent from '@/components/ui/GuideContent'

const GuideAndRules = async () => {
  const guide = await payload.findGlobal({
    slug: 'guide',
  })

  console.log(guide)

  return (
    <>
      <PageHeader title="Rules & Guide" />
      <div className="bg-gray-50 min-h-screen">
        <Container className="pt-10">
          <div className="content-container">{guide && <GuideContent guide={guide} />}</div>
        </Container>
      </div>
    </>
  )
}

export default GuideAndRules
