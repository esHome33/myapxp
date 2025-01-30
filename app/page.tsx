'use client'
import Alt from '@/components/AP/alt'
import BtnAP from '@/components/AP/btnap'
import BtnBRAKES from '@/components/AP/btnbrakes'
import BtnHDG from '@/components/AP/btnheading'
import BtnVS from '@/components/AP/btnvs'
import Heading from '@/components/AP/heading'
import Speed from '@/components/AP/speed'
import Vs from '@/components/AP/vs'
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
        const url = new URL(`http://${ipa}/get_dataref`)
        url.port = '7712'
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
            } catch (error) {
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
        const url = new URL(`http://${ipa}/get_dataref`)
        url.port = '7712'
        const sp = new URLSearchParams()
        let rep: Response

        try {
            sp.set('datarefs', 'sim/cockpit2/radios/actuators/flight_id')
            url.search = sp.toString()
            console.log('checking with XPWeb server ...')
            rep = await fetch(url, {
                method: 'GET',
                cache: 'no-store',
            })

            if (rep.ok) {
                const data: XPWebResponse = await rep.json()
                const nom_avion = trouveStrings(data[0].value)
                setPlane(nom_avion)
                await get_more_datarefs()
            } else {
                console.log(`XPWeb server error ${rep.status}`)
            }
        } catch (error) {
            //console.log('XPlane not running')
            setPlane('XPWeb server is down or XPlane not running')
        }
        setEnabled(true)
    }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="flex flex-col place-items-center gap-2 max-w-lg text-center justify-center ">
                <div className="flex-0">
                    <form className="rounded border border-slate-500 p-2 w-[200px]">
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
                            className="bg-slate-800 w-full px-2 py-1 text-white rounded"
                            placeholder="Enter IP address"
                            pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                        />
                    </form>
                    <div
                        className="rounded bg-blue-700 text-white hover:bg-blue-800 mt-3 py-1"
                        onClick={() => {
                            if(enabled) {
                                setEnabled(false)
                                check()
                            }                            
                        }}
                        
                    >
                        CHECK
                    </div>
                    <div>{plane}</div>
                </div>
                <div className="flex md:flex-row flex-col">
                    <Heading ip={ipa} />
                    <Alt ip={ipa} />
                </div>
                <div className="flex md:flex-row flex-col">
                    <Speed ip={ipa} />
                    <Vs ip={ipa} />
                </div>
                <div className="flex md:flex-row flex-col">
                    <BtnAP ip={ipa} />
                    <BtnBRAKES ip={ipa} />
                    <BtnHDG ip={ipa} />
                    <BtnVS ip={ipa} />
                </div>
            </div>
        </section>
    )
}


