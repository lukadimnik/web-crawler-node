import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { exit } from 'process';

interface Parameters {
  nameOfArticle: string;
  depthOfLinks: number;
  firstLinksFollowed: number;
}

const parseNameOfArticle = (name: string) => {
  if (name.length < 2) {
    console.log('Article name should be at least 2 characters long!');
    exit();
  }
  return name;
};

const parseDepthOfLinks = (depth: string) => {
  if (isNaN(parseInt(depth))) {
    console.log('Depth of links should be a number!');
    exit();
  }
  return parseInt(depth);
};

const parseLinksFollowed = (links: string) => {
  if (isNaN(parseInt(links))) {
    console.log('Links followed should be a number!');
    exit();
  }
  return parseInt(links);
};

const parseParameters = (): Parameters => {
  if (process.argv.length < 5) {
    console.log('Not enough arguments!');
    exit();
  }

  const params = process.argv.slice(2);
  const [nameOfArticle, depthOfLinks, firstLinksFollowed] = params;

  return {
    nameOfArticle: parseNameOfArticle(nameOfArticle),
    depthOfLinks: parseDepthOfLinks(depthOfLinks),
    firstLinksFollowed: parseLinksFollowed(firstLinksFollowed),
  };
};

const getUrl = (link: string, baseUrl: string) => {
  return `${baseUrl}${link}`;
};

const getLinks = (html: string, firstLinksFollowed: number) => {
  const $ = cheerio.load(html);
  const links = $('a')
    .map((i, link) => link.attribs.href)
    .get()
    .filter(
      (link) =>
        link.includes('/wiki') &&
        !link.includes('#semi') &&
        !link.includes('https') &&
        !link.includes('.jpg') &&
        !link.includes('.JPG') &&
        !link.includes('.gif') &&
        !link.includes('.svg') &&
        !link.includes('.png') &&
        !link.includes('Talk:') &&
        !link.includes('/Wikipedia') &&
        !link.includes('wikimedia') &&
        !link.includes('Template') &&
        !link.includes('/Help')
    )
    .slice(0, firstLinksFollowed);

  return links;
};

interface Urls {
  url: string;
  linkName: string;
  baseUrl: string;
}

const crawl = async (
  { url, linkName, baseUrl }: Urls,
  depth: number,
  firstLinksFollowed: number,
  indendation: string
) => {
  if (depth < 0) return;

  if (linkName.includes('/wiki')) {
    console.log(indendation, linkName.slice(6));
  } else {
    console.log(indendation, linkName);
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
    },
  });
  const html = await response.text();
  const links = getLinks(html, firstLinksFollowed);

  for (let link of links) {
    await crawl(
      {
        url: getUrl(link, baseUrl),
        linkName: link,
        baseUrl,
      },
      depth - 1,
      firstLinksFollowed,
      indendation.concat('  ')
    );
  }
};

const main = async () => {
  try {
    const { nameOfArticle, depthOfLinks, firstLinksFollowed } =
      parseParameters();

    const baseUrl = 'https://en.wikipedia.org';
    const startUrl = `https://en.wikipedia.org/wiki/${nameOfArticle}`;
    await crawl(
      {
        url: startUrl,
        linkName: nameOfArticle,
        baseUrl,
      },
      depthOfLinks,
      firstLinksFollowed,
      ' '
    );
  } catch (error) {
    console.log('error: ', error);
  }
};

main();
