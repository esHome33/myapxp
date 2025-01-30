'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const BtnVS = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.vs_button)
    const toggleVS = () => {
        setOn(!on)
        AP.toggleVSButton(props.ip)
    }

    useEffect(() => {
        const val = AP.vs_button
        setOn(val)
        colorVS(val)
    }, [AP.vs_button])

    const colorVS = (etat:boolean) => {
        if (etat) {
            return 'border-green-500'
        } else {
            return 'border-red-500'
        }
    }

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                toggleVS()
            }}
            className={`rounded border-2 ${colorVS(on)} min-w-24 h-10 p-2 text-center text-sm hover:bg-slate-800 mt-2 md:ml-1`}
        >
            VS
        </div>
    )
}

export default BtnVS
