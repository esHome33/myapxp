const PROTOCOL = 'http'

/**
 * Crée une URL pour lire un Dataref
 * @param ip_adress adresse IP de l'ordinateur sur lequel tourne XPWeb
 */
export function cree_URL_Get_DR(ip_adress: string) {
    const url = new URL(`${PROTOCOL}://${ip_adress}/get_dataref`)
    url.port = '7712'
    return url
}

/**
 * Crée une URL pour fixer la valeur d'un Dataref
 * @param ip_adress adresse IP de l'ordinateur sur lequel tourne XPWeb
 */
export function cree_URL_Set_DR(ip_adress: string) {
    const url = new URL(`${PROTOCOL}://${ip_adress}/set_dataref`)
    url.port = '7712'
    return url
}

/**
 * Crée une URL pour activer la commande donnée par le Dataref
 * @param ip_adress adresse IP de l'ordinateur sur lequel tourne XPWeb
 * @param dataref nom du Dataref de commande
 */
export function cree_URL_CMD(ip_adress: string, dataref:string) {
    const url = new URL(`${PROTOCOL}://${ip_adress}/command`)
    url.port = '7712'
    const sp = new URLSearchParams()
    sp.set('command', dataref)
    url.search = sp.toString()
    return url
}