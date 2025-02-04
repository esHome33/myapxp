'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const BtnSpeed = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.speed_button)
    const toggleSPEED = () => {
        setOn(!on)
        AP.toggleSpeedButton(props.ip)
    }

    useEffect(() => {
        const val = AP.speed_button
        setOn(val)
        colorSPEED(val)
    }, [AP.speed_button])

    const colorSPEED = (etat: boolean) => {
        if (etat) {
            return 'border-green-500'
        } else {
            return 'border-red-500'
        }
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                toggleSPEED()
            }}
            className={`rounded border-2 ${colorSPEED(on)} min-w-24 h-10 p-2 text-center text-sm hover:bg-slate-800 mt-2 md:ml-1 drop-shadow-md shadow-lime-600`}
        >
            A-THR
        </button>
    )
}

export default BtnSpeed
