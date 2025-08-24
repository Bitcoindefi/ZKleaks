// API endpoints configuration
export const API_ENDPOINTS = {
  FILECOIN_UPLOAD: "/api/ipfs/upload",
  PREPARE_TX: "/api/midnight/prepare-tx",
  ANALYZE_ADDRESS: "/api/midnight/analyze-address",
} as const

// API response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Generic API call wrapper with error handling
export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// File upload helper
export async function uploadFiles(
  files: FileList,
  metadata: Record<string, string> = {},
): Promise<ApiResponse<{ cid: string }>> {
  const formData = new FormData()

  Array.from(files).forEach((file) => {
    formData.append("files", file, file.name)
  })

  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return apiCall(API_ENDPOINTS.FILECOIN_UPLOAD, {
    method: "POST",
    body: formData,
    headers: {}, // Let browser set Content-Type for FormData
  })
}
