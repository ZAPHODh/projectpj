'use server'

export const getSchedules = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Erro na requisição')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return []
  }
}

export const getProfessionals = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) throw new Error('Erro na requisição')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error)
    return []
  }
}

export const getServices = async (token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (!response.ok) throw new Error('Erro na requisição')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return []
  }
}
