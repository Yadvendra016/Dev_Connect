import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  // read the feed
  const feed = useSelector((store) => store.feed);
  // dispatch action to add the feed
  const dispatch = useDispatch();
  const getFeed = async () => {
    // if data is present in feed then do not make api call to get data
    if (feed) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      // TODO: create page
      console.log("error in geting the feed " + error);
    }
  };

  // when page load then getFeed
  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;
  if (feed.length === 0)
    return <h1 className="flex justify-center my-52">No more user Found</h1>;

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
