
const writeJson = require('write');
const axios = require('axios');
const fs = require('fs').promises;

const getUrl = (start = 0, item) => {
    return `https://steamcommunity.com/market/search/render/?query=&start=${start}&count=100&search_descriptions=0&sort_column=name&sort_dir=asc&appid=730&category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Weapon%5B%5D=tag_weapon_${item}&category_730_Exterior%5B%5D=tag_WearCategory2&category_730_Exterior%5B%5D=tag_WearCategory1&category_730_Exterior%5B%5D=tag_WearCategory4&category_730_Exterior%5B%5D=tag_WearCategory3&category_730_Exterior%5B%5D=tag_WearCategory0&category_730_Quality%5B%5D=tag_normal&norender=1`;
}
const allWeapons = [
    "ak47",
    "aug",
    "awp",
    "bayonet",
    "knife_survival_bowie",
    "knife_butterfly",
    "knife_css",
    "cz75a",
    "deagle",
    "elite",
    "knife_falchion",
    "famas",
    "fiveseven",
    "knife_flip",
    "g3sg1",
    "galilar",
    "glock",
    "knife_gut",
    "knife_tactical",
    "knife_karambit",
    "m249",
    "m4a1_silencer",
    "m4a1",
    "knife_m9_bayonet",
    "mac10",
    "mag7",
    "mp5sd",
    "mp7",
    "mp9",
    "knife_gypsy_jackknife",
    "negev",
    "knife_outdoor",
    "nova",
    "hkp2000",
    "p250",
    "p90",
    "knife_cord",
    "bizon",
    "revolver",
    "sawedoff",
    "scar20",
    "sg556",
    "knife_push",
    "knife_skeleton",
    "ssg08",
    "knife_stiletto",
    "knife_canis",
    "knife_widowmaker",
    "tec9",
    "ump45",
    "knife_ursus",
    "usp_silencer",
    "xm1014"
];
const arr = ['sg556'];
const fnStart = async (keyNum) => {
    let cnt = 0;
    return Promise.all([arr[keyNum]].map(async (item) => {
        cnt += 1;
        let start = 0;
        let count = 100;
        let pag = 100;
        const file = await fs.readFile('items.json', { encoding: 'utf8' });
        const fileObj = JSON.parse(file);
        while(start === 0 || count > start) {
            const url = getUrl(start, item);
            start += pag;   
            console.log(start, count);
            const { data } = await axios.get(url);
  
            const { total_count, results } = data;
            count = total_count;
            const names = results.map(it => it.name);

            names.forEach(name => {
                const [itemName, float] = name.split(' (');
                const trueFloat = `(${float}`;
         
                if (fileObj[itemName]) {
                    fileObj[itemName].float[trueFloat] = true;
                } else {
                    fileObj[itemName] = {
                        float: {},
                    };
                }
            });
        }
        return writeJson.promise('items.json', JSON.stringify(fileObj));
    }));
}
let i = -1;
let interval = setInterval(async () => {
    i++;
    console.log(i)
    if (i > arr.length - 1) {
        clearInterval(interval);
        return;
    }
    fnStart(i).then(() => console.log(`done ${i}`));
}, 5000);

