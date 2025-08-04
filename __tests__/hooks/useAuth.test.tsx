import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with no user and loading false when no stored auth', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isAdmin).toBe(false)
  })

  it('initializes with demo user when stored auth exists', () => {
    mockLocalStorage.getItem.mockReturnValue('true')
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toEqual({
      uid: 'demo-user',
      email: 'admin@nagase-salon.com',
      displayName: 'Demo Admin',
      role: 'admin',
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isAdmin).toBe(true)
  })

  it('logs in successfully with correct credentials', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      const loginResult = await result.current.login('admin@nagase-salon.com', 'salon123')
      expect(loginResult.user.email).toBe('admin@nagase-salon.com')
    })
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('adminAuth', 'true')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('throws error with incorrect credentials', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await expect(
        result.current.login('wrong@email.com', 'wrong-password')
      ).rejects.toThrow('メールアドレスまたはパスワードが間違っています')
    })
    
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('logs out successfully', async () => {
    mockLocalStorage.getItem.mockReturnValue('true')
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.logout()
    })
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('adminAuth')
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})