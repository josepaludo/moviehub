import { getSpotifyToken } from "../api/api_functions";


export class TokenSingleton {

    private static instance: TokenSingleton;

    private expireDate?: Date
    private token!: string

    public constructor() {

        if (!TokenSingleton.instance) {
            TokenSingleton.instance = this
            this.setToken()
        }

        return TokenSingleton.instance
    }

    public async getToken() {

        const now = new Date()

        if (!this.expireDate || now > this.expireDate) {

            await this.setToken()
        }

        return this.token
    }

    private async setToken() {

        const data = await getSpotifyToken()

        if (!data) {
            return
        }

        const now = new Date().getTime()
        const timeUntilExpiration = ( data.expires_in - 30 ) * 1000 // taking 30 seconds off for safety

        this.token = data.token_type + " " + data.access_token
        this.expireDate = new Date( now + timeUntilExpiration )
    }
}