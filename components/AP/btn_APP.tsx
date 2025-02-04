'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const Btn_APP = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.app_button)
    
    const toggleAPP = () => {
        setOn(!on)
        AP.toggleAPPButton(props.ip)
    }

    useEffect(() => {
        setOn(AP.app_button)
        colorAPP()
    }, [AP.app_button])

    const colorAPP = () => {
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
                toggleAPP()
            }}
            className={`rounded border-2 ${colorAPP()} w-16 h-10 p-2 text-center text-sm focus:bg-green-400 bg-transparent hover:bg-slate-800 mt-2`}
        >
            APP
        </button>
    )
}

export default Btn_APP
