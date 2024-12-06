import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import "./index.less";

console.log("[App.tsx]", `Hello world from Electron ${nodeEnv.process.versions.electron}!`);

const Home = observer(() => {
  const [progress, setProgress] = useState(0);

  const calcProgress = useCallback(() => {
    const now = dayjs();
    let finish = dayjs().hour(18).minute(0).second(0);
    let oneDay = 4.5 * 60 * 60;
    if (now.hour() <= 11 && now.minute() <= 30) {
      finish = dayjs().hour(11).minute(30).second(0);
      oneDay = 2.5 * 60 * 60;
    }
    const minutesUntilFinish = Math.max(finish.diff(now, "s"), 0);
    const progress = Number((1 - Math.min(1, minutesUntilFinish / oneDay)) * 100);
    setProgress(Math.min(progress, 100));
  }, []);

  const calcTranslate = useCallback((progress: number) => {
    if (progress === 0) return 50;
    if (progress === 100) return -70;
    return 40 - progress;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      calcProgress();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="home__container"
      onMouseDown={() => {
        window.customAPI.publishMainWindowOperateMessage({ event: "homeDragWindowStart" });
      }}
      onMouseUp={() => {
        window.customAPI.publishMainWindowOperateMessage({ event: "homeDragWindowEnd" });
      }}>
      <div className="home__wave" style={{ transform: `translateY(${calcTranslate(progress)}%)` }}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="home__time">{`${progress.toFixed(2)}%`}</div>
    </div>
  );
});

export default Home;
