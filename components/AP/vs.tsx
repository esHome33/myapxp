'use client'
import { useAPStore } from '@/stores/autopilot'
import { Slider } from '@heroui/slider'
import { useEffect, useState } from 'react'

type Props = {
    ip: string
}

const Vs = (props: Props) => {
    const DEFAULT_INCREMENT = 100

    const AP = useAPStore()
    const [val, setVal] = useState<string>(AP.vs_sel)

    useEffect(() => {
        const new_vs = AP.vs_sel
        setVal(new_vs)
    }, [AP.vs_sel])

    const setValue = (val: number | number[]) => {
        if (Array.isArray(val)) {
            return
        }
        const part = Math.round(val / 10) * 10
        const new_val = `${part}`
        setVal(new_val)
        AP.setVsSel(new_val, props.ip)
    }

    const inc = (val: string) => {
        const how_much = DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur + how_much
        AP.setVsSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `+${new_val.toFixed(0)}`
        } else if (new_val == 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    const dec = (val: string) => {
        const how_much = DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur - how_much
        AP.setVsSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `+${new_val.toFixed(0)}`
        } else if (new_val == 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    return (
        <div className="rounded border border-slate-500 p-2 w-fit">
            <div>VS SEL</div>
            <div className="flex flex-row gap-1 justify-between">
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
                maxValue={5000}
                minValue={-5000}
                marks={[
                    { value: -5000, label: '|' },
                    { value: -4000, label: '|' },
                    { value: -3000, label: '|' },
                    { value: -2000, label: '|' },
                    { value: -1000, label: '|' },
                    { value: 0, label: '|' },
                    { value: 1000, label: '|' },
                    { value: 2000, label: '|' },
                    { value: 3000, label: '|' },
                    { value: 4000, label: '|' },
                    { value: 5000, label: '|' },
                ]}
                aria-label="heading slider"
                step={100}
                value={parseInt(val)}
                onChange={(v) => setValue(v)}
            />
        </div>
    )
}

export default Vs
