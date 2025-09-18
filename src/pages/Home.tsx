import React, { useEffect, useState } from "react";
import type { Course } from "../type";
import useAuthStore from "../store/authStore";
import CreateCourseModal from "../components/CreateCourseModal";
import { Trash2, Pen } from "lucide-react";
import Swal from "sweetalert2";
import EditCourseModal from "../components/EditCourseModal";

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.userId);
  const [showCreateCourseModal, setCreateCourseModal] = useState(false);
  const [showEditCourseModal, setEditCourseModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/course/u/${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const jsonResponse = await response.json();
      const data: Course[] = jsonResponse.data;
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchCourses();
  }, [userId]);

  const handleDelete = (name: string, itemId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete this ${name} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URI}/course/${itemId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Delete failed");
          }
          setCourses((prev) => prev.filter((course) => course._id !== itemId));
          Swal.fire({
            title: "Delete success",
            icon: "success",
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">Welcome to Our Website!</h1>
        <p className="text-center text-gray-700">Please login to see your course.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">All Courses</h1>
      <div className="flex justify-end mb-4">
        <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white" onClick={() => setCreateCourseModal(true)}>
          Create Course
        </button>
        {showCreateCourseModal && <CreateCourseModal onClose={() => setCreateCourseModal(false)} />}
      </div>
      <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
        {courses.length === 0 ? (
          <div className="text-center text-gray-600">No Courses found</div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow flex justify-between items-start">
                <div className="flex flex-col space-y-2 flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-900">{course.title}</h2>
                  <p className="text-gray-600 mt-2">{course.description}</p>
                </div>
                <div className="p-2 w-12 h-12 flex items-center justify-end mb-4">
                  <Pen
                    className="cursor-pointer text-green-600 hover:text-green-800 w-full h-full"
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setEditCourseModal(true);
                    }}
                  />
                  {showEditCourseModal && selectedCourseId === course._id && (
                    <EditCourseModal
                      onClose={() => setEditCourseModal(false)}
                      id={course._id}
                      onUpdateSuccess={() => {
                        fetchCourses();
                        setEditCourseModal(false);
                      }}
                    />
                  )}
                </div>
                <div className="p-2 w-12 h-12 flex items-center justify-center">
                  <Trash2 className="cursor-pointer text-red-600 hover:text-red-800 w-full h-full" onClick={() => handleDelete(course.title, course._id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
