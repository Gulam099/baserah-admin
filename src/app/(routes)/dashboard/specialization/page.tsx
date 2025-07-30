"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiBaseUrlLocal } from "../../../../../const";
import { Delete, SquarePen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";


type SpecializationType = {
  _id: string;
  name: string;
  type: "en" | "ar";
  subSpecializations: { name: string }[];
  applicableLevels?: string[];
  feeBelow10: number;
  feeAbove10: number;
};


const specialistLevelsMap = [
  { english: "Assistant Specialist", arabic: "أخصائي مساعد" },
  { english: "Specialist", arabic: "أخصائي" },
  { english: "First Specialist", arabic: "أخصائي أول" },
  { english: "Consultant", arabic: "استشاري" },
  { english: "Deputy Specialist Doctor", arabic: "طبيب نائب أخصائي" },
  { english: "First Deputy Specialist Doctor", arabic: "طبيب نائب أول أخصائي" },
  { english: "Consultant Doctor", arabic: "طبيب استشاري" },
  { english: "First Consultant Doctor", arabic: "طبيب استشاري أول" },
];


const SpecializationPage: React.FC = () => {
  const { t } = useTranslation();
  const [specialization, setSpecialization] = useState("");
  const [subSpecializations, setSubSpecializations] = useState<string[]>([""]);
  const [specializationList, setSpecializationList] = useState<SpecializationType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [feeBelow10, setFeeBelow10] = useState<number | "">("");
  const [feeAbove10, setFeeAbove10] = useState<number | "">("");
  const [isArabic, setIsArabic] = useState(false);




  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const res = await fetch(`${ApiBaseUrlLocal}/api/specializations/all`);
      const data = await res.json();
      if (data.success) setSpecializationList(data.data);
      else toast.error(t("toastt.fetchError"));
    } catch {
      toast.error(t("toastt.fetchError"));
    }
  };

  const handleSubChange = (index: number, value: string) => {
    const updated = [...subSpecializations];
    updated[index] = value;
    setSubSpecializations(updated);
  };

  const addSubSpecialization = () => {
    setSubSpecializations([...subSpecializations, ""]);
  };

  const removeSubSpecialization = (index: number) => {
    const updated = subSpecializations.filter((_, i) => i !== index);
    setSubSpecializations(updated);
  };
  const handleSubmit = async () => {
    const langType = isArabic === true ? "ar" : "en";
    const payload = {
      name: specialization,
      subSpecializations: subSpecializations
        .filter((s) => s.trim() !== "")
        .map((s) => ({ name: s })),
      applicableLevels: selectedLevels,
      type: langType,
      feeBelow10: feeBelow10 === "" ? undefined : feeBelow10,
      feeAbove10: feeAbove10 === "" ? undefined : feeAbove10,
    };


    const url = editingId
      ? `${ApiBaseUrlLocal}/api/specializations/update/${editingId}`
      : `${ApiBaseUrlLocal}/api/specializations/create`;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(editingId ? "Specialization updated" : "Specialization created");

        if (editingId) {
          // Update existing
          setSpecializationList((prev) =>
            prev.map((item) =>
              item._id === editingId ? { _id: editingId, ...payload } : item
            )
          );
        } else {
          // Add new at top
          setSpecializationList((prev) => [
            { _id: result._id, ...payload },
            ...prev,
          ]);
        }

        resetForm();
      } else toast.error(result.message || t("toastt.serverError"));
    } catch {
      toast.error(t("toastt.serverError"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${ApiBaseUrlLocal}/api/specializations/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Deleted successfully");
        setSpecializationList((prev) => prev.filter((item) => item._id !== id));
      } else toast.error(data.message || t("toastt.deleteFailed"));
    } catch {
      toast.error(t("toastt.serverError"));
    }
  };

  const handleEdit = (item: SpecializationType) => {
    setSpecialization(item.name);
    setSubSpecializations(item.subSpecializations.map((s) => s.name));
    setEditingId(item._id);
    setSelectedLevels(item.applicableLevels || []);
    setFeeBelow10(item.feeBelow10 ?? "");
    setFeeAbove10(item.feeAbove10 ?? "");
    setFormVisible(true);
    setIsArabic(item.type === "ar");
  };


  const resetForm = () => {
    setSpecialization("");
    setSubSpecializations([""]);
    setEditingId(null);
    setFormVisible(false);
    setSelectedLevels([]);
    setFeeBelow10("");
    setFeeAbove10("");
  };


  const handleLevelToggle = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };


  const filteredList = specializationList
    .slice() // clone array
    .reverse() // newest first
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subSpecializations.some((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4">{t("titlee.specialization")}</h1>


      {/* Top bar: Create and Search */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder={t("placeholder.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        {!formVisible && (
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("button.create")}
          </button>
        )}

      </div>

      {/* Form */}
      {formVisible && (
        <div className="bg-white p-6 border rounded-lg shadow mb-10">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">{t("label.specialization")}</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={t("placeholder.specialization")}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">{t("label.subSpecializations")}</label>
            {subSpecializations.map((sub, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => handleSubChange(index, e.target.value)}
                  placeholder={`${t("placeholder.subSpecialization")} ${index + 1}`}
                  className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                {subSpecializations.length > 1 && (
                  <button
                    onClick={() => removeSubSpecialization(index)}
                    className="px-3 py-1 text-sm text-red-500  rounded"
                  >
                    {t("button.remove")}
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addSubSpecialization}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {t("button.addSub")}
            </button>
          </div>

          <div className="mb-6">
            <div className="mb-4 flex items-center gap-4">
              <label className="text-sm font-medium">{t("label.language")}</label>
              <div className="relative inline-block w-14">
                <input
                  type="checkbox"
                  id="toggleLanguage"
                  checked={isArabic}
                  onChange={() => setIsArabic((prev) => !prev)}
                  className="toggle-checkbox absolute w-6 h-6 rounded-full bg-white border-4 top-1 left-1 appearance-none cursor-pointer transition checked:translate-x-7"
                />
                <label
                  htmlFor="toggleLanguage"
                  className="block overflow-hidden h-8 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <span className="text-sm font-medium">{isArabic ? "Arabic" : "English"}</span>
            </div>

            {/* Applicable Levels */}
            <label className="block mb-2 text-sm font-medium">{t("label.levels")}</label>
            <div className="grid grid-cols-2 gap-2">
              {specialistLevelsMap.map(({ english, arabic }) => {
                const label = isArabic ? arabic : english;
                return (
                  <label key={label} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(label)}
                      onChange={() => handleLevelToggle(label)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">{t("label.feeBelow10")}</label>
            <input
              type="number"
              value={feeBelow10}
              onChange={(e) => setFeeBelow10(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="e.g., 500"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">{t("label.feeAbove10")}</label>
            <input
              type="number"
              value={feeAbove10}
              onChange={(e) => setFeeAbove10(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="e.g., 1000"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>



          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              {editingId ? t("button.update") : t("button.submit")}
            </button>
            <button
              onClick={resetForm}
              className="py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white rounded"
            >
              {t("button.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <h2 className="text-xl font-semibold mb-4">{t("titlee.specializationList")}</h2>
      {filteredList.length === 0 ? (
        <p>{t("message.noData")}</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-3">{t("table.index")}</th>
                <th className="px-4 py-3">{t("table.specialization")}</th>
                <th className="px-4 py-3">{t("table.subSpecializations")}</th>
                <th className="px-4 py-3">{t("table.levels")}</th>
                <th className="px-4 py-3">{t("table.feeBelow10")}</th>
                <th className="px-4 py-3">{t("table.feeAbove10")}</th>
                <th className="px-4 py-3 text-center">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, index) => (
                <tr key={item._id} className="text-sm text-gray-800">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="px-4 py-3 border font-semibold">{item.name}</td>
                  <td className="px-4 py-3 border">
                    <ul className=" list-inside space-y-1">
                      {item.subSpecializations.map((s, i) => (
                        <li key={i}>{s.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 border">
                    {item.applicableLevels && item.applicableLevels.length > 0 ? (
                      <ul className=" list-inside space-y-1">
                        {item.applicableLevels.map((level, idx) => (
                          <li key={idx}>{level}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">{t("label.none")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border">{item.feeBelow10 ?? "-"}</td>
                  <td className="px-4 py-3 border">{item.feeAbove10 ?? "-"}</td>
                  <td className="px-4 py-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default SpecializationPage;
