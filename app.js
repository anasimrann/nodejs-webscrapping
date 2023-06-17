const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require('json2csv').parse;

const movie = "https://www.imdb.com/title/tt9362722/?ref_=hm_top_tt_t_1";

(async () => {
    let imdbdata = [];
    const response = await request({
        uri: movie,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-encoding": "gzip, deflate, br",
            "accept-Language": "en-GB,en-US;q=0.9,en;q=0.8"
        },
        gzip: true
    });

    let $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('div[class="ratingValue "]  > strong > span').text();
    let summary = $('div[class="summary_text"]').text().trim();
    let releaseData = $('a[title="See more release dates"]').text().trim();

    imdbdata.push({
        title, rating, summary, releaseData
    });

    const csv = json2csv(imdbdata);

    fs.writeFileSync("./imdb.csv", csv, "utf-8");
})(); // Added closing parenthesis
