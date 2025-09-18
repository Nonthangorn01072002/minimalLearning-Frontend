import React, { useEffect, useState } from "react";
import { X, ArrowUpFromLine } from "lucide-react";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";
import type { Course } from "../type";

interface ModalProps {
  onClose: () => void;
  id: string;
  onUpdateSuccess: () => void;
}

function EditCourseModal({ onClose, id, onUpdateSuccess }: ModalProps) {
  const [fetchCourse, setFetchCourse] = useState<Course>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ownerId = useAuthStore((state) => state.userId);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URI}/course/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const jsonResponse = await response.json();
        const data: Course = jsonResponse.data;
        setFetchCourse(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/course/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, description, ownerId }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Update failed");
      }
      onClose();
      Swal.fire({
        title: "Update success",
        icon: "success",
      }).then(() => {
        onUpdateSuccess();
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="mt-10 flex flex-col gap-5 text-white">
        <button type="button" onClick={onClose} className="self-end bg-transparent hover:bg-gray-200 p-1 rounded">
          <X />
        </button>
        <div className="bg-white rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4 border-2 border-solid border-black">
          <h1 className="text-3xl font-extrabold text-black">Update Course</h1>
          <p className="text-2xl font-bold max-w-md text-center text-gray-700 ">Fill your course detail</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300 text-black"
                placeholder={fetchCourse?.title}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300 text-black"
                placeholder={fetchCourse?.description}
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-green-500">
              <ArrowUpFromLine />
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
