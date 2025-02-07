import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import axios from "axios";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  //   handle accept/reject
  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      //TODO: handle Error case
      console.error(error);
    }
  };

  // fetch data of all connection requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/user/requests/received`,
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      //TODO: handle Error case
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  if (!requests) return;
  if (requests.length === 0)
    return (
      <h1 className="flex justify-center my-52">No Connection Request Found</h1>
    );
  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-4xl text-white mb-10">
        Connection Requests
      </h1>
      <div className="flex flex-col items-center">
        {requests.map((request) => {
          const { firstName, lastName, photoUrl, age, about, gender, _id } =
            request.fromUserId;
          return (
            <div
              key={_id}
              className="flex justify-between items-center m-4 p-6 rounded-lg bg-base-300 w-full max-w-2xl shadow-2xl transform transition-transform hover:scale-105"
            >
              <div className="flex items-center">
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoUrl}
                  alt="profile"
                />
                <div className="text-left ml-4">
                  <h2 className="font-bold text-xl text-white">
                    {firstName + " " + lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-gray-400">{age + ", " + gender}</p>
                  )}
                  <p className="text-gray-300">{about}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => reviewRequest("rejected", request._id)}
                  className="btn btn-error mx-2"
                >
                  Reject
                </button>
                <button
                  onClick={() => reviewRequest("accepted", request._id)}
                  className="btn btn-success mx-2"
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
