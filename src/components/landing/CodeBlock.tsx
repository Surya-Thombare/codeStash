import { Pre, RawCode, highlight } from "codehike/code"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "dracula")
  return <Pre code={highlighted} style={highlighted.style} />
}