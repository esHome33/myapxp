'use client'
import { useAPStore } from '@/stores/autopilot'
import { Slider } from '@heroui/slider'
import { useEffect, useState } from 'react'

type Props = {
    ip: string
}

const Speed = (props: Props) => {
    const DEFAULT_INCREMENT = 1

    const [val, setVal] = useState<string>('0')

    const AP = useAPStore()

    useEffect(() => {
        const new_vs = AP.speed_sel
        setVal(new_vs)
    }, [AP.speed_sel])

    const setValue = (val: number | number[]) => {
        if (Array.isArray(val)) {
            return
        }
        const new_val = `${val}`
        setVal(new_val)
        AP.setSpeedSel(new_val, props.ip)
    }

    const inc = (val: string) => {
        const how_much = DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur + how_much
        AP.setSpeedSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `${new_val.toFixed(0)}`
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
        AP.setSpeedSel(new_val.toFixed(0), props.ip)
        if (new_val > 0) {
            return `${new_val.toFixed(0)}`
        } else if (new_val == 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    return (
        <div className="rounded border border-slate-500 p-2 w-fit">
            <div>SPEED</div>
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
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1"
                >
                    x
                </div>
            </div>
            <Slider
                maxValue={500}
                minValue={0}
                marks={[
                    { value: 0, label: '|' },
                    { value: 100, label: '|' },
                    { value: 200, label: '|' },
                    { value: 300, label: '|' },
                    { value: 400, label: '|' },
                    { value: 500, label: '|' },
                ]}
                aria-label="heading slider"
                step={10}
                value={parseInt(val)}
                onChange={(v) => setValue(v)}
            />
        </div>
    )
}

export default Speed
