import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAtom } from "jotai";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { newsAtom } from "../atom/NewsAtom";
import Config from "../config.json";
import "../styles/globals.css";
import { News } from "../types/NewsType";

dayjs.extend(relativeTime);

function MyApp({ Component, pageProps }: AppProps) {
  const [, setNews] = useAtom(newsAtom);

  useEffect(() => {
    (async () => {
      const news = await fetch(
        `https://newsapi.org/v2/top-headlines?country=br&apiKey=${Config.NEWS_API}`
      );

      const newsObject: { articles: News[] } = await news.json();
      setNews(newsObject.articles);
    })();
  }, []);

  return <Component {...pageProps} />;
}
export default MyApp;
