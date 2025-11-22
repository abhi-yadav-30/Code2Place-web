import { Accordion, Button } from "../components/UIComponents.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // ⬅️ loading
  const navigate = useNavigate();

  const modules = [1, 2, 3, 4, 5];
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5000/api/resources/courses", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      });
  }, []);

  const goToNotes = (course, moduleNumber) => {
    navigate(`/resources/view/notes`, {
      state: { courseName: course, moduleNumber },
    });
  };

  // -----------------------------
  //   🎨 SKELETON SHIMMER UI
  // -----------------------------
  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 bg-gray-700/40 rounded-xl w-full"></div>
      ))}
    </div>
  );

  // -----------------------------
  //   🎯 RENDER UI
  // -----------------------------
  const accordionItems = courses.map((course) => ({
    title: course,
    content: (
      <div className="grid gap-2 p-2">
        {modules.map((m) => (
          <div className="flex justify-center" key={m}>
            <button
              className="px-4 py-2 rounded-lg bg-[#9469f0] hover:bg-[#7643e6] text-white w-full md:w-[50%] cursor-pointer"
              onClick={() => goToNotes(course, m)}
            >
              Module {m}
            </button>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-[#262626] text-white p-6">
      <Button className="mb-4" onClick={() => navigate(-1)}>
              Back
            </Button>
      <h1 className="text-3xl font-bold mb-4">Available Courses</h1>

      {/* LOADING SHIMMER */}
      {loading ? (
        <Skeleton />
      ) : (
        <Accordion
          items={accordionItems}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
      )}
    </div>
  );
}
