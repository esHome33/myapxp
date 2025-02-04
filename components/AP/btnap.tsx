'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const BtnAP = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.ap_button)
    
    const toggleAP = () => {
        setOn(!on)
        AP.toggleAPButton(props.ip)
    }

    useEffect(() => {
        setOn(AP.ap_button)
        colorAP()
    }, [AP.ap_button])

    const colorAP = () => {
        if (on) {
            return 'border-green-500'
        } else {
            return 'border-red-500'
        }
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                toggleAP()
            }}
            className={`rounded border-2 
                ${colorAP()} w-16 h-10 p-2 
                text-blue-900 dark:text-white
                bg-teal-100 dark:bg-transparent
                text-center text-sm hover:bg-slate-800 mt-2`}
        >
            AP
        </button>
    )
}

export default BtnAP
