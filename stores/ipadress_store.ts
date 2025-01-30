import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IpAddressState {
    ipAddress: string
    setIpAddress: (address: string) => void
    getIpAddress: () => string
}

export const useIpAddressStore = create<IpAddressState>()(
    persist(
        (set, get) => ({
            ipAddress: '192.168.1.118',
            setIpAddress: (address) => set({ ipAddress: address }),
            getIpAddress: () => get().ipAddress,
        }),
        {
            name: 'ip-address-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
