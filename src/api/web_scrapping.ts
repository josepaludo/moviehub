
import cheerio from 'cheerio'
//@ts-ignore
import  rp from 'request-promise'


const url = 'https://www.imdb.com/title/tt21692408/soundtrack/';

type Song = {
    name: string,
    artist: string
}

/**
    This function is not meant to be "readable".
    It works for this case as a temporary solution.
    In the best scenario, web scraping would not be used.
*/
export async function scrap(url: string): Promise<Array<Song>> {

    return await rp(url)
        // @ts-expect-error
        .then((html) => {

            const songs: Array<Song> = []

            try {

                const $ = cheerio.load(html)
                const ul = $("ul.ipc-metadata-list")[0].childNodes

                for (const li of ul) {

                    try {
                        // @ts-expect-error
                        const span = li.childNodes[0]
                        const name = $(span).text().trim()

                        // @ts-expect-error
                        const anchorTag = li.childNodes[1]
                            .childNodes[0]
                            .childNodes[0]
                            .childNodes[0]
                            .childNodes[1]
                        const artist = $(anchorTag).text().trim()

                        songs.push({ name, artist })

                    } catch {
                        console.error("ERROR WEB SCRAPPING INNER")
                    }
                }

            } catch {
                console.error("ERROR WEB SCRAPPING OUTER")
            }

            return songs
        })
        // @ts-expect-error
        .catch((err) => {
            console.error("ERROR WEB SCRAPPING REQUEST")
            return []
        });
}
