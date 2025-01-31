import Link from 'next/link'

import { title } from '@/components/primitives'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div>
            <h1 className={title()}>About</h1>
            <Image
                className='mx-auto mt-2'
                alt="X-Plane remote autopilot"
                src={'/images/xpap_logo.png'}
                priority
                width={200}
                height={200}
            />
            <p className="mt-8">
                Cette application permet de commander un pilote automatique qui
                est directement connecté à XPLane-11 ou XPlane-12 qui tourne sur
                votre machine
            </p>
            <p className="mt-3">
                Pour que cela fonctionne, vous devez installer un serveur XPWeb
                &nbsp;
                <span className="text-blue-500">
                    <Link href="https://github.com/alireza787b/XPWeb">
                        (voir github)
                    </Link>
                </span>
                &nbsp;sur la même machine sur laquelle tourne XPlane. Il faut
                également que le serveur XPWeb et votre application soient sur
                le même réseau local (WiFi identique).
            </p>
            <p className="mt-3">
                Cette application envoie des requetes REST au serveur XPWeb pour
                donner des commandes à XPlane ou pour lire l&apos;état du pilote
                automatique.
            </p>
        </div>
    )
}
