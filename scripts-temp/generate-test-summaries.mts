import { generateSummaries } from './summaries.mts'
import { writeFileSync } from 'fs'

async function main() {
  const usernames = ['sofvanh', '	andrepology', 'exgenesis']
  const summaries = await generateSummaries(usernames)
  const timestamp = Date.now()
  const obj: Record<string, string> = {}
  for (const [id, summary] of summaries.entries()) {
    obj[id] = summary
  }
  writeFileSync(`./summaries/${timestamp}.json`, JSON.stringify(obj, null, 2))
}

main()
