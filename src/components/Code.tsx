import { Pre, RawCode, highlight } from "codehike/code"

export async function MyCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Pre code={highlighted} />
}