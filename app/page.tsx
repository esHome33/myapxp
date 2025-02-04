'use client'
import Alt from '@/components/AP/alt'
import Btn_alt from '@/components/AP/btn_alt'
import Btn_APP from '@/components/AP/btn_APP'
import BtnAP from '@/components/AP/btnap'
import BtnBRAKES from '@/components/AP/btnbrakes'
import BtnHDG from '@/components/AP/btnheading'
import BtnSpeed from '@/components/AP/btnspeed'
import BtnVS from '@/components/AP/btnvs'
import Heading from '@/components/AP/heading'
import Speed from '@/components/AP/speed'
import Vs from '@/components/AP/vs'
import { cree_URL_Get_DR } from '@/lib/urlmaker'
import { myDR, useAPStore, XPWebResponse } from '@/stores/autopilot'
import { useIpAddressStore } from '@/stores/ipadress_store'
import { useEffect, useState } from 'react'

export default function Home() {
    const [ipa, setIpa] = useState<string>(
        useIpAddressStore.getState().ipAddress,
    )
    const [plane, setPlane] = useState<string>('')
    const [enabled, setEnabled] = useState<boolean>(true)

    const AP = useAPStore()

    useEffect(() => {
        // const id = setInterval(async() => {
        //     await check()
        // }, 3000)
        // return () => clearInterval(id)
    }, [])

    const get_more_datarefs = async () => {
        const the_refs = myDR
        const nbiter = the_refs.length
        const url = cree_URL_Get_DR(ipa)
        const sp = new URLSearchParams()
        let rep: Response

        for (let i = 0; i < nbiter; i++) {
            sp.set('datarefs', the_refs[i])
            url.search = sp.toString()
            try {
                rep = await fetch(url, {
                    method: 'GET',
                    cache: 'no-store',
                })

                if (rep.ok) {
                    const data: XPWebResponse = await rep.json()
                    AP.analyse(data, ipa)
                } else {
                    console.log(
                        `XPWeb server error ${rep.status} for dataref ${the_refs[i]}`,
                    )
                }
            } catch {
                console.log(
                    `XPlane not running when getting dataref n°${i} : ${the_refs[i]}`,
                )
            }
        }
    }

    const trouveStrings = (tab: string[]) => {
        const nbcars = tab.length
        let sortie = ''
        for (let i = 0; i < nbcars; i++) {
            const s = String.fromCharCode(Number.parseInt(tab[i]))
            sortie += s
        }
        return sortie
    }

    const check = async () => {
        const url = cree_URL_Get_DR(ipa)
        const sp = new URLSearchParams()
        let rep: Response

        try {
            sp.set('datarefs', 'sim/cockpit2/radios/actuators/flight_id')
            url.search = sp.toString()
            rep = await fetch(url, {
                method: 'GET',
                cache: 'no-store',
            })

            if (rep.ok) {
                const data: XPWebResponse = await rep.json()
                const nom_avion = trouveStrings(data[0].value)
                console.log(
                    'checking with XPWeb server OK : ' +
                        nom_avion +
                        ' data = ' +
                        JSON.stringify(data),
                )
                setPlane(nom_avion)
                await get_more_datarefs()
            } else {
                console.log(`XPWeb server error ${rep.status}`)
                setPlane('****')
            }
        } catch {
            setPlane('server not running')
        }
        setEnabled(true)
    }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="flex flex-col place-items-start gap-2 max-w-lg text-center">
                <div className="flex flex-col mx-auto">
                    <form className="rounded border border-slate-200 dark:bg-slate-700 bg-black text-white p-2 w-[200px]">
                        <div>IP Address</div>
                        <input
                            value={ipa}
                            onChange={(e) => {
                                useIpAddressStore
                                    .getState()
                                    .setIpAddress(e.target.value)
                                setIpa(e.target.value)
                            }}
                            type="text"
                            className="bg-slate-300 text-black dark:bg-slate-800 dark:text-white w-full px-2 py-1 rounded"
                            placeholder="Enter IP address"
                            pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                        />
                    </form>
                    <div
                        className={
                            enabled
                                ? 'rounded bg-blue-700 text-white hover:bg-blue-800 mt-3 py-1 select-none'
                                : 'rounded bg-slate-900 text-slate-500 mt-3 py-1 select-none'
                        }
                        onClick={() => {
                            if (enabled) {
                                setEnabled(false)
                                check()
                            }
                        }}
                    >
                        CHECK
                    </div>
                    <div
                        className="text-blue-800 dark:text-white
                            bg-teal-100 dark:bg-transparent
                            rounded border-2 border-blue-800 dark:border-slate-800
                        "
                    >
                        {plane}
                    </div>
                </div>
                <div className="md:flex md:flex-row md:gap-10 gap-2 flex flex-col items-end">
                    <div className="flex flex-row gap-2 items-center">
                        <Heading ip={ipa} />
                        <BtnHDG ip={ipa} />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Alt ip={ipa} />
                        <Btn_alt ip={ipa} />
                    </div>
                </div>
                <div className="md:flex md:flex-row md:gap-10 gap-2 flex flex-col items-end">
                    <div className="flex flex-row gap-2 items-center">
                        <Vs ip={ipa} />
                        <BtnVS ip={ipa} />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Speed ip={ipa} />
                        <BtnSpeed ip={ipa} />
                    </div>
                </div>
                <div className="flex flex-row gap-3 ml-16">
                    <BtnAP ip={ipa} />
                    <BtnBRAKES ip={ipa} />
                    <Btn_APP ip={ipa} />
                </div>
            </div>
        </section>
    )
}
