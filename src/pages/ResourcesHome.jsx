import { useNavigate } from "react-router-dom";

const ResourcesHome = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#262626] text-white flex items-center justify-center p-6 bg-linear-to-br
    from-[#0f0f0f]
    via-[#1a1a1a]
    to-orange-500/60"
    >
      <div className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-700 ">
        <h1 className="text-2xl font-semibold mb-6 text-white text-center">
          Resources
        </h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/resources/upload")}
            className="w-full bg-purple-400 hover:bg-purple-500 text-black p-3 rounded-lg font-medium cursor-pointer"
          >
            Upload Notes
          </button>

          <button
            onClick={() => navigate("/resources/view")}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-medium cursor-pointer"
          >
            Access Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHome;
