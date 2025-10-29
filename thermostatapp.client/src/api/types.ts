export interface CreateReadingRequest { temperatureC: number; location?: string; notes?: string }
export interface Reading { id: number; temperatureC: number; location?: string | null; notes?: string | null; createdAtUtc: string }
export interface ApiError { status: number; message: string; details?: Record<string, string[]> }