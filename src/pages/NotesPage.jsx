import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent } from "../components/UIComponents.jsx";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDomain } from "../utils/helper.js";

export default function NotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, moduleNumber } = location.state || {};

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseName || !moduleNumber) return;

    setLoading(true);

    fetch(
     `${getDomain()}/api/resources/getNotes?courseName=${courseName}&moduleNumber=${moduleNumber}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setNotes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load notes");
        setLoading(false);
      });
  }, [courseName, moduleNumber]);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-[#2f2f2f] rounded-xl p-4 space-y-4">
      <div className="w-full h-40 bg-gray-700/40 rounded-md"></div>
      <div className="h-4 bg-gray-700/40 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700/40 rounded w-1/2"></div>
      <div className="h-3 bg-gray-700/40 rounded w-1/3"></div>
      <div className="h-10 bg-gray-700/40 rounded w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#262626] text-white p-6">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>

      <h2 className="text-2xl font-bold mb-4">
        {courseName} - Module {moduleNumber}
      </h2>

      {/* ==========================
          🟡 LOADING INDICATOR
      =========================== */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ==========================
          🔴 ERROR MESSAGE
      =========================== */}
      {error && <p className="text-center text-red-400 text-lg">{error}</p>}

      {/* ==========================
          ⚫ NO NOTES FOUND
      =========================== */}
      {!loading && notes.length === 0 && (
        <p className="text-center text-gray-300 text-lg">
          No notes available for this module.
        </p>
      )}

      {/* ==========================
          🟢 NOTES GRID
      =========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent>
                <iframe
                  src={note.fileUrl}
                  className="w-full h-40 rounded-md"
                ></iframe>

                <p className="text-lg font-semibold mt-2">{note.courseName}</p>

                {note.moduleNumber && (
                  <p className="text-sm">Module: {note.moduleNumber}</p>
                )}

                {note.uploadedBy?.name && (
                  <p className="text-sm">Author: {note.uploadedBy.name}</p>
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
        ))}
      </div>
    </div>
  );
}
