'use client'

import { useAPStore } from '@/stores/autopilot'
import { useEffect, useState } from 'react'

type Props = { ip: string }

const BtnHDG = (props: Props) => {
    const AP = useAPStore()
    const [on, setOn] = useState<boolean>(AP.heading_button)
    const toggleHDG = () => {
        setOn(!on)
        AP.toggleHeadingButton(props.ip)
    }

    useEffect(() => {
        const val = AP.heading_button
        setOn(val)
        colorHDG(val)
    }, [AP.heading_button])

    const colorHDG = (etat:boolean) => {
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
                toggleHDG()
            }}
            className={`rounded border-2 ${colorHDG(on)} min-w-24 h-10 p-2 text-center text-sm hover:bg-slate-800 mt-2 md:ml-1`}
        >
            HDG
        </div>
    )
}

export default BtnHDG
