const categories = [
    { name: 'animals', id: 12 },
    { name: 'architecture', id: 13 },
    { name: 'anime', id: 9 },
    { name: 'natural', id: 8 },
    { name: 'people', id: 11 },
]
let nextQuery = null;
let currentCategory = categories[0]
const library = document.querySelector('.library')
const loadingicon = document.querySelector('.loading-icon')
let requested = false;
const setCategory = async (i) => {
    if (currentCategory === categories[i]) return;
    library.innerHTML = ""
    nextQuery = 0;
    currentCategory = categories[i]
    const listitems = document.querySelectorAll(`li`)
    const listitem = document.querySelector(`li#${currentCategory.name}`)


    listitems.forEach(li => { li.classList.value = 'button' })
    listitem.classList.add('selected')
    await getWallpapers()
}

const sendToLibrary = (data, cname) => {
    if (currentCategory.name !== cname) return
    nextQuery = data.data?.next_query.max
    loadingicon.classList.value = nextQuery > 0 ? "loading-icon" : "loading-icon max"
    const images = data.data?.list
    images.forEach((image) => {
        library.innerHTML +=
            `
                <div class="image" id="${image.udId}">
                    <div class="buttons">
                <a target="_blank"
                    href="${(image.url).toString()}"
                    class="button" id="preview">
                    <img src="https://img.icons8.com/?size=100&id=o90MnZhnB2CM&format=png&color=eeeeee" alt="">
                </a>
                <div class="button" id="download" onclick="downloadImage('${(image.url).toString()}')">
                    <img src="https://img.icons8.com/?size=100&id=14100&format=png&color=eeeeee" alt="">
                </div>
                </div>
                <img src="${image.overviewUrl}" alt="">
            </div>

            `
    })
    requested = false
}
const getWallpapers = async () => {
    try {
        const cname = currentCategory.name
        const url =
            `https://dynamic-api.monknow.com/wallpaper/list?theme=2&cate_id=${currentCategory.id}&keyword=${nextQuery === null ? '' : '&max=' + nextQuery}&size=12`

        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Secret': 'csD76525f8b071d36PmancCBji4YQGqv'
            }
        })
            .then(response => response.json())
            .then(data => sendToLibrary(data, cname))
            .catch(error => console.error('Error:', error));
    } catch (error) {
        requested = false
        console.log(error);
    }
}
window.addEventListener('scroll', async () => {
    // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight);
    if (!requested && window.innerHeight + (window.scrollY * 1.1) >= document.body.offsetHeight) {
        requested = true
        setInterval(await getWallpapers(), 900);
    }
});


const downloadImage = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Secret': 'csD76525f8b071d36PmancCBji4YQGqv'
            },
            mode: 'cors'
        });
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'wallpaper.jpg';
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Download failed:', error);
    }
}
getWallpapers()