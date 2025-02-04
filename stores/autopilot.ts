import { cree_URL_CMD, cree_URL_Set_DR } from '@/lib/urlmaker'
import { toggle } from '@heroui/theme'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AutopilotElements {
    alt_sel: string
    vs_sel: string
    heading_sel: string
    speed_sel: string

    park_brake: boolean
    ap_button: boolean
    app_button: boolean
    alt_sel_button: boolean
    fd_button: boolean
    heading_button: boolean
    vs_button: boolean
    speed_button: boolean
}

interface AutopilotActions {
    setAltSel: (altSel: string, ip: string) => void
    setVsSel: (vs_sel: string, ip: string) => void
    setHeadingSel: (heading_sel: string, ip: string) => void
    setSpeedSel: (speed_sel: string, ip: string) => void

    getAltSel: () => string
    getVsSel: () => string
    getHeadingSel: () => string
    getSpeedSel: () => string

    toggleAltSelButton: (ip: string) => void
    toggleAPButton: (ip: string) => void
    toggleAPPButton: (ip: string) => void
    toggleBrakes: (ip: string) => void
    toggleVSButton: (ip: string) => void
    toggleFdButton: () => void
    toggleHeadingButton: (ip: string) => void
    toggleSpeedButton: (ip: string) => void

    analyse: (data: XPWebResponse, ip: string) => void
}
type AutopilotState = AutopilotElements & AutopilotActions

export type XPWebResponse = [
    {
        dataref: string
        value: [string]
        status: string
    },
]

export const myDR = [
    'sim/cockpit2/autopilot/flight_director_mode', /// good for FD AP switch 0 OFF, 1 FD ON AP OFF, 2 AP ON FD ON
    'sim/cockpit2/autopilot/altitude_dial_ft',
    'sim/cockpit/autopilot/heading_mag',
    'sim/cockpit2/autopilot/heading_mode', // good for HDG switch
    'sim/cockpit2/autopilot/heading_dial_deg_mag_pilot',
    'sim/cockpit2/autopilot/vvi_dial_fpm',
    'sim/cockpit2/autopilot/airspeed_dial_kts',
    'sim/flightmodel/controls/parkbrake', /// park brake tiré ou pas
    //'sim/flightmodel/position/indicated_airspeed', /// vitesse de l'avion
    'sim/cockpit2/autopilot/approach_status', /// bouton approach
    'sim/cockpit2/autopilot/altitude_mode', /// 3 = OFF / 4 => VS ON / 6 => ALT ON
]

/**
 * analyse le contenu de XPWeb et met à jour les éléments de l'autopilot
 * @param data chaine obtenue du serveur XPWeb ... contient la dataref
 */
export const parseAP = (
    data: XPWebResponse,
    ip: string,
    g: () => AutopilotState,
    s: (p: Partial<AutopilotState>) => void,
) => {
    for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const dr = d.dataref
        const v = d.value[0]
        console.log(`lu ${dr} = ${v} de type ${typeof v}`)
        if (dr === 'sim/cockpit2/autopilot/vvi_dial_fpm') {
            g().setVsSel(v, ip)
        } else if (dr === 'sim/cockpit2/autopilot/heading_dial_deg_mag_pilot') {
            g().setHeadingSel(v, ip)
        } else if (dr === 'sim/cockpit2/autopilot/altitude_dial_ft') {
            g().setAltSel(v, ip)
        } else if (dr === 'sim/cockpit2/autopilot/airspeed_dial_kts') {
            g().setSpeedSel(v, ip)
        } else if (dr === 'sim/cockpit2/autopilot/flight_director_mode') {
            console.log('autopilot is ' + v)
            const valeur = Number.parseInt(v)
            if (valeur === 0) {
                s({ ap_button: false })
                s({ fd_button: false })
            } else if (v === '1') {
                s({ ap_button: false })
                s({ fd_button: true })
            } else if (v === '2') {
                s({ ap_button: true })
                s({ fd_button: true })
            }
        } else if (dr === 'sim/flightmodel/controls/parkbrake') {
            const valeur = Number.parseInt(v)
            if (valeur === 1) {
                s({ park_brake: true })
            } else {
                s({ park_brake: false })
            }
        } else if (dr === 'sim/cockpit2/autopilot/approach_status') {
            if (v === '0') {
                s({ app_button: false })
            } else {
                s({ app_button: true })
            }
        } else if (dr === 'sim/cockpit2/autopilot/heading_mode') {
            const valeur = Number.parseInt(v)
            if (valeur === 0) {
                s({ heading_button: false })
            } else {
                s({ heading_button: true })
            }
        } else if (dr === 'sim/cockpit2/autopilot/altitude_mode') {
            const valeur = Number.parseInt(v)
            if (valeur === 3) {
                s({ alt_sel_button: false })
                s({ vs_button: false })
            } else if (valeur === 4) {
                s({ alt_sel_button: false })
                s({ vs_button: true })
            } else if (valeur === 6) {
                s({ alt_sel_button: true })
                s({ vs_button: false })
            }
        }
    }
}

const changeVS_SEL = async (new_val: string, ipa: string, s: any) => {
    const url = cree_URL_Set_DR(ipa)

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'sim/cockpit2/autopilot/vvi_dial_fpm',
                value: new_val,
            }),
        })
        if (rep.ok) {
            s({ vs_sel: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running')
    }
}

const changeHEAD_SEL = async (new_val: string, ipa: string, s: any) => {
    const url = cree_URL_Set_DR(ipa)

    const new_val_corrige = parseFloat(new_val).toFixed(0)

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'sim/cockpit2/autopilot/heading_dial_deg_mag_pilot',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ heading_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running')
    }

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'laminar/B738/autopilot/mcp_hdg_dial',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ heading_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running')
    }
}

const changeALT_SEL = async (
    new_val: string,
    ipa: string,
    s: (_p: Partial<AutopilotState>) => void,
) => {
    const url = cree_URL_Set_DR(ipa)

    const new_val_corrige = parseFloat(new_val).toFixed(0)

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'sim/cockpit2/autopilot/altitude_dial_ft',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ alt_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running')
    }

    // pour le B737
    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'laminar/B738/autopilot/mcp_alt_dial',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ alt_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running')
    }
}

// change SPEED SEL value
const changeSPEED_SEL = async (
    new_val: string,
    ipa: string,
    s: (p: Partial<AutopilotState>) => void,
) => {
    const url = cree_URL_Set_DR(ipa)

    const new_val_corrige = parseFloat(new_val).toFixed(0)

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'sim/cockpit2/autopilot/airspeed_dial_kts',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ speed_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running in changeSPEED_SEL')
    }

        try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: 'laminar/B738/autopilot/mcp_speed_dial_kts_mach',
                value: new_val_corrige,
            }),
        })
        if (rep.ok) {
            s({ speed_sel: new_val_corrige })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running in changeSPEED_SEL')
    }

}

const toggleAP = async (
    ip: string,
    new_val: boolean,
    s: (p: Partial<AutopilotState>) => void,
) => {
    const dr = 'sim/cockpit2/autopilot/flight_director_mode'
    const url = cree_URL_Set_DR(ip)
    let valeur: string
    if (new_val) {
        valeur = '2'
    } else {
        valeur = '0'
    }

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: dr,
                value: valeur,
            }),
        })
        if (rep.ok) {
            s({ ap_button: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleAP')
    }
}

// for the ALT button
const toggleALT = async (
    ip: string,
    new_val: boolean,
    s: (p: Partial<AutopilotState>) => void,
) => {
    const dr = 'sim/cockpit2/autopilot/altitude_mode'
    const url = cree_URL_Set_DR(ip)
    let valeur: string
    // soit on est ALT soit on est VS
    if (new_val) {
        valeur = '6'
    } else {
        valeur = '4'
    }

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: dr,
                value: valeur,
            }),
        })
        if (rep.ok) {
            s({
                alt_sel_button: new_val,
                vs_button: !new_val,
            })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleAP')
    }
}

// for the parking brakes
const togglePB = async (
    ip: string,
    new_val: boolean,
    s: (elt: Partial<AutopilotElements>) => void,
) => {
    const dr = 'sim/flightmodel/controls/parkbrake'
    const url = cree_URL_Set_DR(ip)
    let valeur: string
    if (new_val) {
        valeur = '1'
    } else {
        valeur = '0'
    }

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: dr,
                value: valeur,
            }),
        })
        if (rep.ok) {
            s({ park_brake: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur togglePB')
    }

    // for the A330
    const cmd_on = 'laminar/A333/switch/parking_brake_right'
    const cmd_off = 'laminar/A333/switch/parking_brake_left'
    let url_cmd: URL
    if (new_val) {
        url_cmd = cree_URL_CMD(ip, cmd_on)
    } else {
        url_cmd = cree_URL_CMD(ip, cmd_off)
    }
    try {
        const rep = await fetch(url_cmd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (rep.ok) {
            s({ park_brake: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur togglePB for A330')
    }
}

// for the HDG button
const toggleHDG = async (
    ip: string,
    new_val: boolean,
    s: (elt: Partial<AutopilotElements>) => void,
) => {
    const dr = 'sim/cockpit2/autopilot/heading_mode'
    const url = cree_URL_Set_DR(ip)
    let valeur: string
    if (new_val) {
        valeur = '1'
    } else {
        valeur = '0'
    }

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dataref: dr,
                value: valeur,
            }),
        })
        if (rep.ok) {
            s({ heading_button: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleHDG')
    }
}

// for the APP button
const toggleAPP = async (
    ip: string,
    new_val: boolean,
    s: (elt: Partial<AutopilotElements>) => void,
) => {
    const dr = 'sim/autopilot/approach'
    const url = cree_URL_CMD(ip, dr)

    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (rep.ok) {
            s({ app_button: new_val })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleAPP')
    }
}

// for the VS button
const toggleVS = async (
    ip: string,
    new_val: boolean,
    s: (elt: Partial<AutopilotElements>) => void,
) => {
    const dr = 'sim/autopilot/alt_vs'
    const url = cree_URL_CMD(ip, dr)
    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (rep.ok) {
            s({
                vs_button: new_val,
                alt_sel_button: !new_val,
            })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleVS')
    }
}

// for the VS button
const toggleSPEED = async (
    ip: string,
    new_val: boolean,
    s: (elt: Partial<AutopilotElements>) => void,
) => {
    const dr_on = 'sim/autopilot/autothrottle_arm'
    const dr_off = 'sim/autopilot/autothrottle_hard_off'
    let url: URL
    if (new_val) {
        url = cree_URL_CMD(ip, dr_on)
    } else {
        url = cree_URL_CMD(ip, dr_off)
    }
    try {
        const rep = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (rep.ok) {
            s({
                speed_button: new_val,
            })
        } else {
            console.log(`not ok ${rep.status} ${JSON.stringify(rep.json())}`)
        }
    } catch {
        console.log('XPlane not running sur toggleSPEED')
    }
}

export const useAPStore = create<AutopilotState>()(
    persist(
        (set, get) => ({
            alt_sel: '0',
            vs_sel: '0',
            heading_sel: '0',
            speed_sel: '0',
            park_brake: false,

            ap_button: false,
            app_button: false,
            alt_sel_button: false,
            fd_button: false,
            heading_button: false,
            speed_button: false,
            vs_button: false,

            setAltSel: (alt_sel: string, ip: string) =>
                changeALT_SEL(alt_sel, ip, set),
            setVsSel: (vs_sel: string, ip: string) =>
                changeVS_SEL(vs_sel, ip, set),
            setHeadingSel: (heading_sel: string, ip: string) =>
                changeHEAD_SEL(heading_sel, ip, set),
            setSpeedSel: (speed_sel: string, ip: string) =>
                changeSPEED_SEL(speed_sel, ip, set),

            getAltSel: () => get().alt_sel,
            getVsSel: () => get().vs_sel,
            getHeadingSel: () => get().heading_sel,
            getSpeedSel: () => get().speed_sel,

            toggleAltSelButton: (ip: string) =>
                toggleALT(ip, !get().alt_sel_button, set),
            toggleAPButton: (ip: string) => toggleAP(ip, !get().ap_button, set),
            toggleAPPButton: (ip: string) =>
                toggleAPP(ip, !get().app_button, set),
            toggleVSButton: (ip) => toggleVS(ip, !get().vs_button, set),
            toggleBrakes: (ip) => togglePB(ip, !get().park_brake, set),
            toggleFdButton: () => set({ fd_button: !get().fd_button }),
            toggleHeadingButton: (ip) =>
                toggleHDG(ip, !get().heading_button, set),
            toggleSpeedButton: (ip) =>
                toggleSPEED(ip, !get().speed_button, set),

            analyse: (data, ip) => parseAP(data, ip, get, set),
        }),
        {
            name: 'autopilot-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
