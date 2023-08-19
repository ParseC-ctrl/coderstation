import { useEffect } from "react";
import { Card } from "antd";

import ScoreItem from "./ScoreItem";
import { useDispatch, useSelector } from "react-redux";
import { updateScoreRankAsync } from "../redux/userSlice";
function ScoreRank() {
  const dispatch = useDispatch();
  let userRankInfo = useSelector((state) => state.user.scoreRankInfo);
  useEffect(() => {
    dispatch(updateScoreRankAsync());
  }, [dispatch]);

  const userPointsRankArr = [];
  if (userRankInfo.length) {
    for (let i = 0; i < userRankInfo.length; i++) {
      userPointsRankArr.push(
        <ScoreItem
          rankInfo={userRankInfo[i]}
          rank={i + 1}
          key={userRankInfo[i]._id}
        />
      );
    }
  }

  return <Card title="积分排行榜">{userPointsRankArr}</Card>;
}

export default ScoreRank;
