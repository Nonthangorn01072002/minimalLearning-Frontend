import React, { useState } from "react";
import { X, PenLine } from "lucide-react";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";

interface ModalProps {
  onClose: () => void;
}

function CreateCourseModal({ onClose }: ModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ownerId = useAuthStore((state) => state.userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, ownerId }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Create failed");
      }
      onClose();
      Swal.fire({
        title: "Create success",
        icon: "success",
      }).then(() => {
        window.location.reload();
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
          <h1 className="text-3xl font-extrabold text-black">Create Course</h1>
          <p className="text-3xl font-bold max-w-md text-center text-black">Fill your course detail</p>
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
                placeholder="Enter your title"
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
                placeholder="Enter your description"
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-green-500">
              <PenLine />
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;
