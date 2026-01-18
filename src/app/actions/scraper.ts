'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';

// Wikipedia Scraper
export async function scrapeWikipedia(query: string) {
    try {
        const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        return {
            success: true,
            data: {
                title: response.data.title,
                description: response.data.description,
                extract: response.data.extract,
                thumbnail: response.data.thumbnail?.source || null,
                url: response.data.content_urls?.desktop?.page || '',
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.status === 404 ? 'Artikel tidak ditemukan' : 'Gagal mengambil data dari Wikipedia',
        };
    }
}

// GitHub User Scraper
export async function scrapeGitHub(username: string, limit: number = 5) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${Math.min(limit, 100)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        return {
            success: true,
            data: {
                name: response.data.name || username,
                login: response.data.login,
                avatar: response.data.avatar_url,
                bio: response.data.bio,
                followers: response.data.followers,
                following: response.data.following,
                publicRepos: response.data.public_repos,
                url: response.data.html_url,
                repos: reposResponse.data.map((repo: any) => ({
                    name: repo.name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    language: repo.language,
                    url: repo.html_url,
                })),
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.status === 404 ? 'User tidak ditemukan' : 'Gagal mengambil data dari GitHub',
        };
    }
}

// Reddit Subreddit Scraper
export async function scrapeReddit(subreddit: string, limit: number = 10) {
    try {
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${Math.min(limit, 100)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        const posts = response.data.data.children.map((post: any) => ({
            title: post.data.title,
            author: post.data.author,
            score: post.data.score,
            comments: post.data.num_comments,
            url: `https://reddit.com${post.data.permalink}`,
            thumbnail: post.data.thumbnail && post.data.thumbnail.startsWith('http') ? post.data.thumbnail : null,
        }));

        return {
            success: true,
            data: {
                subreddit: subreddit,
                posts,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: 'Gagal mengambil data dari Reddit',
        };
    }
}

// Hacker News Scraper
export async function scrapeHackerNews(limit: number = 10) {
    try {
        const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topIds = topStoriesResponse.data.slice(0, Math.min(limit, 100));

        const stories = await Promise.all(
            topIds.map(async (id: number) => {
                const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return {
                    title: storyResponse.data.title,
                    by: storyResponse.data.by,
                    score: storyResponse.data.score,
                    url: storyResponse.data.url || `https://news.ycombinator.com/item?id=${id}`,
                    comments: storyResponse.data.descendants || 0,
                };
            })
        );

        return {
            success: true,
            data: {
                stories,
            },
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal mengambil data dari Hacker News',
        };
    }
}

// Product Hunt Scraper (using public data)
export async function scrapeProductHunt(limit: number = 10) {
    try {
        const response = await axios.get('https://www.producthunt.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        const $ = cheerio.load(response.data);
        const products: any[] = [];

        // Parse basic product data from homepage
        $('.styles_item__Ypr7V').slice(0, Math.min(limit, 50)).each((i, elem) => {
            const title = $(elem).find('h3').first().text().trim();
            const description = $(elem).find('p').first().text().trim();

            if (title) {
                products.push({
                    name: title,
                    tagline: description,
                });
            }
        });

        return {
            success: true,
            data: {
                products: products.length > 0 ? products : [
                    { name: 'Product Hunt Data', tagline: 'Scraping from Product Hunt HTML is limited. Consider using their API for full access.' },
                ],
            },
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal mengambil data dari Product Hunt',
        };
    }
}

// YouTube Search Scraper
export async function scrapeYouTube(query: string, limit: number = 10) {
    try {
        const response = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)',
            },
        });

        const data = response.data;
        const videos: any[] = [];

        // Extract initial data from page
        const ytInitialData = data.split('var ytInitialData = ')[1]?.split(';</script>')[0];

        if (ytInitialData) {
            const parsed = JSON.parse(ytInitialData);
            const contents = parsed?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

            contents.slice(0, Math.min(limit, 50)).forEach((item: any) => {
                const videoData = item.videoRenderer;
                if (videoData) {
                    videos.push({
                        title: videoData.title?.runs?.[0]?.text || '',
                        channel: videoData.ownerText?.runs?.[0]?.text || '',
                        views: videoData.viewCountText?.simpleText || '',
                        thumbnail: videoData.thumbnail?.thumbnails?.[0]?.url || '',
                        videoId: videoData.videoId,
                        url: `https://www.youtube.com/watch?v=${videoData.videoId}`,
                        duration: videoData.lengthText?.simpleText || '',
                    });
                }
            });
        }

        return {
            success: true,
            data: {
                videos: videos.length > 0 ? videos : [],
            },
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal mengambil data dari YouTube',
        };
    }
}

// Google Maps Place Search Scraper
export async function scrapeGoogleMaps(query: string, location: string = '') {
    try {
        const searchQuery = location ? `${query} ${location}` : query;

        // Return demo data with educational note
        return {
            success: true,
            data: {
                query: searchQuery,
                places: [
                    {
                        name: 'Demo: ' + query,
                        address: location || 'Location-based results',
                        rating: 'N/A',
                        type: 'Place',
                        note: 'Note: Google Maps heavily relies on JavaScript rendering. For production use, consider Google Places API.',
                    },
                    {
                        name: 'Google Places API Recommended',
                        address: 'https://developers.google.com/maps/documentation/places',
                        rating: '⭐⭐⭐⭐⭐',
                        type: 'Info',
                        note: 'Google Maps data is dynamically loaded via JavaScript, making traditional scraping challenging. The Google Places API is recommended for production applications with reliable, structured data.',
                    },
                ],
            },
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal mengambil data dari Google Maps. Gunakan Google Places API untuk hasil yang lebih baik.',
        };
    }
}
