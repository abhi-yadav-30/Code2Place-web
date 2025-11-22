import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faUser,
  faCode,
  faCheckCircle,
  faFileAlt,
  faTrophy,
  faArrowRight,
  faLaptopCode,
  faRobot,
  faChartLine,
  faPeopleCarryBox,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Card, CardContent } from "../components/UIComponents";
import { getDomain } from "../utils/helper";

const Profile = () => {
  // These values will come from backend later
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    if (user.recentlySolved)
      setquestions(
        showAll ? user.recentlySolved : user.recentlySolved.slice(0, 3)
      );
  }, [showAll]);

  // const user = {
  //   name: "Abhinandan",
  //   email: "abhi@email.com",
  //   joined: "Jan 2025",
  //   solved: 42,
  //   submissions: 125,
  //   notesUploaded: 9,
  //   score: 870,
  // };

  useEffect(() => {
    fetch(`${getDomain()}/api/user/profile`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        setUser(data);
        // console.log(data)
        setquestions(data.recentlySolved.slice(0, 3));

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const ShimmerBox = ({ h }) => (
    <div className={`bg-[#333] animate-pulse rounded-lg w-full ${h}`} />
  );

  return (
    <div className="h-[92vh] bg-[#1c1c1c] text-white p-6 pb-20 overflow-y-auto ">
      {/* HEADER */}
      <div className="bg-[#242424] p-8 rounded-2xl shadow-lg border border-gray-700 mb-10">
        <div className="flex items-center justify-between gap-6">
          {/* LEFT SIDE (Avatar + Info) */}
          <div className="flex items-center gap-6 w-[90vh]">
            <div className="bg-orange-500 w-25 h-20 rounded-full  flex items-center justify-center text-4xl">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <div className="w-full">
              {loading ? (
                <>
                  <ShimmerBox h="h-6 w-40 mb-3" />
                  <ShimmerBox h="h-4 w-60 mb-3" />
                  <ShimmerBox h="h-4 w-60" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-gray-400">{user.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE (Total Score) */}
          <div className="text-right">
            {loading ? (
              <ShimmerBox h="h-10 w-24" />
            ) : (
              <div className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center w-[30vh]">
                <FontAwesomeIcon
                  icon={faTrophy}
                  className="text-4xl text-orange-500 mb-1"
                />

                {loading ? (
                  <ShimmerBox h="h-6 w-20 mx-auto mb-2" />
                ) : (
                  <h2 className="text-3xl font-bold">
                    {user.codeScore +
                      user.interviewScore +
                      user.resourceSharingScore}
                  </h2>
                  // <></>
                )}

                <p className="text-gray-300">Total Score</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className=" gap-8 max-w-6xl mx-auto justify-center flex flex-wrap">
        {/* STAT BOX TEMPLATE */}
        {[
          {
            icon: faCheckCircle,
            label: "Questions Solved",
            key: "uniqueQuestionsSolved",
          },
          {
            icon: faCode,
            label: "Submissions Made",
            key: "successfulSubmissions",
          },
          {
            icon: faFileAlt,
            label: "Notes Uploaded",
            key: "noOfResources",
          },
          {
            icon: faRobot,
            label: "AI Mock Interviews",
            key: "noOfInterviews",
          },
          {
            icon: faLaptopCode,
            label: "Coding Score",
            key: "codeScore",
          },
          {
            icon: faHandHoldingHeart,
            label: "Resource Sharing Score",
            key: "resourceSharingScore",
          },
          {
            icon: faChartLine,
            label: "Interviews Score",
            key: "interviewScore",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center w-[30vh]"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-4xl text-orange-500 mb-4"
            />

            {loading ? (
              <ShimmerBox h="h-6 w-20 mx-auto mb-2" />
            ) : (
              <h2 className="text-3xl font-bold">{user[item.key]}</h2>
              // <></>
            )}

            <p className="text-gray-300">{item.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      {Array.isArray(user.recentlySolved) && user.recentlySolved.length > 0 && (
        <div className="bg-[#242424] p-8 rounded-2xl border border-gray-700 mt-14 max-w-5xl mx-auto shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-orange-400">
            Questions Solved By You
          </h2>

          <div className="space-y-5">
            {loading ? (
              <>
                <ShimmerBox h="h-12" />
                <ShimmerBox h="h-12" />
                <ShimmerBox h="h-12" />
              </>
            ) : (
              <>
                {questions.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between items-center bg-[#1f1f1f] p-4 rounded-lg border border-gray-700"
                    >
                      <p className="text-gray-300">Solved: {item.QueTitle}</p>
                      <span
                        className={`
        text-xs px-2 py-1 rounded mt-2 inline-block
        ${
          item.difficultyLevel === 1
            ? "bg-green-700 text-green-200"
            : item.difficultyLevel === 2
            ? "bg-yellow-700 text-yellow-200"
            : "bg-red-700 text-red-200"
        }
      `}
                      >
                        {item.difficultyLevel === 1
                          ? "Easy"
                          : item.difficultyLevel === 2
                          ? "Medium"
                          : "Hard"}
                      </span>
                    </div>
                  );
                })}
                {user.recentlySolved.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 text-blue-200 underline text-sm cursor-pointer"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div className="bg-[#242424] p-8 rounded-2xl border border-gray-700 mt-14 max-w-5xl mx-auto shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-orange-400">
          Resources Uploaded By You
        </h2>

        <div className="space-y-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              <ShimmerBox h="h-12" />
              <ShimmerBox h="h-12" />
              <ShimmerBox h="h-12" />
            </>
          ) : (
            <>
              {user.resources.map((note) => {
                return (
                  // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card>
                      <CardContent>
                        <iframe
                          src={note.fileUrl}
                          className="w-full h-30 rounded-md"
                        ></iframe>

                        <p className="text-lg font-semibold mt-2">
                          {note.courseName}
                        </p>

                        {note.moduleNumber && (
                          <p className="text-sm">Module: {note.moduleNumber}</p>
                        )}

                        {note.uploadedBy?.name && (
                          <p className="text-sm">
                            Author: {note.uploadedBy.name}
                          </p>
                        )}

                        {note.createdAt && (
                          <p className="text-sm">
                            Uploaded on:{" "}
                            {new Date(note.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}

                        {/* OPEN PDF */}
                        <a href={note.fileUrl} target="_blank">
                          <Button className="mt-3 w-full bg-teal-500 hover:bg-teal-600">
                            Open PDF
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>

                  // </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faCode,
//   faCheckCircle,
//   faFileAlt,
//   faTrophy,
//   faArrowRight,
// } from "@fortawesome/free-solid-svg-icons";

const Profil = () => {
  // These values will come from backend later
  const [user, setUser] = useState({});

  // const user = {
  //   name: "Abhinandan",
  //   email: "abhi@email.com",
  //   joined: "Jan 2025",
  //   solved: 42,
  //   submissions: 125,
  //   notesUploaded: 9,
  //   score: 870,
  // };

  useEffect(() => {
    fetch(`${getDomain()}/api/user/profile`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        setUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white p-6 pb-20">
      {/* HEADER */}
      <div className="bg-[#242424] p-8 rounded-2xl shadow-lg border border-gray-700 mb-10">
        <div className="flex items-center gap-6">
          <div className="bg-orange-500 w-20 h-20 rounded-full flex items-center justify-center text-4xl">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            {/* <p className="text-gray-500 text-sm mt-1">Joined: {user.joined}</p> */}
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Questions Solved */}
        <div className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-4xl text-orange-500 mb-4"
          />
          {/* <h2 className="text-3xl font-bold">{user.solved}</h2> */}
          <p className="text-gray-300">Questions Solved</p>
        </div>

        {/* Submissions */}
        <div className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center">
          <FontAwesomeIcon
            icon={faCode}
            className="text-4xl text-orange-500 mb-4"
          />
          {/* <h2 className="text-3xl font-bold">{user.submissions}</h2> */}
          <p className="text-gray-300">Submissions Made</p>
        </div>

        {/* Notes Uploaded */}
        <div className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center">
          <FontAwesomeIcon
            icon={faFileAlt}
            className="text-4xl text-orange-500 mb-4"
          />
          {/* <h2 className="text-3xl font-bold">{user.notesUploaded}</h2> */}
          <p className="text-gray-300">Notes Uploaded</p>
        </div>

        {/* Score */}
        <div className="bg-[#242424] p-8 rounded-xl border border-gray-700 text-center">
          <FontAwesomeIcon
            icon={faTrophy}
            className="text-4xl text-orange-500 mb-4"
          />
          {/* <h2 className="text-3xl font-bold">{user.score}</h2> */}
          <p className="text-gray-300">Total Score</p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-[#242424] p-8 rounded-2xl border border-gray-700 mt-14 max-w-5xl mx-auto shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-orange-400">
          Recent Activity
        </h2>

        <div className="space-y-5">
          <div className="flex justify-between items-center bg-[#1f1f1f] p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300">Solved: Two Sum Problem</p>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>

          <div className="flex justify-between items-center bg-[#1f1f1f] p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300">Uploaded: DBMS Notes (PDF)</p>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>

          <div className="flex justify-between items-center bg-[#1f1f1f] p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300">Mock Interview Completed</p>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    </div>
  );
};
