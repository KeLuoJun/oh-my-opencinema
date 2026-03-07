import type { ModelFallbackInfo } from "../../features/task-toast-manager/types"
import type { DelegateTaskArgs } from "./types"
import type { ExecutorContext } from "./executor-types"
import type { FallbackEntry } from "../../shared/model-requirements"
import { mergeCategories } from "../../shared/merge-categories"
import { resolveCategoryConfig } from "./categories"
import { parseModelString } from "./model-string-parser"
import { CATEGORY_MODEL_REQUIREMENTS } from "../../shared/model-requirements"
import { getAvailableModelsForDelegateTask } from "./available-models"
import { resolveModelForDelegateTask } from "./model-selection"

// For video agent workflow, category determines sub-agent
const CATEGORY_AGENT = "subagent"

export interface CategoryResolutionResult {
  agentToUse: string
  categoryModel: { providerID: string; modelID: string; variant?: string } | undefined
  categoryPromptAppend: string | undefined
  maxPromptTokens?: number
  modelInfo: ModelFallbackInfo | undefined
  actualModel: string | undefined
  isUnstableAgent: boolean
  fallbackChain?: FallbackEntry[]  // For runtime retry on model errors
  error?: string
}

export async function resolveCategoryExecution(
  args: DelegateTaskArgs,
  executorCtx: ExecutorContext,
  inheritedModel: string | undefined,
  systemDefaultModel: string | undefined
): Promise<CategoryResolutionResult> {
  const { client, userCategories, sisyphusJuniorModel } = executorCtx

  const availableModels = await getAvailableModelsForDelegateTask(client)

  const categoryName = args.category!
  const enabledCategories = mergeCategories(userCategories)
  const categoryExists = enabledCategories[categoryName] !== undefined

  const resolved = resolveCategoryConfig(categoryName, {
    userCategories,
    inheritedModel,
    systemDefaultModel,
    availableModels,
  })

  if (!resolved) {
    const requirement = CATEGORY_MODEL_REQUIREMENTS[categoryName]
    const allCategoryNames = Object.keys(enabledCategories).join(", ")

    if (categoryExists && requirement?.requiresModel) {
      return {
        agentToUse: "",
        categoryModel: undefined,
        categoryPromptAppend: undefined,
        maxPromptTokens: undefined,
        modelInfo: undefined,
        actualModel: undefined,
        isUnstableAgent: false,
        error: `Category "${categoryName}" requires model "${requirement.requiresModel}" which is not available.

To use this category:
1. Connect a provider with this model: ${requirement.requiresModel}
2. Or configure an alternative model in your oh-my-opencode.json for this category

Available categories: ${allCategoryNames}`,
      }
    }

    return {
      agentToUse: "",
      categoryModel: undefined,
      categoryPromptAppend: undefined,
      maxPromptTokens: undefined,
      modelInfo: undefined,
      actualModel: undefined,
      isUnstableAgent: false,
      error: `Unknown category: "${categoryName}". Available: ${allCategoryNames}`,
    }
  }

  const requirement = CATEGORY_MODEL_REQUIREMENTS[args.category!]
  let actualModel: string | undefined
  let modelInfo: ModelFallbackInfo | undefined
  let categoryModel: { providerID: string; modelID: string; variant?: string } | undefined

  const overrideModel = sisyphusJuniorModel
  const explicitCategoryModel = userCategories?.[args.category!]?.model

  // inheritedModel is already a string (provider/model format) from tools.ts
  // Use it as fallback if no explicit model is configured
  if (!requirement) {
    // Precedence: explicit category model > agent override > category resolved model > inherited from parent
    // This allows each sub-agent to use its own configured model, or inherit from parent if not configured
    actualModel = explicitCategoryModel ?? overrideModel ?? resolved.model ?? inheritedModel
    if (actualModel) {
      if (explicitCategoryModel || overrideModel) {
        modelInfo = { model: actualModel, type: "user-defined", source: "override" }
      } else if (inheritedModel && actualModel === inheritedModel) {
        modelInfo = { model: actualModel, type: "inherited", source: "parent-agent" }
      } else {
        modelInfo = { model: actualModel, type: "system-default", source: "system-default" }
      }
    }
  } else {
    // Include inheritedModel as fallback if no explicit model is configured
    const userModel = explicitCategoryModel ?? overrideModel ?? inheritedModel
    const resolution = resolveModelForDelegateTask({
      userModel,
      categoryDefaultModel: resolved.model,
      fallbackChain: requirement.fallbackChain,
      availableModels,
      systemDefaultModel,
    })

    if (resolution) {
      const { model: resolvedModel, variant: resolvedVariant } = resolution
      actualModel = resolvedModel

      if (!parseModelString(actualModel)) {
        return {
          agentToUse: "",
          categoryModel: undefined,
          categoryPromptAppend: undefined,
          maxPromptTokens: undefined,
          modelInfo: undefined,
          actualModel: undefined,
          isUnstableAgent: false,
          error: `Invalid model format "${actualModel}". Expected "provider/model" format (e.g., "anthropic/claude-sonnet-4-6").`,
        }
      }

      const type: "user-defined" | "inherited" | "category-default" | "system-default" =
        (explicitCategoryModel || overrideModel)
          ? "user-defined"
          : (inheritedModel && actualModel === inheritedModel)
              ? "inherited"
              : (systemDefaultModel && actualModel === systemDefaultModel)
                  ? "system-default"
                  : "category-default"

      const source: "override" | "category-default" | "system-default" | "parent-agent" =
        type === "user-defined"
          ? "override"
          : type === "inherited"
              ? "parent-agent"
              : type === "system-default"
                  ? "system-default"
                  : "category-default"

      modelInfo = { model: actualModel, type, source }

      const parsedModel = parseModelString(actualModel)
      const variantToUse = userCategories?.[args.category!]?.variant ?? resolvedVariant ?? resolved.config.variant
      categoryModel = parsedModel
        ? (variantToUse ? { ...parsedModel, variant: variantToUse } : parsedModel)
        : undefined
    }
  }

  if (!categoryModel && actualModel) {
    const parsedModel = parseModelString(actualModel)
    categoryModel = parsedModel ?? undefined
  }
  const categoryPromptAppend = resolved.promptAppend || undefined

  if (!categoryModel && !actualModel) {
    const categoryNames = Object.keys(enabledCategories)
    return {
      agentToUse: "",
      categoryModel: undefined,
      categoryPromptAppend: undefined,
      maxPromptTokens: undefined,
      modelInfo: undefined,
      actualModel: undefined,
      isUnstableAgent: false,
      error: `Model not configured for category "${args.category}".

Configure in one of:
1. OpenCode: Set "model" in opencode.json
2. Oh-My-OpenCode: Set category model in oh-my-opencode.json
3. Provider: Connect a provider with available models

Current category: ${args.category}
Available categories: ${categoryNames.join(", ")}`,
    }
  }

  const unstableModel = actualModel?.toLowerCase()
  const categoryConfigModel = resolved.config.model?.toLowerCase()
  const isUnstableAgent = resolved.config.is_unstable_agent === true || [unstableModel, categoryConfigModel].some(m => m ? m.includes("gemini") || m.includes("minimax") || m.includes("kimi") : false)

  return {
    agentToUse: CATEGORY_AGENT,
    categoryModel,
    categoryPromptAppend,
    maxPromptTokens: resolved.config.max_prompt_tokens,
    modelInfo,
    actualModel,
    isUnstableAgent,
    fallbackChain: requirement?.fallbackChain,
  }
}
