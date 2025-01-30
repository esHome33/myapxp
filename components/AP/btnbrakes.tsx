'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const BtnBRAKES = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.park_brake)
    const toggleAP = () => {
        setOn(!on)
        AP.toggleBrakes(props.ip)
    }
    
    useEffect(() => {
        setOn(AP.park_brake)
        setColor(colorAP(AP.park_brake))
    },[AP.park_brake])
    
    
    const colorAP = (val:boolean) => {
        if (val) {
            return 'border-green-500'
        } else {
            return 'border-red-500'
        }
    }
    const [color, setColor] = useState<string>(colorAP(AP.ap_button))

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                toggleAP()
            }}
            className={`rounded border-2 ${color} min-w-24 h-10 p-2 text-center text-sm hover:bg-slate-800 bg-slate-700 mt-2 md:ml-1`}
        >
            PARK
        </div>
    )
}

export default BtnBRAKES
