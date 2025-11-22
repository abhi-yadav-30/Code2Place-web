import { useState } from "react";
import { Button } from "../components/UIComponents";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDomain } from "../utils/helper";

const UploadNotesPage = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [moduleNumber, setModuleNumber] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState({
    courseName: "",
    moduleNumber: "",
    file: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsUploading(true);

      let hasError = false;

      const newErrors = { courseName: "", moduleNumber: "", file: "" };

      if (!courseName.trim()) {
        newErrors.courseName = "Required";
        hasError = true;
      }
      if (!moduleNumber.trim()) {
        newErrors.moduleNumber = "Required";
        hasError = true;
      }
      if (!file) {
        newErrors.file = "Required";
        hasError = true;
      }

      setErrors(newErrors);
      if (hasError) {
        setIsUploading(false);
        return;
      }
      // return;
    } catch (erre) {
      setIsUploading(false);
      console.log(err);
    }

    try {
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("moduleNumber", moduleNumber);
      formData.append("file", file);

      const response = await fetch(`${getDomain()}/api/resources/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      let data = {};
      try {
        data = await response.json();
        console.log(data);
      } catch {
        console.warn("No JSON returned");
      }

      if (!response.ok) {
        console.error(data.error || "Upload failed");
        return;
      }

      toast.success("Notes uploaded successfully!");

      // Clear fields
      setCourseName("");
      setModuleNumber("");
      setFile(null);
      setErrors({ courseName: "", moduleNumber: "", file: "" });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262626] text-white p-6">
      <Button className="mb-4" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#2d2d2d] p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Upload Notes
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm">Course Name</label>
                {errors.courseName && (
                  <span className="text-red-400 text-xs">
                    {errors.courseName}
                  </span>
                )}
              </div>

              <select
                className={`w-full p-2 bg-[#1f1f1f] rounded border ${
                  errors.courseName ? "border-red-400" : "border-gray-600"
                }`}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              >
                <option value="">Select Course</option>
                <option value="Linear Algebra and Probability Theory">
                  Linear Algebra and Probability Theory
                </option>
                <option value="ADA/DSA">ADA/DSA</option>
                <option value="IoT Application Development">
                  IoT Application Development
                </option>
                <option value="Microservices Development and Applications">
                  Microservices Development and Applications
                </option>
              </select>
            </div>

            {/* Module Number */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm">Module Number</label>
                {errors.moduleNumber && (
                  <span className="text-red-400 text-xs">
                    {errors.moduleNumber}
                  </span>
                )}
              </div>

              <select
                className={`w-full p-2 bg-[#1f1f1f] rounded border ${
                  errors.moduleNumber ? "border-red-400" : "border-gray-600"
                }`}
                value={moduleNumber}
                onChange={(e) => setModuleNumber(e.target.value)}
              >
                <option value="">Select Module</option>
                <option value="1">Module 1</option>
                <option value="2">Module 2</option>
                <option value="3">Module 3</option>
                <option value="4">Module 4</option>
                <option value="5">Module 5</option>
              </select>
            </div>

            {/* Upload PDF */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm">Upload PDF</label>
                {errors.file && (
                  <span className="text-red-400 text-xs">{errors.file}</span>
                )}
              </div>

              <label
                className="
                w-full p-3 bg-[#1f1f1f] border border-gray-600 rounded
                flex items-center justify-between cursor-pointer
                hover:bg-[#252525]
              "
              >
                <span className="text-sm text-gray-300">
                  {file ? file.name : "Choose PDF file"}
                </span>

                <span className="text-orange-500 text-sm font-medium">
                  Browse
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-medium cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isUploading ? "uploading..." : "Upload Notes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNotesPage;
