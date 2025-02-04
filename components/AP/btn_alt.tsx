'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const Btn_alt = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.alt_sel_button)
    const toggleALT = () => {
        setOn(!on)
        AP.toggleAltSelButton(props.ip)
    }

    useEffect(() => {
        const val = AP.alt_sel_button
        setOn(val)
        colorALT(val)
    }, [AP.alt_sel_button])

    const colorALT = (etat:boolean) => {
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
                toggleALT()
            }}
            className={`rounded border-2 ${colorALT(on)} min-w-24 h-14 p-2 text-center text-sm hover:bg-slate-800 mt-2 md:ml-1 drop-shadow-md shadow-lime-600`}
        >
            ALT
        </button>
    )
}

export default Btn_alt
