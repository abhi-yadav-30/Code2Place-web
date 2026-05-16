// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import {
  faUser,
  faCode,
  faCheckCircle,
  faFileAlt,
  faTrophy,
  faLaptopCode,
  faRobot,
  faChartLine,
  faHandHoldingHeart,
  faCalendarAlt,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Button, Card, CardContent } from "../components/UIComponents";
import { getDomain } from "../utils/helper";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    if (user.recentlySolved)
      setquestions(
        showAll ? user.recentlySolved : user.recentlySolved.slice(0, 3)
      );
  }, [showAll, user.recentlySolved]);

  useEffect(() => {
    fetch(`${getDomain()}/api/user/profile`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (data?.error) {
          toast.error(data?.error);
          return;
        }
        setUser(data);
        setquestions(data.recentlySolved?.slice(0, 3) || []);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const ShimmerBox = ({ h, className = "" }) => (
    <div className={`bg-white/5 animate-pulse rounded-xl ${h} ${className}`} />
  );

  const stats = [
    { icon: faCheckCircle, label: "Solved", key: "uniqueQuestionsSolved", color: "text-emerald-500" },
    { icon: faCode, label: "Submissions", key: "successfulSubmissions", color: "text-blue-500" },
    { icon: faFileAlt, label: "Resources", key: "noOfResources", color: "text-rose-500" },
    { icon: faRobot, label: "Interviews", key: "noOfInterviews", color: "text-purple-500" },
    { icon: faLaptopCode, label: "Coding Score", key: "codeScore", color: "text-orange-500" },
    { icon: faHandHoldingHeart, label: "Sharing Score", key: "resourceSharingScore", color: "text-teal-500" },
    { icon: faChartLine, label: "Interview Score", key: "interviewScore", color: "text-indigo-500" },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] text-white p-4 md:p-10 pb-24 overflow-y-auto scroll-smooth">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-600/10 blur-3xl -z-10 rounded-3xl"></div>
          <Card className="border border-white/10">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {loading ? (
                    <ShimmerBox h="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
                  ) : (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-600 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-2xl">
                        {user.name ? user.name[0].toUpperCase() : <FontAwesomeIcon icon={faUser} className="text-gray-400" />}
                      </div>
                    </div>
                  )}

                  <div className="text-center md:text-left space-y-2">
                    {loading ? (
                      <>
                        <ShimmerBox h="h-10 w-48" />
                        <ShimmerBox h="h-6 w-32" />
                      </>
                    ) : (
                      <>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{user.username}</h1>
                        <p className="text-xl text-gray-400 font-medium">{user.name}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm text-gray-500">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-500/70" />
                          Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  {loading ? (
                    <ShimmerBox h="h-32 w-48 rounded-3xl" />
                  ) : (
                    <div className="bg-gradient-to-br from-orange-500/10 to-rose-600/10 border border-orange-500/20 p-8 rounded-[2.5rem] text-center min-w-[200px] shadow-xl backdrop-blur-sm">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                        <FontAwesomeIcon icon={faTrophy} className="text-white text-xl" />
                      </div>
                      <h2 className="text-4xl font-black text-white">
                        {user.codeScore + user.interviewScore + user.resourceSharingScore || 0}
                      </h2>
                      <p className="text-orange-500/70 font-bold uppercase tracking-wider text-xs mt-1">Total Rank Score</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full border border-white/5 text-center group hover:bg-white/[0.02]">
                  <CardContent className="p-6">
                    <div className={`text-2xl mb-4 group-hover:scale-110 transition-transform ${item.color}`}>
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    {loading ? (
                      <ShimmerBox h="h-8 w-12 mx-auto mb-2" />
                    ) : (
                      <h3 className="text-2xl font-bold mb-1 tracking-tight">{user[item.key] || 0}</h3>
                    )}
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Recent Questions */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                Solved Challenges
              </h2>
              {user.recentlySolved?.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-orange-500 font-bold text-sm hover:underline"
                >
                  {showAll ? "Show Less" : `View All (${user.recentlySolved.length})`}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((n) => <ShimmerBox key={n} h="h-20" />)
              ) : (
                <AnimatePresence mode="popLayout">
                  {questions.length > 0 ? (
                    questions.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="border border-white/5 hover:border-orange-500/30 transition-colors">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                item.difficultyLevel === 1 ? 'bg-emerald-500/10 text-emerald-500' :
                                item.difficultyLevel === 2 ? 'bg-amber-500/10 text-amber-500' :
                                'bg-rose-500/10 text-rose-500'
                              }`}>
                                <FontAwesomeIcon icon={faCode} />
                              </div>
                              <h3 className="font-bold text-gray-200">{item.QueTitle}</h3>
                            </div>
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                              item.difficultyLevel === 1 ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                              item.difficultyLevel === 2 ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                              'border-rose-500/20 text-rose-500 bg-rose-500/5'
                            }`}>
                              {item.difficultyLevel === 1 ? "Easy" : item.difficultyLevel === 2 ? "Medium" : "Hard"}
                            </span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                      <p className="text-gray-500 font-medium italic">No challenges solved yet. Time to start!</p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </section>

          {/* User Resources */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
              Your Resources
            </h2>
            <div className="space-y-4">
              {loading ? (
                <ShimmerBox h="h-60" />
              ) : user.resources?.length > 0 ? (
                user.resources.map((note, idx) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border border-white/5 group">
                      <CardContent className="p-6">
                        <div className="aspect-video bg-gray-900 rounded-xl mb-4 overflow-hidden relative border border-white/5">
                          <iframe
                            src={`${getDomain()}${note.fileUrl}`}
                            className="w-full h-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                            title={note.courseName}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <h4 className="font-black text-white">{note.courseName}</h4>
                            <p className="text-xs text-gray-400">Module {note.moduleNumber}</p>
                          </div>
                        </div>
                        <a href={`${getDomain()}${note.fileUrl}`} target="_blank" rel="noreferrer" className="w-full">
                          <Button variant="outline" className="w-full text-xs py-2 shadow-none border-white/10 text-gray-300 hover:text-white hover:border-orange-500/50">
                            Download / Preview
                            <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-gray-500 text-sm font-medium italic px-6">You haven't uploaded any resources yet.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;
