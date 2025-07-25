import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { period } = req.query
    
    // Validate period parameter
    if (!period || !['weekly', 'monthly'].includes(period as string)) {
      return res.status(400).json({ error: 'Invalid period parameter' })
    }

    // Calculate date range
    const now = new Date()
    const endDate = new Date(now)
    endDate.setHours(23, 59, 59, 999)

    let startDate: Date
    if (period === 'weekly') {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    startDate.setHours(0, 0, 0, 0)

    const start_at = startDate.toISOString().split('T')[0]
    const end_at = endDate.toISOString().split('T')[0]

    const API_KEY = process.env.RAINBET_API_KEY
    if (!API_KEY) {
      throw new Error('Rainbet API key not configured')
    }

    const url = `https://services.rainbet.com/v1/external/affiliates?start_at=${start_at}&end_at=${end_at}&key=${API_KEY}`
    
    const apiResponse = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    // Check if response is HTML (error page)
    const contentType = apiResponse.headers.get('content-type')
    if (contentType?.includes('text/html')) {
      const html = await apiResponse.text()
      throw new Error(`Received HTML response from Rainbet API: ${html.substring(0, 100)}...`)
    }

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => null)
      throw new Error(
        errorData?.message || 
        errorData?.error || 
        `API request failed with status ${apiResponse.status}`
      )
    }

    const data = await apiResponse.json()
    return res.status(200).json(data)
    
  } catch (error) {
    console.error('Rainbet proxy error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}