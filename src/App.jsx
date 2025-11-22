import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import CodeEditor from "./components/CodeEditor";
import "./App.css";
import Editor from "@monaco-editor/react";
import SelectLang from "./components/SelectLang";
import EditorFooter from "./components/EditorFooter";
import { useSelector } from "react-redux";
import EditorHead from "./components/EditorHead";
import DescriptionHeader from "./components/DescriptionHeader";
import Description from "./components/Description";
import Console from "./components/Console";
import { useEffect } from "react";
import QuestionsListPage from "./pages/QuestionListPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AIinterviewPage from "./pages/AIinterviewPage";
import InterviewSessionPage from "./pages/InterviewSessionPage";
import AllTranscriptionsPage from "./pages/AllTranscriptionsPage";
import AIInterviewHomePage from "./pages/HomeAIinterviewPage";
import ResourcesHome from "./pages/ResourcesHome";
import UploadNotesPage from "./pages/UploadNotesPage";
import NotesPage from "./pages/NotesPage";
import CoursesPage from "./pages/CoursePage";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="pt-16 h-screen overflow-hidden">
      <Router>
        <Navbar />
        <div>
          {/* padding so content does not hide behind navbar */}
          <Toaster
            position="top-center"
            containerStyle={{
              marginTop: "60px", // ↓ moves it down
            }}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#16a34a",
                },
              },
              error: {
                style: {
                  background: "#dc2626",
                },
              },
            }}
          />

          <Routes>
            <Route path="/Auth" element={<AuthPage />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/questions"
              element={
                // <ProtectedRoute>
                  <QuestionsListPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:id"
              element={
                // <ProtectedRoute>
                  <QuestionPage />
                // </ProtectedRoute>
              }
            />

            <Route
              path="/AI-Interview/practice"
              element={
                // <ProtectedRoute>
                  <AIinterviewPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/AI-Interview"
              element={
                // <ProtectedRoute>
                  <AIInterviewHomePage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/AI-Interview/transcription"
              element={
                // <ProtectedRoute>
                  <AllTranscriptionsPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/AI-Interview/transcription/view/:sessionId"
              element={
                <ProtectedRoute>
                  <InterviewSessionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <ResourcesHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/upload"
              element={
                <ProtectedRoute>
                  <UploadNotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/view"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/view/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
