import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);

  const dispatch = useDispatch();

  // fetch all connection and store in the redux store
  const fetchConnections = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/user/connections`,
        { withCredentials: true }
      );

      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      //TODO: handle Error case
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return <h1 className="flex justify-center my-52">No Connections Found</h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-4xl text-white mb-10">Connections</h1>
      <div className="flex flex-col items-center">
        {connections.map((connection) => {
          const { firstName, lastName, photoUrl, age, about, gender, _id } =
            connection;
          return (
            <div
              key={_id}
              className="flex justify-between items-center m-4 p-6 rounded-lg bg-base-300 w-full max-w-2xl shadow-2xl"
            >
              <div className="flex items-center flex-grow">
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoUrl}
                  alt="profile"
                />
                <div className="text-left ml-4 flex-grow">
                  <h2 className="font-bold text-xl text-white">
                    {firstName + " " + lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-gray-400">{age + ", " + gender}</p>
                  )}
                  <p className="text-gray-300">{about}</p>
                </div>
              </div>
              <div className="ml-4">
                <Link to={`/chat/${_id}`}>
                  <button className="btn btn-primary transform transition-transform hover:scale-105">
                    Chat
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
