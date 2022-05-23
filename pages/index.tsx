import type { NextPage } from "next";
import { useCallback, useState, useMemo, useEffect } from "react";
import Card from "../components/Card";
import { Tabs, TabPanel } from "../components/Tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { withSessionSsr } from "../libs/withSession";
import { useAppContext } from "../context";
import { ObjType } from "../libs/types";

type Props = {
  userId: string;
};
const Home: NextPage<Props> = ({ userId }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const { data } = useAppContext();
  const onChangeTab = useCallback(
    (tabIndex: number) => {
      if (currentTab !== tabIndex) {
        setCurrentTab(tabIndex);
      }
    },
    [currentTab]
  );
  const [totalReaction, setTotalReaction] = useState<{ [k: string]: any }>({});
  const handleSetLocalStorageTotalReaction = useCallback(
    (data: { [k: string]: any }) => {
      setTotalReaction(data);
      localStorage.setItem("totalReaction", JSON.stringify(data));
    },
    []
  );

  const handleGetLocalStorageTotalReaction = useCallback(() => {
    return JSON.parse(localStorage.getItem("totalReaction") || "{}");
  }, []);

  const handleGetTotalReactionBackend = useCallback(() => {
    fetch("/api/user/reactions")
      .then((res) => res.json())
      .then((result) => {
        setTotalReaction(result.totalReactions);
      });
  }, []);

  useEffect(() => {
    if (currentTab === 0) return;
    handleGetTotalReactionBackend();
  }, [currentTab, handleGetTotalReactionBackend]);

  useEffect(() => {
    if (currentTab !== 0) return;
    const data = handleGetLocalStorageTotalReaction();
    setTotalReaction(data);
  }, [currentTab, handleGetLocalStorageTotalReaction]);

  const handleLikeProfile = useCallback(
    (id: string) => {
      let isFakeApi = currentTab === 0;
      if (isFakeApi) {
        const localStorageTotalReaction = handleGetLocalStorageTotalReaction();
        localStorageTotalReaction[id] = localStorageTotalReaction[id] || {};
        const isLiked = !localStorageTotalReaction[id][userId];
        localStorageTotalReaction[id][userId] = isLiked;
        const total = localStorageTotalReaction[id].total || 0;
        localStorageTotalReaction[id].total = isLiked ? total + 1 : total - 1;
        handleSetLocalStorageTotalReaction(localStorageTotalReaction);
      } else {
        fetch("/api/user/like", {
          body: JSON.stringify({ profileId: id }),
          method: "POST",
        }).then((result) => {
          console.log(result);
          handleGetTotalReactionBackend();
        });
      }
    },
    [
      userId,
      currentTab,
      handleSetLocalStorageTotalReaction,
      handleGetLocalStorageTotalReaction,
      handleGetTotalReactionBackend,
    ]
  );

  useEffect(() => {
    data.actions.setData({ type: currentTab })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  const onSetNextPage = useCallback(() => {
    data.actions.setNextPageData({ type: currentTab })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentTab])

  return (
    <div>
      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <Tabs
          currentTab={currentTab}
          labels={["Fake Api", "My Backend"]}
          onChange={onChangeTab}
        />
        <h1 style={{ color: "#eee" }}>
          Using with {currentTab === 0 ? "Fake API" : "My Backend"}
        </h1>

        <TabPanel tabIndex={0} currentTab={currentTab}>
          {data.state.loading || data.state.data === null ? (
            <h4 style={{ color: "#fff" }}>Loading....</h4>
          ) : (
            <Swiper className="mySwiper">
              {(data.state.data?.[currentTab]?.currentList || []).map(
                (item: ObjType, idx: number) => (
                  <SwiperSlide key={idx}>
                    <Card
                      onSetNextPage={onSetNextPage}
                      data={item}
                      totalLiked={totalReaction?.[item.id]?.total || 0}
                      handleLike={handleLikeProfile}
                      liked={!!totalReaction?.[item.id]?.[userId]}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          )}
        </TabPanel>
        <TabPanel tabIndex={1} currentTab={currentTab}>
          {data.state.loading || data.state.data === null ? (
            <h4 style={{ color: "#fff" }}>Loading....</h4>
          ) : (
            <Swiper className="mySwiper">
              {(data.state.data?.[currentTab]?.currentList || []).map(
                (item: ObjType, idx: number) => (
                  <SwiperSlide key={idx}>
                    <Card
                      onSetNextPage={onSetNextPage}
                      data={item}
                      totalLiked={totalReaction?.[item.id]?.total || 0}
                      handleLike={handleLikeProfile}
                      liked={!!totalReaction?.[item.id]?.[userId]}
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          )}
        </TabPanel>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = (req.session as any).user;
    if (!user) {
      (req.session as any).user = {
        userId: Math.random().toString(16).slice(3),
      };
      req.session.save();
    }

    return {
      props: {
        userId: (req.session as any).user.userId,
      },
    };
  }
);
