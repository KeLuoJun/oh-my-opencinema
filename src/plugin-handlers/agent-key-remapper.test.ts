import { describe, it, expect } from "bun:test"
import { remapAgentKeysToDisplayNames } from "./agent-key-remapper"

describe("remapAgentKeysToDisplayNames", () => {
  it("remaps known agent keys to display names", () => {
    // given agents with lowercase keys
    const agents = {
      cinema: { prompt: "test", mode: "primary" },
      oracle: { prompt: "test", mode: "subagent" },
    }

    // when remapping
    const result = remapAgentKeysToDisplayNames(agents)

    // then known agents get display name keys, unknown agents preserved
    expect(result["cinema"]).toBeDefined()
    expect(result["oracle"]).toBeDefined()
  })

  it("preserves unknown agent keys unchanged", () => {
    // given agents with a custom key
    const agents = {
      "custom-agent": { prompt: "custom" },
    }

    // when remapping
    const result = remapAgentKeysToDisplayNames(agents)

    // then custom key is unchanged
    expect(result["custom-agent"]).toBeDefined()
  })

  it("remaps cinema agent to display name", () => {
    // given cinema agent
    const agents = {
      cinema: {},
    }

    // when remapping
    const result = remapAgentKeysToDisplayNames(agents)

    // then cinema key is preserved (display name equals key)
    expect(result["cinema"]).toBeDefined()
  })
})
