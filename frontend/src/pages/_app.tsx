import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAtom } from "jotai";
import type { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserApi } from "../apis/UserAPI";
import { newsAtom } from "../atom/NewsAtom";
import { userAtom } from "../atom/UserAtom";
import { NEWS_API } from "../config.json";
import "../styles/globals.css";
import { News } from "../types/NewsTypes";
import { localStorageClear, localStorageGetItem } from "../utils/localStorage";
import mqtt from "mqtt";
import { toFollowAtom } from "../atom/ToFollowAtom";
dayjs.extend(relativeTime);

export const mqttClient = mqtt.connect("ws://localhost:8888");
mqttClient.on("connect", () => console.log("Connected MQTT!"));

function MyApp({ Component, pageProps }: AppProps) {
  const [, setNews] = useAtom(newsAtom);
  const [, serUser] = useAtom(userAtom);

  const [, setToFollow] = useAtom(toFollowAtom);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const news = await fetch(
        `https://newsapi.org/v2/top-headlines?country=br&apiKey=${NEWS_API}`
      );

      const newsObject: { articles: News[] } = await news.json();
      setNews(newsObject.articles);
    })();

    (async () => {
      const toFollow = await UserApi.toFollow();
      setToFollow(toFollow);
    })();

    (async () => {
      const user = await UserApi.get();
      if (user) {
        serUser(user);
        return;
      }
      localStorageClear();
      router.push("/");
    })();
  }, []);

  useEffect(() => {
    // Don't let the guy go to login
    const userUid = localStorageGetItem("ACCESS_TOKEN");
    if (router.asPath === "/" && userUid) router.push("/home");
  }, [router.asPath]);

  return (
    <>
      <ToastContainer containerId="tint" draggable={false} autoClose={4000} />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
