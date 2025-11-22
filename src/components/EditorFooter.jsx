import React from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import {
  setIsRunning,
  setIsSubmitting,
  setTestCases,
} from "../store/utilesSlice";
import { useState } from "react";
import { DiffLevelToScoreMapping } from "../constants";
import toast from "react-hot-toast";
import { getDomain } from "../utils/helper";

const EditorFooter = ({ code, queId, question }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.utiles.language);
  const isRunning = useSelector((state) => state.utiles.isRunning);
  const isSubmitting = useSelector((state) => state.utiles.isSubmitting);

  const handleRun = async () => {
    try {
      dispatch(setIsRunning(true));
      if (!code) {
        toast.error("Empty source code!");
        return;
      }
      const res = await fetch(`${getDomain()}/api/question/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          source_code: code,
          language,
          stdin: "",
          queId: queId,
        }),
      });

      const data = await res.json();
      // console.log("Response:", data);
      dispatch(setTestCases(data));
    } catch (err) {
      console.log(err);
      toast.error("error while running the code!");
    } finally {
      dispatch(setIsRunning(false));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!code) {
        toast.error("Empty source code!");
        return;
      }
      dispatch(setIsSubmitting(true));
      const { userId } = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`${getDomain()}/api/question/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          source_code: code,
          language,
          stdin: "",
          queId: queId,
          userId,
          qScore: DiffLevelToScoreMapping[question.difficultyLevel],
        }),
      });

      const data = await res.json();
      console.log("Response:", data);
      if (data?.status.isPassed) {
        toast.success("All test cases passed!");
      } else {
        toast.error(`test cases failed! (${data?.status.verdict})`);
      }
      if (!data?.results){
        toast.error("Error while submitting the code!");
      }
         dispatch(setTestCases(data?.results));
    } catch (err) {
      console.log(err);
      toast.error("Error while submitting the code!");
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };
  return (
    <div
      className="min-h-14 bg-[#262626] border-t border-gray-300 
                flex flex-wrap md:flex-nowrap 
                items-center justify-end gap-3 px-2 md:px-4"
    >
      {!isRunning ? (
        <button
          onClick={handleRun}
          disabled={isSubmitting}
          className="w-36 h-10 flex items-center gap-2 border  border-blue-400 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white  transition cursor-pointer
          disabled:border-gray-400 
    disabled:text-gray-400 
    disabled:bg-gray-200 
    disabled:cursor-not-allowed 
    disabled:hover:bg-gray-200 
    disabled:hover:text-gray-400"
        >
          Compile & Run
        </button>
      ) : (
        <button
          disabled={isRunning}
          className="w-36 h-10 flex items-center justify-center gap-2 border  border-blue-400  px-4 py-2 rounded-lg bg-blue-600 text-white  transition disabled:cursor-not-allowed"
        >
          {" "}
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      )}

      {!isSubmitting ? (
        <button
          disabled={isRunning}
          onClick={handleSubmit}
          className={`h-10 w-24 flex items-center gap-2  text-white px-6 py-2 rounded-lg  transition bg-teal-600 hover:bg-teal-700 cursor-pointer
          disabled:opacity-60 disabled:bg-teal-300 disabled:cursor-not-allowed disabled:text-gray-100
           `}
        >
          Submit
        </button>
      ) : (
        <button
          disabled={isSubmitting}
          className="h-10 w-24 flex items-center justify-center gap-2  text-white px-6 py-2 rounded-lg  transition bg-teal-600
          disabled:cursor-not-allowed "
        >
          {" "}
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      )}
      {/* <button className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"></button> */}
    </div>
  );
};

export default EditorFooter;
