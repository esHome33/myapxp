'use client'
import { useState } from 'react'

type Props = {
    nom: string
    valeur?: string
    afficheplus?: boolean
    increment?: number
    heading?: boolean
}


const Afficheur = (props: Props) => {
    const DEFAULT_INCREMENT = props.heading ? 10 : 100
    const DEFAULT_VALEUR = props.valeur ? props.valeur : '0'
    const [val, setVal] = useState<string>(DEFAULT_VALEUR)

    const inc = (val: string) => {
        const how_much = props.increment ? props.increment : DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur + how_much
        if (new_val > 0) {
            if (props.afficheplus) {
                return `+${new_val.toFixed(0)}`            
            } else {
                return new_val.toFixed(0)
            }
        } else if (new_val == 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    const dec = (val: string) => {
        const how_much = props.increment ? props.increment : DEFAULT_INCREMENT
        const valeur = parseFloat(val)
        const new_val = valeur - how_much

        if (new_val > 0) {
            if (props.afficheplus) {
                return `+${new_val.toFixed(0)}`
            } else {
                return new_val.toFixed(0)
            }
        } else if (new_val == 0) {
            return '0'
        } else {
            return new_val.toFixed(0)
        }
    }
    return (
        <div className="rounded border border-slate-500 p-2 w-fit">
            <div>{props.nom}</div>
            <div className="flex flex-row gap-1 justify-between">
                <div
                    onClick={(e) => {
                        e.preventDefault()
                        const new_v = dec(val)
                        setVal(new_v)
                    }}
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1"
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
                    className="rounded bg-[#445588] text-white w-10 h-8 py-1"
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
        </div>
    )
}

export default Afficheur
