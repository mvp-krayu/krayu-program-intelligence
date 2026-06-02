import { useRouter } from 'next/router'
import CopilotPage from '../../../components/copilot/CopilotPage'

export default function CopilotWithBinding() {
  const router = useRouter()
  const { client, run } = router.query

  if (!client || !run) return null

  return <CopilotPage client={client} runId={run} />
}
