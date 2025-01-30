'use client'
import { useAPStore } from '@/stores/autopilot'
import { Slider } from '@heroui/slider'
import { useState } from 'react'

type Props = {
    ip: string
}

const Alt = (props: Props) => {
    const DEFAULT_INCREMENT = 10

    const AP = useAPStore()
    const [val, setVal] = useState<string>(AP.alt_sel)

    const setValue = (val: number | number[]) => {
        if (Array.isArray(val)) {
            return
        }
        const part = Math.round(val / 100) * 100
        const new_val = `${part}`
        setVal(new_val)
        AP.setAltSel(new_val, props.ip)
    }

    const inc = (val: string) => {
        const how_much = DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur + how_much
        AP.setAltSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `${new_val.toFixed(0)}`
        } else if (new_val === 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    const dec = (val: string) => {
        const how_much = DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        let new_val = valeur - how_much
        if (new_val < 0) {
            new_val = 0
        }

        AP.setAltSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `${new_val.toFixed(0)}`
        } else if (new_val === 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    return (
        <div className="rounded border border-slate-500 p-2 w-fit">
            <div>ALT SEL</div>
            <div className="flex flex-row gap-1 justify-between">
                <div className="rounded bg-transparent text-white w-10 h-8 py-1 select-none" />

                <div
                    onClick={(e) => {
                        e.preventDefault()
                        const new_v = dec(val)
                        setVal(new_v)
                    }}
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1 select-none"
                >
                    -
                </div>
                <div className="bg-slate-300 dark:bg-slate-800 dark:text-white text-black rounded w-20 h-8 py-1">
                    {val}
                </div>
                <div
                    onClick={(e) => {
                        e.preventDefault()
                        const new_v = inc(val)
                        setVal(new_v)
                    }}
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1 select-none"
                >
                    +
                </div>
                <div
                    onClick={(e) => {
                        e.preventDefault()
                        const new_v = '0'
                        setVal(new_v)
                    }}
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1 select-none"
                >
                    x
                </div>
            </div>
            <Slider
                maxValue={40000}
                minValue={0}
                marks={[
                    { value: 0, label: '|' },
                    { value: 5000, label: '|' },
                    { value: 10000, label: '|' },
                    { value: 15000, label: '|' },
                    { value: 20000, label: '|' },
                    { value: 25000, label: '|' },
                    { value: 30000, label: '|' },
                    { value: 35000, label: '|' },
                    { value: 40000, label: '|' },
                ]}
                aria-label="heading slider"
                step={1}
                value={parseInt(val)}
                onChange={(v) => setValue(v)}
            />
        </div>
    )
}

export default Alt
