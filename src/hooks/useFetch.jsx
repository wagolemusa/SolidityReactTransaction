import { useEffect, useState } from "react";

const API_KEY = "KdI6k08ynmkF1S1bvrAnJ47eARnYisgJ";

const  useFetch = ({ keyword }) => {
    const [gifUrl, setGiftUrl] = useState("");

    const fetchGifts = async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key${API_KEY}&q=${keyword.split(" ").join(" ")}&limit=1`)
            const { data } = await response.json();

            setGiftUrl(data[0]?.images?.downsized_medium?.url)
        } catch(error){
            setGiftUrl('https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284')

        }
    }

    useEffect(() => {
        if(keyword) fetchGifts();
    }, [keyword]);

    return gifUrl
}


export default useFetch;
